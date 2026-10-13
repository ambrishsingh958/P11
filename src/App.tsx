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
  Sparkles,
  Search,
  Layers,
  ChevronDown,
  Monitor,
  Menu,
  X,
  Calendar,
  CheckCircle2,
  Share2
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

// Website-grade Views
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const selectedMission = missions.find((m) => m.id === selectedMissionId) || missions[0];

  const handleLessonCompleted = (lessonId: string, pointsEarned: number) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
    }
    setUserPoints((prev) => prev + pointsEarned);
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
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Top Website Header & Navigation Bar */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between shrink-0 z-50">
        
        {/* Brand & Layer Identity */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveWebView('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md group-hover:scale-105 transition-transform">
              P11
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white tracking-wide">
                <span>PrajaPulse</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400">Layer 11</span>
              </div>
              <div className="text-xs font-extrabold text-white tracking-tight hidden sm:block">
                Environmental Education &amp; Training
              </div>
            </div>
          </div>

          {/* Hyper-Local Ward Selector Dropdown */}
          <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-800 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-200 focus:outline-emerald-500 cursor-pointer"
            >
              <option value="Ward 174 (HSR Layout)">Ward 174 (HSR Layout, Bengaluru)</option>
              <option value="Ward 42 (Vasant Kunj)">Ward 42 (Vasant Kunj, Delhi)</option>
              <option value="Ward 88 (Indiranagar)">Ward 88 (Indiranagar, Bengaluru)</option>
              <option value="Ward 15 (Connaught Place)">Ward 15 (Connaught Place, Delhi)</option>
            </select>
          </div>
        </div>

        {/* Website Navigation Links (When in Website Mode) */}
        {portalMode === 'website' && (
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveWebView('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeWebView === 'home' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Courses Catalog
            </button>
            <button
              onClick={() => setActiveWebView('field_mission')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeWebView === 'field_mission' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Field Missions
            </button>
            <button
              onClick={() => setActiveWebView('ai_tutor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeWebView === 'ai_tutor' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Eco-Tutor</span>
            </button>
            <button
              onClick={() => setActiveWebView('contextual_demo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeWebView === 'contextual_demo' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ward Issue Link
            </button>
            <button
              onClick={() => setActiveWebView('certificates')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeWebView === 'certificates' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Credentials &amp; Badges
            </button>
          </nav>
        )}

        {/* User Badges, Points & Global Mode Selector */}
        <div className="flex items-center gap-3">
          {/* User Score Pills */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => {
                setPortalMode('website');
                setActiveWebView('certificates');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-black text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{userPoints} pts</span>
            </button>

            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>5d Streak</span>
            </div>
          </div>

          {/* Primary View Switcher Dropdown / Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPortalMode('website')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                portalMode === 'website'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Full Desktop Website View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal View</span>
            </button>

            <button
              onClick={() => setPortalMode('mobile_sim')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                portalMode === 'mobile_sim'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="React Native Phone Simulator"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone Sim</span>
            </button>

            <button
              onClick={() => setPortalMode('specs')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                portalMode === 'specs'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Architecture, SQL Schema, Prompts & Code"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Code &amp; Specs</span>
            </button>

            <button
              onClick={() => setPortalMode('api')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                portalMode === 'api'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Live REST API Playground"
            >
              <Server className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">API Tester</span>
            </button>
          </div>
        </div>

      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 overflow-y-auto relative bg-slate-900">
        
        {/* MODE 1: Full-Width Desktop Website Portal (Default) */}
        {portalMode === 'website' && (
          <div className="w-full h-full flex flex-col">
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
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Layer 1 Geo-Feed Integration Demo
                  </span>
                  <h1 className="text-xl font-bold text-white">
                    Citizen Issue #882: Unsegregated Waste &amp; Stagnant Dumping
                  </h1>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    When a citizen in {selectedWard} opens a municipal grievance reported on Layer 1, Layer 11 dynamically embeds an active micro-lesson card tailored directly to the grievance category.
                  </p>
                </div>

                {/* Embedded Contextual Card */}
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
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
                  >
                    ← Back to Portal Home
                  </button>
                  <button
                    onClick={() => setActiveWebView('ai_tutor')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
                  >
                    Consult AI Eco-Tutor on This Issue →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: React Native Mobile Frame Simulator */}
        {portalMode === 'mobile_sim' && (
          <div className="w-full h-full overflow-y-auto bg-slate-900/80 flex flex-col items-center justify-center p-4">
            
            {/* Screen Selector for Mobile Sim */}
            <div className="mb-3 flex items-center gap-1.5 overflow-x-auto max-w-xl pb-1">
              {['home', 'course_detail', 'lesson_player', 'field_mission', 'ai_tutor', 'certificates'].map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveMobileScreen(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors ${
                    activeMobileScreen === s
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
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

        {/* MODE 3: Developer Code & Technical Architecture Hub */}
        {portalMode === 'specs' && <CodeAndSpecsHub />}

        {/* MODE 4: Live REST API Playground */}
        {portalMode === 'api' && <ApiTester />}

      </main>
    </div>
  );
}
