import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  FileText, 
  Headphones, 
  Share2, 
  Bookmark, 
  Sparkles,
  ShieldCheck,
  Check,
  Calendar,
  Layers,
  Leaf
} from 'lucide-react';
import { Course, Lesson } from '../../data/layer11Data';

interface WebCourseDetailViewProps {
  course: Course;
  completedLessonIds: string[];
  onBack: () => void;
  onSelectLesson: (lesson: Lesson) => void;
}

export const WebCourseDetailView: React.FC<WebCourseDetailViewProps> = ({
  course,
  completedLessonIds,
  onBack,
  onSelectLesson,
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || '']: true
  });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / (allLessons.length || 1)) * 100);
  const nextLesson = allLessons.find((l) => !completedLessonIds.includes(l.id)) || allLessons[0];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full min-h-full bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Breadcrumb & Navigation */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal Courses</span>
          </button>
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
            <span>Courses</span>
            <span>/</span>
            <span className="text-white font-semibold truncate max-w-xs">{course.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Course Details Split View */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Syllabus & Learning Content (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Hero Course Header Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase bg-emerald-600 text-white shadow-xs">
                  {course.level} Level
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-900 text-teal-300 border border-slate-800">
                  SDG Goals: {course.sdgGoals.join(', ')}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>+{course.points} Eco-Points</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-sm leading-relaxed">
                {course.description}
              </p>

              {/* Skills Tags */}
              <div className="pt-2 flex flex-wrap gap-2">
                {course.skillTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modules Syllabus Accordion */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Course Syllabus &amp; Micro-Lessons</h2>
                  <p className="text-xs text-slate-400">
                    {course.modules.length} modules • {allLessons.length} micro-lessons (2 minutes each)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {course.modules.map((module, mIdx) => {
                  const isExpanded = !!expandedModules[module.id];
                  return (
                    <div
                      key={module.id}
                      className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-md"
                    >
                      {/* Module Header Trigger */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                            {mIdx + 1}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">
                              {module.title}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
                        )}
                      </button>

                      {/* Lesson Items */}
                      {isExpanded && (
                        <div className="p-4 pt-1 border-t border-slate-850 space-y-2">
                          {module.lessons.map((lesson, lIdx) => {
                            const isCompleted = completedLessonIds.includes(lesson.id);
                            return (
                              <div
                                key={lesson.id}
                                onClick={() => onSelectLesson(lesson)}
                                className="p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-4 cursor-pointer group"
                              >
                                <div className="flex items-center gap-3.5">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 shrink-0" />
                                  )}

                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-slate-500">
                                        {mIdx + 1}.{lIdx + 1}
                                      </span>
                                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                                        {lesson.title}
                                      </h4>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                      <span className="flex items-center gap-1">
                                        {lesson.type === 'audio' ? (
                                          <Headphones className="w-3.5 h-3.5 text-teal-400" />
                                        ) : (
                                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                                        )}
                                        {lesson.durationMin} min read
                                      </span>
                                      <span>•</span>
                                      <span className="text-amber-400 font-semibold">
                                        +{lesson.quiz.points} pts quiz
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <button className="px-3 py-1.5 bg-slate-800 group-hover:bg-emerald-600 text-slate-200 group-hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0">
                                  <span>{isCompleted ? 'Review' : 'Play'}</span>
                                  <Play className="w-3 h-3 fill-current" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Enrollment & Progress Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              
              {/* Cover Banner Thumbnail */}
              <div className="rounded-2xl overflow-hidden aspect-video border border-slate-800 relative">
                <img src={course.bannerUrl} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 fill-slate-950 translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Your Course Progress</span>
                  <span className="text-emerald-400">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>{completedCount} of {allLessons.length} lessons finished</span>
                  <span className="text-amber-400 font-semibold">100% unlocks cert</span>
                </div>
              </div>

              {/* Start / Resume Button */}
              <button
                onClick={() => onSelectLesson(nextLesson)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{progressPercent > 0 ? 'Resume Next Lesson' : 'Start Micro-Lesson 1'}</span>
              </button>

              {/* Course Features List */}
              <div className="pt-4 border-t border-slate-850 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{course.durationMin} minutes total duration</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Directly references SWM Rules 2016</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Earns +{course.points} verified Eco-Points</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span>Includes practical field action step</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
