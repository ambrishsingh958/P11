import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  SAMPLE_LEARNING_PATHS,
  SAMPLE_FIELD_MISSIONS,
  SAMPLE_BADGES,
  SAMPLE_WORKSHOPS,
  SAMPLE_CERTIFICATE,
  LOCAL_WARD_ISSUES,
  Course,
  FieldMission,
  Workshop
} from './src/data/layer11Data.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory persistent state for simulated live sessions
let userProgressStore: Record<string, { completedLessons: string[]; points: number; quizScores: Record<string, number> }> = {
  'user-citizen-1': {
    completedLessons: ['les-w-1'],
    points: 125,
    quizScores: { 'quiz-w-1': 100 }
  }
};

let workshopRegistrations: Record<string, boolean> = {
  'ws-compost-101': true
};

let missionSubmissionsStore: any[] = [];

// Initialize Gemini client if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// -------------------------------------------------------------
// 1. GET /api/courses - List all learning paths with filter support
// -------------------------------------------------------------
app.get('/api/courses', (req: Request, res: Response) => {
  const { category, level, search } = req.query;
  let results: Course[] = [...SAMPLE_LEARNING_PATHS];

  if (category && category !== 'all') {
    results = results.filter((c) => c.category === category);
  }
  if (level && level !== 'all') {
    results = results.filter((c) => c.level === level);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.skillTags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Attach dynamic user completion count
  const userId = (req.query.userId as string) || 'user-citizen-1';
  const userCompleted = userProgressStore[userId]?.completedLessons || [];
  const mapped = results.map((course) => {
    const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const completedCount = allLessonIds.filter((id) => userCompleted.includes(id)).length;
    return {
      ...course,
      completedLessons: completedCount
    };
  });

  res.json({
    success: true,
    count: mapped.length,
    courses: mapped
  });
});

// -------------------------------------------------------------
// 2. GET /api/courses/:id - Course detail with modules & lessons
// -------------------------------------------------------------
app.get('/api/courses/:id', (req: Request, res: Response) => {
  const course = SAMPLE_LEARNING_PATHS.find((c) => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }

  const userId = (req.query.userId as string) || 'user-citizen-1';
  const userCompleted = userProgressStore[userId]?.completedLessons || [];
  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const completedCount = allLessonIds.filter((id) => userCompleted.includes(id)).length;

  res.json({
    success: true,
    course: {
      ...course,
      completedLessons: completedCount,
      isEnrolled: true,
      progressPercentage: Math.round((completedCount / (course.lessonsCount || 1)) * 100)
    }
  });
});

// -------------------------------------------------------------
// 3. POST /api/progress - Mark lesson completion & award points
// -------------------------------------------------------------
app.post('/api/progress', (req: Request, res: Response) => {
  const { userId = 'user-citizen-1', lessonId, courseId } = req.body;
  if (!lessonId) {
    return res.status(400).json({ success: false, error: 'lessonId is required' });
  }

  if (!userProgressStore[userId]) {
    userProgressStore[userId] = { completedLessons: [], points: 0, quizScores: {} };
  }

  const userRecord = userProgressStore[userId];
  const isNewlyCompleted = !userRecord.completedLessons.includes(lessonId);

  if (isNewlyCompleted) {
    userRecord.completedLessons.push(lessonId);
    userRecord.points += 20; // 20 base points for reading micro-lesson
  }

  res.json({
    success: true,
    message: isNewlyCompleted ? 'Lesson completed! +20 Eco-Points awarded.' : 'Lesson already completed.',
    pointsEarned: isNewlyCompleted ? 20 : 0,
    totalPoints: userRecord.points,
    completedLessonsCount: userRecord.completedLessons.length
  });
});

// -------------------------------------------------------------
// 4. POST /api/quiz/submit - Grade quiz & award points
// -------------------------------------------------------------
app.post('/api/quiz/submit', (req: Request, res: Response) => {
  const { userId = 'user-citizen-1', quizId, answers } = req.body;
  // Find quiz
  let foundQuiz: any = null;
  let targetLessonId = '';

  for (const course of SAMPLE_LEARNING_PATHS) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (lesson.quiz.id === quizId) {
          foundQuiz = lesson.quiz;
          targetLessonId = lesson.id;
          break;
        }
      }
    }
  }

  if (!foundQuiz) {
    return res.status(404).json({ success: false, error: 'Quiz not found' });
  }

  let correctCount = 0;
  const questionResults = foundQuiz.questions.map((q: any) => {
    const userAnswer = answers?.[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      civicTip: q.civicTip
    };
  });

  const scorePercentage = Math.round((correctCount / foundQuiz.questions.length) * 100);
  const passed = scorePercentage >= foundQuiz.passingScore;

  if (!userProgressStore[userId]) {
    userProgressStore[userId] = { completedLessons: [], points: 0, quizScores: {} };
  }

  let pointsEarned = 0;
  if (passed) {
    pointsEarned = foundQuiz.points;
    userProgressStore[userId].points += pointsEarned;
    userProgressStore[userId].quizScores[quizId] = scorePercentage;
    if (!userProgressStore[userId].completedLessons.includes(targetLessonId)) {
      userProgressStore[userId].completedLessons.push(targetLessonId);
    }
  }

  res.json({
    success: true,
    passed,
    scorePercentage,
    correctCount,
    totalQuestions: foundQuiz.questions.length,
    pointsEarned,
    totalUserPoints: userProgressStore[userId].points,
    breakdown: questionResults,
    rewardBadge: passed ? 'badge-eco-rookie' : null
  });
});

