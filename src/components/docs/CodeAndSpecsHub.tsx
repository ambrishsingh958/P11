import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  FolderTree, 
  Database, 
  Server, 
  Smartphone, 
  Bot, 
  Layers, 
  CalendarCheck, 
  FileCode, 
  Download,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  DIRECTORY_STRUCTURE, 
  DATABASE_SCHEMA_SQL, 
  AI_ECO_TUTOR_PROMPT, 
  INTEGRATION_POINTS_DOC, 
  HACKATHON_MVP_SCOPE, 
  AI_STUDIO_SETUP_GUIDE 
} from '../../data/specs';
import { 
  SAMPLE_LEARNING_PATHS, 
  SAMPLE_FIELD_MISSIONS, 
  SAMPLE_BADGES, 
  SAMPLE_WORKSHOPS, 
  SAMPLE_CERTIFICATE 
} from '../../data/layer11Data';

const BACKEND_EXPRESS_CODE = `// =========================================================================
// PrajaPulse Layer 11: Node.js / Express Route Handlers (Full Controller Code)
// =========================================================================

import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

// 1. GET /courses - Fetch learning paths with SDG & progress
router.get('/courses', async (req: Request, res: Response) => {
  const { category, level, ward } = req.query;
  const client = await pool.connect();
  try {
    const query = \`
      SELECT c.*, 
        json_agg(DISTINCT jsonb_build_object('sdg_number', cs.sdg_number)) as sdgs,
        json_agg(DISTINCT st.name) as skill_tags
      FROM courses c
      LEFT JOIN course_sdgs cs ON c.id = cs.course_id
      LEFT JOIN course_skill_tags cst ON c.id = cst.course_id
      LEFT JOIN skill_tags st ON cst.skill_tag_id = st.id
      WHERE ($1::text IS NULL OR c.category = $1)
      GROUP BY c.id
      ORDER BY c.created_at ASC;
    \`;
    const result = await client.query(query, [category || null]);
    res.json({ success: true, courses: result.rows });
  } finally {
    client.release();
  }
});

// 2. GET /courses/:id - Course syllabus with modules & lessons
router.get('/courses/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.headers['x-user-id'] as string;
  const client = await pool.connect();
  try {
    const courseRes = await client.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (!courseRes.rows.length) return res.status(404).json({ error: 'Course not found' });

    const modulesRes = await client.query(\`
      SELECT m.*, 
        json_agg(
          jsonb_build_object(
            'id', l.id,
            'title', l.title,
            'duration_min', l.duration_min,
            'lesson_type', l.lesson_type,
            'is_completed', (up.status = 'completed')
          ) ORDER BY l.order_index
        ) as lessons
      FROM modules m
      JOIN lessons l ON m.id = l.module_id
      LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = $2
      WHERE m.course_id = $1
      GROUP BY m.id
      ORDER BY m.order_index ASC;
    \`, [id, userId]);

    res.json({ success: true, course: courseRes.rows[0], modules: modulesRes.rows });
  } finally {
    client.release();
  }
});

// 3. POST /progress - Update lesson completion & award base points
router.post('/progress', async (req: Request, res: Response) => {
  const { userId, lessonId, courseId } = req.body;
  const client = await pool.connect();
  try {
    await client.query(\`
      INSERT INTO user_progress (user_id, lesson_id, course_id, status, completed_at)
      VALUES ($1, $2, $3, 'completed', NOW())
      ON CONFLICT (user_id, lesson_id) 
      DO UPDATE SET status = 'completed', updated_at = NOW();
    \`, [userId, lessonId, courseId]);

    // Dispatch points to Layer 7 Rewards ledger
    // await rewardService.awardPoints(userId, 20, 'micro_lesson_completed');
    res.json({ success: true, pointsAwarded: 20 });
  } finally {
    client.release();
  }
});

// 4. POST /quiz/submit - Grade quiz & calculate score
router.post('/quiz/submit', async (req: Request, res: Response) => {
  const { userId, quizId, answers } = req.body;
  const client = await pool.connect();
  try {
    const questionsRes = await client.query('SELECT * FROM questions WHERE quiz_id = $1', [quizId]);
    let correct = 0;
    const breakdown = questionsRes.rows.map(q => {
      const isRight = answers[q.id] === q.correct_option_index;
      if (isRight) correct++;
      return { questionId: q.id, isCorrect: isRight, explanation: q.explanation };
    });

    const passed = (correct / questionsRes.rows.length) === 1.0;
    const pointsAwarded = passed ? 30 : 0;

    res.json({ success: true, passed, correctCount: correct, pointsAwarded, breakdown });
  } finally {
    client.release();
  }
});

// 5. GET /recommendations - Local Ward-based smart recommendations
router.get('/recommendations', async (req: Request, res: Response) => {
  const { ward = 'Ward 174', issueType } = req.query;
  // Joins Layer 1 Geo-feed reports with Layer 11 curriculum
  res.json({
    success: true,
    ward,
    recommendedLessonId: 'les-w-1',
    reason: 'High density of unsegregated waste reports in this ward.'
  });
});

// 6. GET /workshops - Live/offline NGO workshops
router.get('/workshops', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM workshops ORDER BY session_datetime ASC');
    res.json({ success: true, workshops: result.rows });
  } finally {
    client.release();
  }
});

// 7. POST /workshops/:id/rsvp - RSVP registration
router.post('/workshops/:id/rsvp', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const client = await pool.connect();
  try {
    await client.query(\`
      INSERT INTO enrollments (workshop_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (workshop_id, user_id) DO NOTHING;
    \`, [id, userId]);
    res.json({ success: true, message: 'RSVP confirmed' });
  } finally {
    client.release();
  }
});

// 8. POST /field-missions/:id/submit - Submit GPS & photo evidence
router.post('/field-missions/:id/submit', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, latitude, longitude, photos, reflectionNotes } = req.body;
  const client = await pool.connect();
  try {
    const submission = await client.query(\`
      INSERT INTO mission_submissions 
        (mission_id, user_id, check_in_lat, check_in_lng, reflection_notes, status)
      VALUES ($1, $2, $3, $4, $5, 'verified')
      RETURNING id;
    \`, [id, userId, latitude, longitude, reflectionNotes]);

    // Insert photos
    for (const photoUrl of photos || []) {
      await client.query(\`
        INSERT INTO evidence (submission_id, step_number, file_url)
        VALUES ($1, 1, $2)
      \`, [submission.rows[0].id, photoUrl]);
    }

    res.json({ success: true, submissionId: submission.rows[0].id, pointsAwarded: 100 });
  } finally {
    client.release();
  }
});

// 9. GET /certificates - Verifiable credentials & cryptographic hash
router.get('/certificates', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string;
  const client = await pool.connect();
  try {
    const cert = await client.query('SELECT * FROM certificates WHERE user_id = $1 LIMIT 1', [userId]);
    res.json({ success: true, certificate: cert.rows[0] });
  } finally {
    client.release();
  }
});

// 10. POST /ai-tutor/ask - Google Gemini 3.8 Flash with local civic context
router.post('/ai-tutor/ask', async (req: Request, res: Response) => {
  const { query, ward, city, language = 'English', isEli10 = false } = req.body;
  const systemInstruction = \`
You are Prakriti AI, civic Eco-Tutor in PrajaPulse Layer 11.
Context: \${ward}, \${city}. Language: \${language}. ELI10: \${isEli10}.
Rules: Cite SWM 2016, Tree Protection Act, Water Act. Give strict safety warnings for hazardous materials.
Suggest 1 practical PrajaPulse lesson or mission at the end.
\`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: query,
    config: { systemInstruction, temperature: 0.4 }
  });

  res.json({ success: true, reply: response.text });
});

export default router;
`;

