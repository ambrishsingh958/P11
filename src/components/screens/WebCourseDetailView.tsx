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
    <div className="w-full min-h-full bg-[#F7F6F0] text-[#1B2D22] flex flex-col font-sans">
      {/* Top Breadcrumb Nav */}
      <div className="bg-[#FAF9F5] hairline-b px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0ECE1] text-[#143628] transition-colors flex items-center gap-1.5 text-xs font-bold border border-[#DDD7C9] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Curriculum</span>
          </button>
          <div className="text-xs text-[#526357] hidden sm:flex items-center gap-2">
            <span>Courses</span>
            <span>/</span>
            <span className="text-[#143628] font-bold truncate max-w-xs">{course.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0ECE1] text-[#143628] text-xs font-semibold flex items-center gap-1.5 border border-[#DDD7C9] transition-colors cursor-pointer"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-[#9E4A28] fill-[#9E4A28]' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0ECE1] text-[#143628] text-xs font-semibold flex items-center gap-1.5 border border-[#DDD7C9] transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#1E4B35]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Syllabus & Learning Content (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Box */}
            <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="text-xs text-[#526357] font-semibold space-x-2">
                <span className="text-[#1E4B35] font-bold uppercase">{course.level} Level</span>
                <span>·</span>
                <span>SDG {course.sdgGoals.join(', ')}</span>
                <span>·</span>
                <span className="text-[#9E4A28]">+{course.points} Eco-Points</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143628] leading-tight">
                {course.title}
              </h1>

              <p className="text-sm text-[#526357] leading-relaxed">
                {course.description}
              </p>

              {/* Skills Tags */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#526357]">
                {course.skillTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] border border-[#DDD7C9] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modules Syllabus Accordion */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#143628]">Curriculum Syllabus</h2>
                <p className="text-xs text-[#526357]">
                  {course.modules.length} modules · {allLessons.length} micro-lessons (2 minutes each)
                </p>
              </div>

              <div className="space-y-3">
                {course.modules.map((module, mIdx) => {
                  const isExpanded = !!expandedModules[module.id];
                  return (
                    <div
                      key={module.id}
                      className="bg-white border border-[#DDD7C9] rounded-3xl overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EAF3EC] text-[#1E4B35] flex items-center justify-center font-bold text-sm shrink-0 border border-[#C5E2CD]">
                            {mIdx + 1}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-[#143628]">
                              {module.title}
                            </h3>
                            <p className="text-xs text-[#526357] mt-0.5">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#7A8E80] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#7A8E80] shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-4 pt-1 hairline-t space-y-2">
                          {module.lessons.map((lesson, lIdx) => {
                            const isCompleted = completedLessonIds.includes(lesson.id);
                            return (
                              <div
                                key={lesson.id}
                                onClick={() => onSelectLesson(lesson)}
                                className="p-3.5 rounded-2xl bg-[#FAF9F5] hover:bg-[#F2EFE8] border border-[#E5DFD3] transition-all flex items-center justify-between gap-4 cursor-pointer group"
                              >
                                <div className="flex items-center gap-3.5">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-[#1E4B35] shrink-0" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-[#A8B7AD] shrink-0" />
                                  )}

                                  <div>
                                    <div className="text-xs sm:text-sm font-bold text-[#143628] group-hover:text-[#1E4B35] transition-colors">
                                      {mIdx + 1}.{lIdx + 1} {lesson.title}
                                    </div>
                                    <div className="text-xs text-[#526357] mt-0.5 space-x-2">
                                      <span>{lesson.durationMin} min read</span>
                                      <span>·</span>
                                      <span>+{lesson.quiz.points} pts quiz</span>
                                    </div>
                                  </div>
                                </div>

                                <button className="px-3 py-1.5 bg-[#1E4B35] text-white rounded-xl text-xs font-bold transition-colors shrink-0">
                                  {isCompleted ? 'Review' : 'Play'}
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

          {/* Right Column: Sticky Progress & Feature Box (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 shadow-xs space-y-6">
              
              {/* Media Thumbnail */}
              <div className="rounded-2xl overflow-hidden aspect-video bg-[#EFECE3] border border-[#DDD7C9]">
                <img src={course.bannerUrl} alt={course.title} className="w-full h-full object-cover" />
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#143628]">Course Progress</span>
                  <span className="font-black text-[#1E4B35]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#EAE6DC] rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#1E4B35] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-[#526357] flex items-center justify-between pt-1">
                  <span>{completedCount} of {allLessons.length} lessons finished</span>
                  <span className="text-[#9E4A28] font-bold">100% unlocks cert</span>
                </div>
              </div>

              {/* Start / Resume Button */}
              <button
                onClick={() => onSelectLesson(nextLesson)}
                className="w-full py-3.5 bg-[#1E4B35] hover:bg-[#153827] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{progressPercent > 0 ? 'Resume Next Lesson' : 'Start Micro-Lesson 1'}</span>
              </button>

              {/* Legal & Educational Guarantees */}
              <div className="pt-4 hairline-t space-y-2 text-xs text-[#526357]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#1E4B35]" />
                  <span>Aligned with SWM 2016 statutory mandates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#9E4A28]" />
                  <span>+{course.points} Verified Eco-Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#1E4B35]" />
                  <span>Connects to neighborhood field missions</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