// -------------------------------------------------------------
// 5. GET /api/recommendations - Smart recommendations based on Ward
// -------------------------------------------------------------
app.get('/api/recommendations', (req: Request, res: Response) => {
  const { ward = 'Ward 174', issueType } = req.query;
  const matchedIssue = LOCAL_WARD_ISSUES.find((i) => i.ward.includes(ward as string)) || LOCAL_WARD_ISSUES[0];

  const recommendedCourse = SAMPLE_LEARNING_PATHS[0];
  const recommendedMission = SAMPLE_FIELD_MISSIONS[0];

  res.json({
    success: true,
    ward,
    localIssueContext: matchedIssue,
    recommendedLesson: {
      lessonId: 'les-w-1',
      courseId: 'path-waste-circularity',
      title: 'Color Coding & Sanitary Waste Sealing',
      reason: `High incident of mixed waste dumping reported in ${ward}. Master the 3-bin rules.`
    },
    recommendedMission,
    recommendedCourse: {
      id: recommendedCourse.id,
      title: recommendedCourse.title,
      durationMin: recommendedCourse.durationMin,
      points: recommendedCourse.points
    }
  });
});

// -------------------------------------------------------------
// 6. GET /api/workshops - List upcoming workshops
// -------------------------------------------------------------
app.get('/api/workshops', (req: Request, res: Response) => {
  const mapped = SAMPLE_WORKSHOPS.map((ws) => ({
    ...ws,
    isRegistered: !!workshopRegistrations[ws.id]
  }));

  res.json({
    success: true,
    workshops: mapped
  });
});

// -------------------------------------------------------------
// 7. POST /api/workshops/:id/rsvp - RSVP to workshop
// -------------------------------------------------------------
app.post('/api/workshops/:id/rsvp', (req: Request, res: Response) => {
  const { id } = req.params;
  const workshop = SAMPLE_WORKSHOPS.find((w) => w.id === id);
  if (!workshop) {
    return res.status(404).json({ success: false, error: 'Workshop not found' });
  }

  const currentlyRegistered = !!workshopRegistrations[id];
  workshopRegistrations[id] = !currentlyRegistered;

  res.json({
    success: true,
    workshopId: id,
    isRegistered: workshopRegistrations[id],
    message: workshopRegistrations[id]
      ? `Successfully RSVP'd for ${workshop.title}! Added to calendar.`
      : `RSVP cancelled for ${workshop.title}.`
  });
});