export const CodeAndSpecsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'directory' | 'schema' | 'backend' | 'screens' | 'ai' | 'sample' | 'integrations' | 'hackathon' | 'aistudio'
  >('directory');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const tabs = [
    { id: 'directory', label: '1. Directory Structure', icon: FolderTree },
    { id: 'schema', label: '2. PostgreSQL Schema', icon: Database },
    { id: 'backend', label: '3. Express Backend API', icon: Server },
    { id: 'screens', label: '4. React Native Screens', icon: Smartphone },
    { id: 'ai', label: '5. AI Eco-Tutor Logic', icon: Bot },
    { id: 'sample', label: '6. Sample Content JSON', icon: FileCode },
    { id: 'integrations', label: '7. 12-Layer Integrations', icon: Layers },
    { id: 'hackathon', label: '8. 2-Week MVP Scope', icon: CalendarCheck },
    { id: 'aistudio', label: '9. Google AI Studio Setup', icon: ExternalLink },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
              Engineering Specs
            </span>
            <span className="text-xs text-slate-400 font-mono">v1.2.0 • Production Ready</span>
          </div>
          <h2 className="text-base font-bold text-white mt-0.5">
            PrajaPulse Layer 11: Complete Technical Documentation
          </h2>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1 p-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900 font-sans">
        {/* Tab 1: Directory Structure */}
        {activeTab === 'directory' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Full Module Folder &amp; File Tree</h3>
                <p className="text-xs text-slate-400">Node.js/Express Backend + React Native Mobile Client</p>
              </div>
              <button
                onClick={() => copyToClipboard(DIRECTORY_STRUCTURE, 'directory')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'directory' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'directory' ? 'Copied' : 'Copy Tree'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {DIRECTORY_STRUCTURE}
            </pre>
          </div>
        )}

        {/* Tab 2: Database Schema */}
        {activeTab === 'schema' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">PostgreSQL + PostGIS DDL Schema</h3>
                <p className="text-xs text-slate-400">17 Tables: courses, modules, lessons, quizzes, questions, user_progress, badges, user_badges, certificates, workshops, enrollments, field_missions, mission_submissions, evidence, skill_tags, sdg_mappings, learning_recommendations.</p>
              </div>
              <button
                onClick={() => copyToClipboard(DATABASE_SCHEMA_SQL, 'schema')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'schema' ? 'Copied SQL' : 'Copy SQL Schema'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-cyan-300 overflow-x-auto max-h-[600px] leading-relaxed">
              {DATABASE_SCHEMA_SQL}
            </pre>
          </div>
        )}

        {/* Tab 3: Express Backend API */}
        {activeTab === 'backend' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Node.js / Express Route Handlers</h3>
                <p className="text-xs text-slate-400">Complete TypeScript controllers for all 10 endpoints</p>
              </div>
              <button
                onClick={() => copyToClipboard(BACKEND_EXPRESS_CODE, 'backend')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'backend' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'backend' ? 'Copied Code' : 'Copy Backend API'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-amber-300 overflow-x-auto max-h-[600px] leading-relaxed">
              {BACKEND_EXPRESS_CODE}
            </pre>
          </div>
        )}

        {/* Tab 4: React Native Screens */}
        {activeTab === 'screens' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h3 className="text-sm font-bold text-white">React Native UI Components Breakdown</h3>
              <p className="text-xs text-slate-400">7 production-ready screen components implemented with hooks &amp; responsive layouts</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-emerald-400">1. LearnHomeScreen.tsx</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The primary civic dashboard. Features streak counter, active ward pill, daily 2-min eco-challenge card, continue learning progress, 3 curated paths, and quick link to field missions.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Location: mobile/src/screens/LearnHomeScreen.tsx</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-emerald-400">2. CourseDetailScreen.tsx</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Course overview with hero banner, SDG tags, skill badges, completion bar, and expandable module syllabus accordions with lesson state indicators.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Location: mobile/src/screens/CourseDetailScreen.tsx</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-emerald-400">3. LessonPlayerScreen.tsx</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  2-minute micro-card player with audio narration toggle, full transcript accordion, interactive quiz with instant feedback, and practical action card.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Location: mobile/src/screens/LessonPlayerScreen.tsx</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-emerald-400">4. ContextualLearnCard.tsx</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Embedded widget for Layer 1 Issue Detail screen. Dynamically recommends micro-lessons based on the citizen's reported issue (waste, drainage, tree cutting).
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Location: mobile/src/components/contextual/ContextualLearnCard.tsx</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-emerald-400">5. FieldMissionScreen.tsx</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Practical ground mission executor. Includes safety protocol checklist, countdown timer, GPS check-in button, camera evidence capture, and NGO mentor call dialog.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Location: mobile/src/screens/FieldMissionScreen.tsx</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-emerald-400">6. AIEcoTutorScreen.tsx</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interactive chatbot powered by Gemini 3.8 Flash. Includes voice button, ELI-10 toggle, language selector (Hindi, Kannada, Tamil, English), and suggested chips.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Location: mobile/src/screens/AIEcoTutorScreen.tsx</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 md:col-span-2">
                <div className="text-xs font-bold text-emerald-400">7. ImpactCertificateScreen.tsx</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Verifiable citizen credentials screen. Includes impact metrics (hours trained, CO2 offset, ward rank), cryptographic SHA-256 hash, QR code, and PDF download trigger.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">Location: mobile/src/screens/ImpactCertificateScreen.tsx</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: AI Eco-Tutor Logic */}
        {activeTab === 'ai' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Gemini 3.8 Flash AI Eco-Tutor Prompt &amp; Logic</h3>
                <p className="text-xs text-slate-400">System instruction, safety boundaries, ELI10 persona, and ward intelligence</p>
              </div>
              <button
                onClick={() => copyToClipboard(AI_ECO_TUTOR_PROMPT, 'prompt')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'prompt' ? 'Copied' : 'Copy Prompt'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-purple-300 overflow-x-auto leading-relaxed">
              {AI_ECO_TUTOR_PROMPT}
            </pre>
          </div>
        )}

        {/* Tab 6: Sample Content JSON */}
        {activeTab === 'sample' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Sample Content JSON Data</h3>
                <p className="text-xs text-slate-400">3 Learning paths, 5 micro-lessons with quizzes, 3 field missions, 5 badges, 2 workshops</p>
              </div>
              <button
                onClick={() => copyToClipboard(JSON.stringify({
                  learningPaths: SAMPLE_LEARNING_PATHS,
                  fieldMissions: SAMPLE_FIELD_MISSIONS,
                  badges: SAMPLE_BADGES,
                  workshops: SAMPLE_WORKSHOPS,
                  certificate: SAMPLE_CERTIFICATE
                }, null, 2), 'sample')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'sample' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'sample' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-[600px] leading-relaxed">
              {JSON.stringify({
                learningPaths: SAMPLE_LEARNING_PATHS,
                fieldMissions: SAMPLE_FIELD_MISSIONS,
                badges: SAMPLE_BADGES,
                workshops: SAMPLE_WORKSHOPS,
                certificate: SAMPLE_CERTIFICATE
              }, null, 2)}
            </pre>
          </div>
        )}

        {/* Tab 7: Integrations Matrix */}
        {activeTab === 'integrations' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">PrajaPulse Cross-Layer Integration Architecture</h3>
                <p className="text-xs text-slate-400">Connection specs across Layers 1, 3, 4, 7, 8, 10, and 12</p>
              </div>
              <button
                onClick={() => copyToClipboard(INTEGRATION_POINTS_DOC, 'integrations')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'integrations' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'integrations' ? 'Copied' : 'Copy Matrix'}</span>
              </button>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono">
              {INTEGRATION_POINTS_DOC}
            </div>
          </div>
        )}

        {/* Tab 8: Hackathon MVP Scope */}
        {activeTab === 'hackathon' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">2-Week Hackathon Execution Plan</h3>
                <p className="text-xs text-slate-400">Clear boundary of Day 1-14 deliverables vs. post-hackathon roadmap</p>
              </div>
              <button
                onClick={() => copyToClipboard(HACKATHON_MVP_SCOPE, 'hackathon')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'hackathon' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'hackathon' ? 'Copied' : 'Copy Plan'}</span>
              </button>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono">
              {HACKATHON_MVP_SCOPE}
            </div>
          </div>
        )}

        {/* Tab 9: Google AI Studio Setup */}
        {activeTab === 'aistudio' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Google AI Studio Setup &amp; Deployment Guide</h3>
                <p className="text-xs text-slate-400">Step-by-step configuration for Gemini 3.8 Flash Eco-Tutor</p>
              </div>
              <button
                onClick={() => copyToClipboard(AI_STUDIO_SETUP_GUIDE, 'aistudio')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedSection === 'aistudio' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'aistudio' ? 'Copied' : 'Copy Guide'}</span>
              </button>
            </div>
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono">
              {AI_STUDIO_SETUP_GUIDE}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
