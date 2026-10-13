/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Code, 
  Server, 
  BookOpen, 
  Bot, 
  Compass, 
  Award, 
  MapPin, 
  Flame, 
  Monitor,
  Menu,
  X,
  Leaf
} from 'lucide-react';
import { 
  SAMPLE_LEARNING_PATHS, 
  SAMPLE_FIELD_MISSIONS, 
  SAMPLE_BADGES, 
  SAMPLE_WORKSHOPS, 
  SAMPLE_CERTIFICATE,
  LOCAL_WARD_ISSUES,
  Course,
  Lesson,
  FieldMission,
  Workshop
} from './data/layer11Data';
import { MobileFrame } from './components/common/MobileFrame';
import { LearnHomeScreen } from './components/screens/LearnHomeScreen';
import { CourseDetailScreen } from './components/screens/CourseDetailScreen';
import { LessonPlayerScreen } from './components/screens/LessonPlayerScreen';
import { FieldMissionScreen } from './components/screens/FieldMissionScreen';
import { AIEcoTutorScreen } from './components/screens/AIEcoTutorScreen';
import { ImpactCertificateScreen } from './components/screens/ImpactCertificateScreen';
import { ContextualLearnCard } from './components/screens/ContextualLearnCard';

// Website Views
import { WebHomeView } from './components/screens/WebHomeView';
import { WebCourseDetailView } from './components/screens/WebCourseDetailView';
import { WebLessonPlayerView } from './components/screens/WebLessonPlayerView';
import { WebFieldMissionView } from './components/screens/WebFieldMissionView';
import { WebAIEcoTutorView } from './components/screens/WebAIEcoTutorView';
import { WebImpactCertificateView } from './components/screens/WebImpactCertificateView';

// Docs & Developer Tools
import { CodeAndSpecsHub } from './components/docs/CodeAndSpecsHub';
import { ApiTester } from './components/docs/ApiTester';

type PrimaryPortalMode = 'website' | 'mobile_sim' | 'specs' | 'api';
type WebsiteSubView = 
  | 'home' 
  | 'course_detail' 
  | 'lesson_player' 
  | 'field_mission' 
  | 'ai_tutor' 
  | 'certificates' 
  | 'contextual_demo';