// -------------------------------------------------------------
// 8. POST /api/field-missions/:id/submit - Submit field verification
// -------------------------------------------------------------
app.post('/api/field-missions/:id/submit', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId = 'user-citizen-1', latitude, longitude, photos, reflectionNotes } = req.body;

  const mission = SAMPLE_FIELD_MISSIONS.find((m) => m.id === id);
  if (!mission) {
    return res.status(404).json({ success: false, error: 'Mission not found' });
  }

  const submission = {
    submissionId: `sub-${Date.now()}`,
    missionId: id,
    userId,
    latitude: latitude || 12.9165,
    longitude: longitude || 77.6101,
    photosCount: photos?.length || 1,
    reflectionNotes: reflectionNotes || 'Conducted neighborhood audit. Residents agreed to wrap sanitary waste.',
    pointsAwarded: mission.points,
    status: 'verified',
    submittedAt: new Date().toISOString(),
    txHash: `0x${Math.random().toString(16).substring(2, 10)}${Date.now()}`
  };

  missionSubmissionsStore.push(submission);

  if (!userProgressStore[userId]) {
    userProgressStore[userId] = { completedLessons: [], points: 0, quizScores: {} };
  }
  userProgressStore[userId].points += mission.points;

  res.json({
    success: true,
    message: `Mission Verified! You earned ${mission.points} Eco-Points and unlocked the ${mission.badgeRewardId} badge!`,
    submission,
    newTotalPoints: userProgressStore[userId].points,
    badgeUnlocked: mission.badgeRewardId
  });
});

// -------------------------------------------------------------
// 9. GET /api/certificates - Fetch user certificates & badges
// -------------------------------------------------------------
app.get('/api/certificates', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user-citizen-1';
  const points = userProgressStore[userId]?.points || 125;

  res.json({
    success: true,
    certificate: SAMPLE_CERTIFICATE,
    badges: SAMPLE_BADGES.map((b) => ({
      ...b,
      isUnlocked: (points >= b.pointsRequired) || !!b.unlockedAt
    })),
    stats: {
      totalPoints: points,
      completedMissions: 2,
      hoursTrained: 12.5,
      wardRank: 4,
      carbonOffsetKg: 48.2
    }
  });
});