export default function App() {
  const [portalMode, setPortalMode] = useState<PrimaryPortalMode>('website');
  const [activeWebView, setActiveWebView] = useState<WebsiteSubView>('home');
  const [activeMobileScreen, setActiveMobileScreen] = useState<string>('home');
  
  // Dynamic App State
  const [courses, setCourses] = useState<Course[]>(SAMPLE_LEARNING_PATHS);
  const [missions, setMissions] = useState<FieldMission[]>(SAMPLE_FIELD_MISSIONS);
  const [workshops, setWorkshops] = useState<Workshop[]>(SAMPLE_WORKSHOPS);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(SAMPLE_LEARNING_PATHS[0].id);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(SAMPLE_LEARNING_PATHS[0].modules[0].lessons[0]);
  const [selectedMissionId, setSelectedMissionId] = useState<string>(SAMPLE_FIELD_MISSIONS[0].id);
  const [userPoints, setUserPoints] = useState<number>(145);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['les-w-1']);
  const [selectedWard, setSelectedWard] = useState<string>('Ward 174 (HSR Layout)');
  const [aiPrefillQuery, setAiPrefillQuery] = useState<string>('');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const selectedMission = missions.find((m) => m.id === selectedMissionId) || missions[0];

  const handleLessonCompleted = (lessonId: string, pointsEarned: number) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
    }
    setUserPoints((prev) => prev + pointsEarned);
  };

  const handleEarnPoints = (points: number) => {
    setUserPoints((prev) => prev + points);
  };

  const handleMissionCompleted = (missionId: string, pointsEarned: number) => {
    setUserPoints((prev) => prev + pointsEarned);
  };

  const handleRsvpWorkshop = (workshopId: string) => {
    setWorkshops((prev) =>
      prev.map((w) => {
        if (w.id === workshopId) {
          const newStatus = !w.isRegistered;
          return {
            ...w,
            isRegistered: newStatus,
            registeredCount: newStatus ? w.registeredCount + 1 : w.registeredCount - 1
          };
        }
        return w;
      })
    );
  };

  const handleNavigateToAction = (actionType: string, targetId?: string) => {
    if (actionType === 'field_mission') {
      if (targetId) setSelectedMissionId(targetId);
      setActiveWebView('field_mission');
      setActiveMobileScreen('field_mission');
    } else {
      setActiveWebView('contextual_demo');
      setActiveMobileScreen('contextual_demo');
    }
  };

  const handleOpenAiTutorWithQuery = (query?: string) => {
    if (query) setAiPrefillQuery(query);
    setActiveWebView('ai_tutor');
    setActiveMobileScreen('ai_tutor');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F7F6F0] text-[#1B2D22] overflow-hidden font-sans">
      
      {/* Top Bar Contract: 3 Zones (Brand | Single-Line Nav Links | Action & Ward) */}
      <header className="h-16 bg-[#122A1E] text-[#EDEBE1] border-b border-[#214332] px-6 flex items-center justify-between gap-8 shrink-0 z-50">
        
        {/* Zone 1: Single Wordmark */}
        <div 
          onClick={() => {
            setPortalMode('website');
            setActiveWebView('home');
          }}
          className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] text-[#F5F4EC] flex items-center justify-center font-black text-sm">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="text-base font-extrabold text-[#F5F4EC] tracking-tight group-hover:text-[#A2D4B2] transition-colors">
            PrajaPulse Bhoomi
          </span>
        </div>

        {/* Zone 2: 4-5 Clean Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#B9CEBF]">
          <button
            onClick={() => {
              setPortalMode('website');
              setActiveWebView('home');
            }}
            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              portalMode === 'website' && activeWebView === 'home' ? 'text-white font-bold underline decoration-[#2D6A4F] underline-offset-4' : ''
            }`}
          >
            Courses &amp; Labs
          </button>

          <button
            onClick={() => {
              setPortalMode('website');
              setActiveWebView('field_mission');
            }}
            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              portalMode === 'website' && activeWebView === 'field_mission' ? 'text-white font-bold underline decoration-[#2D6A4F] underline-offset-4' : ''
            }`}
          >
            Field Missions
          </button>

          <button
            onClick={() => {
              setPortalMode('website');
              setActiveWebView('ai_tutor');
            }}
            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              portalMode === 'website' && activeWebView === 'ai_tutor' ? 'text-white font-bold underline decoration-[#2D6A4F] underline-offset-4' : ''
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#8EB89D]" />
            <span>Prakriti AI Tutor</span>
          </button>

          <button
            onClick={() => {
              setPortalMode('website');
              setActiveWebView('contextual_demo');
            }}
            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              portalMode === 'website' && activeWebView === 'contextual_demo' ? 'text-white font-bold underline decoration-[#2D6A4F] underline-offset-4' : ''
            }`}
          >
            Ward Issue Link
          </button>

          <button
            onClick={() => {
              setPortalMode('website');
              setActiveWebView('certificates');
            }}
            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              portalMode === 'website' && activeWebView === 'certificates' ? 'text-white font-bold underline decoration-[#2D6A4F] underline-offset-4' : ''
            }`}
          >
            Credentials &amp; Badges
          </button>
        </nav>

        {/* Zone 3: Ward Selector, Points & Mode Controls */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Ward Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0C1D15] border border-[#27533E] rounded-xl px-2.5 py-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#8EB89D]" />
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="Ward 174 (HSR Layout)" className="bg-[#122A1E]">HSR Layout (Ward 174)</option>
              <option value="Ward 42 (Vasant Kunj)" className="bg-[#122A1E]">Vasant Kunj (Ward 42)</option>
              <option value="Ward 88 (Indiranagar)" className="bg-[#122A1E]">Indiranagar (Ward 88)</option>
              <option value="Ward 15 (Connaught Place)" className="bg-[#122A1E]">Connaught Place (Ward 15)</option>
            </select>
          </div>

          {/* User Points Badge */}
          <button
            onClick={() => {
              setPortalMode('website');
              setActiveWebView('certificates');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3F2E] border border-[#2E6B4E] rounded-xl text-xs font-extrabold text-[#F5F4EC] hover:bg-[#25523C] transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#E9C46A]" />
            <span>{userPoints} pts</span>
          </button>

          {/* Mode Switcher Group */}
          <div className="flex items-center gap-1 bg-[#0C1D15] p-1 rounded-xl border border-[#27533E]">
            <button
              onClick={() => setPortalMode('website')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                portalMode === 'website' ? 'bg-[#2D6A4F] text-white' : 'text-[#8EB89D] hover:text-white'
              }`}
              title="Website View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setPortalMode('mobile_sim')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                portalMode === 'mobile_sim' ? 'bg-[#2D6A4F] text-white' : 'text-[#8EB89D] hover:text-white'
              }`}
              title="Mobile App View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setPortalMode('specs')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                portalMode === 'specs' ? 'bg-[#2D6A4F] text-white' : 'text-[#8EB89D] hover:text-white'
              }`}
              title="Code & Specs Hub"
            >
              <Code className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setPortalMode('api')}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                portalMode === 'api' ? 'bg-[#2D6A4F] text-white' : 'text-[#8EB89D] hover:text-white'
              }`}
              title="REST API Tester"
            >
              <Server className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 overflow-y-auto relative bg-[#F7F6F0]">
        
        {/* 1. Website View (Default) */}
        {portalMode === 'website' && (
          <div className={`w-full ${activeWebView === 'ai_tutor' ? 'h-full' : 'min-h-full'}`}>
            {activeWebView === 'home' && (
              <WebHomeView
                courses={courses}
                missions={missions}
                workshops={workshops}
                badges={SAMPLE_BADGES}
                userPoints={userPoints}
                selectedWard={selectedWard}
                completedLessonIds={completedLessonIds}
                onSelectCourse={(courseId) => {
                  setSelectedCourseId(courseId);
                  setActiveWebView('course_detail');
                }}
                onSelectMission={(missionId) => {
                  setSelectedMissionId(missionId);
                  setActiveWebView('field_mission');
                }}
                onOpenAiTutor={(prefill) => handleOpenAiTutorWithQuery(prefill)}
                onOpenCertificate={() => setActiveWebView('certificates')}
                onOpenContextualModal={() => setActiveWebView('contextual_demo')}
                onRsvpWorkshop={handleRsvpWorkshop}
                onEarnPoints={handleEarnPoints}
              />
            )}

            {activeWebView === 'course_detail' && (
              <WebCourseDetailView
                course={selectedCourse}
                completedLessonIds={completedLessonIds}
                onBack={() => setActiveWebView('home')}
                onSelectLesson={(lesson) => {
                  setSelectedLesson(lesson);
                  setActiveWebView('lesson_player');
                }}
              />
            )}

            {activeWebView === 'lesson_player' && (
              <WebLessonPlayerView
                lesson={selectedLesson}
                courseTitle={selectedCourse.title}
                onBack={() => setActiveWebView('course_detail')}
                onLessonCompleted={handleLessonCompleted}
                onNavigateToAction={handleNavigateToAction}
              />
            )}

            {activeWebView === 'field_mission' && (
              <WebFieldMissionView
                mission={selectedMission}
                wardName={selectedWard}
                onBack={() => setActiveWebView('home')}
                onMissionCompleted={handleMissionCompleted}
              />
            )}

            {activeWebView === 'ai_tutor' && (
              <WebAIEcoTutorView
                wardName={selectedWard}
                initialQuery={aiPrefillQuery}
                onBack={() => setActiveWebView('home')}
                onSelectLesson={(lessonId) => {
                  setSelectedCourseId('path-waste-circularity');
                  setSelectedLesson(SAMPLE_LEARNING_PATHS[0].modules[0].lessons[0]);
                  setActiveWebView('lesson_player');
                }}
                onSelectMission={(missionId) => {
                  setSelectedMissionId(missionId);
                  setActiveWebView('field_mission');
                }}
              />
            )}

            {activeWebView === 'certificates' && (
              <WebImpactCertificateView
                certificate={SAMPLE_CERTIFICATE}
                badges={SAMPLE_BADGES}
                userPoints={userPoints}
                wardName={selectedWard}
                onBack={() => setActiveWebView('home')}
              />
            )}

            {activeWebView === 'contextual_demo' && (
              <div className="max-w-4xl mx-auto w-full px-6 py-10 space-y-6">
                <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 shadow-xs space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#1E4B35]">
                    Layer 1 Geo-Feed Real-World Context
                  </div>
                  <h1 className="text-xl font-bold text-[#143628]">
                    Citizen Issue #882: Unsegregated Waste &amp; Stagnant Dumping
                  </h1>
                  <p className="text-xs text-[#526357] leading-relaxed">
                    When a citizen in {selectedWard} opens a municipal grievance reported on Layer 1, Layer 11 dynamically embeds an active micro-lesson card tailored directly to the grievance category.
                  </p>
                </div>

                <ContextualLearnCard
                  issueTitle="Chronic Mixed Waste Dumping behind Sector 2 Market"
                  wardName={selectedWard}
                  category="Waste Management"
                  lessonId="les-w-1"
                  lessonTitle="Color Coding &amp; Sanitary Waste Sealing"
                  explanation="Mixed waste causes toxic landfill fires and methane release. Learn the 3-bin rules and how to coordinate with the local Junior Health Inspector."
                  points={25}
                  onOpenLesson={(lessonId) => {
                    setSelectedCourseId('path-waste-circularity');
                    setSelectedLesson(SAMPLE_LEARNING_PATHS[0].modules[0].lessons[0]);
                    setActiveWebView('lesson_player');
                  }}
                />

                <div className="pt-4 flex justify-between items-center">
                  <button
                    onClick={() => setActiveWebView('home')}
                    className="px-4 py-2 bg-white border border-[#DDD7C9] text-[#143628] font-bold text-xs rounded-xl hover:bg-[#F2EFE8] cursor-pointer"
                  >
                    ← Back to Portal
                  </button>
                  <button
                    onClick={() => setActiveWebView('ai_tutor')}
                    className="px-4 py-2 bg-[#1E4B35] hover:bg-[#153827] text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Consult AI Eco-Tutor on This Issue →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Mobile Simulator View */}
        {portalMode === 'mobile_sim' && (
          <div className="w-full h-full overflow-y-auto bg-[#EFECE3] flex flex-col items-center justify-center p-4">
            <div className="mb-3 flex items-center gap-1.5 overflow-x-auto max-w-xl pb-1">
              {['home', 'course_detail', 'lesson_player', 'field_mission', 'ai_tutor', 'certificates'].map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveMobileScreen(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                    activeMobileScreen === s
                      ? 'bg-[#1E4B35] text-white'
                      : 'bg-white text-[#526357] hover:text-[#1E4B35] border border-[#DDD7C9]'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>

            <MobileFrame
              isFramed={true}
              onToggleFrame={() => setPortalMode('website')}
              activeScreenTitle={activeMobileScreen}
            >
              {activeMobileScreen === 'home' && (
                <LearnHomeScreen
                  courses={courses}
                  missions={missions}
                  workshops={workshops}
                  badges={SAMPLE_BADGES}
                  userPoints={userPoints}
                  selectedWard={selectedWard}
                  onSelectCourse={(id) => {
                    setSelectedCourseId(id);
                    setActiveMobileScreen('course_detail');
                  }}
                  onSelectMission={(id) => {
                    setSelectedMissionId(id);
                    setActiveMobileScreen('field_mission');
                  }}
                  onOpenAiTutor={() => setActiveMobileScreen('ai_tutor')}
                  onOpenCertificate={() => setActiveMobileScreen('certificates')}
                  onOpenContextualModal={() => setActiveMobileScreen('contextual_demo')}
                />
              )}

              {activeMobileScreen === 'course_detail' && (
                <CourseDetailScreen
                  course={selectedCourse}
                  completedLessonIds={completedLessonIds}
                  onBack={() => setActiveMobileScreen('home')}
                  onSelectLesson={(l) => {
                    setSelectedLesson(l);
                    setActiveMobileScreen('lesson_player');
                  }}
                />
              )}

              {activeMobileScreen === 'lesson_player' && (
                <LessonPlayerScreen
                  lesson={selectedLesson}
                  courseTitle={selectedCourse.title}
                  onBack={() => setActiveMobileScreen('course_detail')}
                  onLessonCompleted={handleLessonCompleted}
                  onNavigateToAction={handleNavigateToAction}
                />
              )}

              {activeMobileScreen === 'field_mission' && (
                <FieldMissionScreen
                  mission={selectedMission}
                  wardName={selectedWard}
                  onBack={() => setActiveMobileScreen('home')}
                  onMissionCompleted={handleMissionCompleted}
                />
              )}

              {activeMobileScreen === 'ai_tutor' && (
                <AIEcoTutorScreen
                  wardName={selectedWard}
                  onBack={() => setActiveMobileScreen('home')}
                  onSelectLesson={() => {
                    setSelectedCourseId('path-waste-circularity');
                    setSelectedLesson(SAMPLE_LEARNING_PATHS[0].modules[0].lessons[0]);
                    setActiveMobileScreen('lesson_player');
                  }}
                  onSelectMission={(id) => {
                    setSelectedMissionId(id);
                    setActiveMobileScreen('field_mission');
                  }}
                />
              )}

              {activeMobileScreen === 'certificates' && (
                <ImpactCertificateScreen
                  certificate={SAMPLE_CERTIFICATE}
                  badges={SAMPLE_BADGES}
                  userPoints={userPoints}
                  wardName={selectedWard}
                  onBack={() => setActiveMobileScreen('home')}
                />
              )}
            </MobileFrame>
          </div>
        )}

        {/* 3. Specs Hub */}
        {portalMode === 'specs' && <CodeAndSpecsHub />}

        {/* 4. API Tester */}
        {portalMode === 'api' && <ApiTester />}

      </main>
    </div>
  );
}