// -------------------------------------------------------------
// 10. POST /api/ai-tutor/ask - Gemini AI Eco-Tutor with local context
// -------------------------------------------------------------
app.post('/api/ai-tutor/ask', async (req: Request, res: Response) => {
  const {
    query,
    ward = 'Ward 174 (HSR Layout)',
    city = 'Bengaluru',
    language = 'English',
    isEli10 = false,
    history = []
  } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, error: 'Query is required' });
  }

  const systemInstruction = `
You are "Prakriti AI", the friendly, hyper-local civic AI Eco-Tutor for PrajaPulse Layer 11 (Environmental Education & Training).
Your goal: Turn citizens into environmentally aware, legally empowered, and action-oriented civic leaders.

CONTEXT:
- User Ward: ${ward}
- City: ${city}
- Preferred Language: ${language}
- Mode: ${isEli10 ? 'EXPLAIN LIKE I AM 10 YEARS OLD (Use vivid analogies, simple fun language, no complex jargon)' : 'Standard Civic Expert (Accurate municipal laws, civic acts, and actionable steps)'}

RULES:
1. Always ground advice in real civic by-laws (e.g. Solid Waste Management Rules 2016, Water Act 1974, Tree Protection Act, 74th Amendment Ward Committees).
2. Safety first! If dealing with toxic waste, sewage, or sharp medical debris, explicitly warn against bare-hand contact and mention municipal hazardous centers.
3. Suggest 1 concrete PrajaPulse action or micro-lesson at the end:
   - Micro-Lesson: "Color Coding & Sanitary Waste Sealing"
   - Field Mission: "Ward Zero-Waste Segregation Audit"
4. Reply in ${language}. If Hindi or regional language is selected, maintain authentic terms (e.g., geela/sookha kachra, Ward Sabha, Jal, Swachhata).
5. Keep response under 180 words, highly readable with bullet points.
`;

  // Attempt real Gemini call if API key configured
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.4
        }
      });

      const replyText = response.text || 'Thank you for protecting our urban commons. Let us take civic action together!';

      return res.json({
        success: true,
        source: 'gemini-3.8-flash',
        reply: replyText,
        suggestedActions: [
          { title: 'Take 2-min Segregation Lesson', target: 'les-w-1', type: 'lesson' },
          { title: 'Start Ward Audit Mission', target: 'mission-waste-seg', type: 'mission' }
        ]
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, switching to local civic engine fallback:', err?.message || err);
    }
  }

  // Intelligent civic fallback engine when API key is not configured or offline
  let fallbackReply = '';

  if (isEli10) {
    if (query.toLowerCase().includes('water') || query.toLowerCase().includes('rain')) {
      fallbackReply = `🌧️ **Imagine your roof is a giant eco-umbrella!**\n\nWhen rain falls on your terrace in ${ward}, instead of letting that clean water get dirty on the road, we guide it down pipes into a clean filter and a big underground water bank (a recharge well)!\n\n🌱 That water sleeps deep under the earth and refills your borewell so your garden stays green all summer!`;
    } else if (query.toLowerCase().includes('waste') || query.toLowerCase().includes('segregat') || query.toLowerCase().includes('plastic')) {
      fallbackReply = `🗑️ **The 3-Friend Bin Rule for ${ward}:**\n\n1. **Green Bin (Wet):** Banana peels, cooked rice, tea leaves (worms love eating these to make super soil!).\n2. **Blue Bin (Dry):** Washed milk packets, cardboard, clean toy plastic.\n3. **Red Cross Paper (Care):** Band-aids and bathroom waste must be wrapped like a sealed parcel with a red cross so our sanitation heroes never hurt their hands!`;
    } else {
      fallbackReply = `🌍 **Eco-Buddy Tip for ${ward}:**\n\nNature works in circles! When we recycle and compost, nothing is wasted. You can be the Eco-Captain of your lane by checking that trash doesn't get dumped on footpaths and planting trees with your neighbors!`;
    }
  } else {
    if (query.toLowerCase().includes('segregat') || query.toLowerCase().includes('waste') || query.toLowerCase().includes('plastic')) {
      fallbackReply = `♻️ **SWM Rules 2016 Mandate for ${ward}:**\n\n• **Wet Waste (Green):** Kitchen organics & food waste. Must be handed over daily to municipal tippers for biomethanation or home composting.\n• **Dry Waste (Blue):** Rinse and dry milk bags and containers. Hand over to authorized Dry Waste Collection Centers (DWCC).\n• **Sanitary Waste:** Rule 4 requires sanitary pads/diapers to be securely wrapped in newspaper with a distinct red symbol.\n\n⚠️ **Safety Notice:** Do NOT burn mixed plastics—it releases carcinogenic dioxins. Report chronic dumps directly on PrajaPulse Layer 1.`;
    } else if (query.toLowerCase().includes('water') || query.toLowerCase().includes('tanker') || query.toLowerCase().includes('rain')) {
      fallbackReply = `💧 **Rooftop Rainwater & Aquifer Literacy for ${city}:**\n\n• Under municipal building by-laws, plots >1200 sq.ft must install Rainwater Harvesting (RWH).\n• A 100 sq.meter roof yields ~90,000 liters of recharge annually.\n• Direct runoff into a dual-chamber silt filter before connecting to open recharge wells (minimum 10-15 ft depth).\n• Test tap TDS (<300 ppm) and pH (6.5–8.5) before consumption.`;
    } else if (query.toLowerCase().includes('tree') || query.toLowerCase().includes('cut') || query.toLowerCase().includes('fell')) {
      fallbackReply = `🌳 **Legal Protection under the Tree Preservation Act:**\n\n• No municipal contractor or private builder can cut roadside trees without Tree Officer permission and a mandatory 15-day public notice.\n• If cutting is underway: Ask for the written permit order, take geotagged photos of vehicles, and dial the Tree Officer helpline.\n• Lodge a flash grievance on PrajaPulse Layer 1 with exact GPS coordinates.`;
    } else {
      fallbackReply = `🌿 **Civic Action Advisory for ${ward}:**\n\nEnvironmental protection is a fundamental duty under Article 51A(g) of the Constitution of India. As a citizen in ${city}, you can propose ward-level green budgets during monthly Ward Committee meetings.\n\n• Check the daily eco-card for today's micro-challenge.\n• Complete the 2-minute micro-lesson below to earn points!`;
    }
  }

  res.json({
    success: true,
    source: 'prajapulse-civic-engine',
    reply: fallbackReply,
    suggestedActions: [
      { title: 'Take 2-min Segregation Lesson', target: 'les-w-1', type: 'lesson' },
      { title: 'Start Ward Audit Mission', target: 'mission-waste-seg', type: 'mission' }
    ]
  });
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[PrajaPulse Layer 11] Full-stack engine running on http://localhost:${PORT}`);
  });
}

startServer();
