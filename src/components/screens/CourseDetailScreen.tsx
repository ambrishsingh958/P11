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
  ShieldAlert
} from 'lucide-react';
import { Course, Lesson } from '../../data/layer11Data';

interface CourseDetailScreenProps {
  course: Course;
  completedLessonIds: string[];
  onBack: () => void;
  onSelectLesson: (lesson: Lesson) => void;
}

export const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({
  course,
  completedLessonIds,
  onBack,
  onSelectLesson,
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id || '']: true
  });
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / (allLessons.length || 1)) * 100);

  // First uncompleted lesson or first lesson
  const nextLesson = allLessons.find((l) => !completedLessonIds.includes(l.id)) || allLessons[0];

  return (
    <div className="flex flex-col min-h-full bg-slate-50 text-slate-900 pb-24">
      {/* Top Banner Navigation */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        <img 
          src={course.bannerUrl} 
          alt={course.title}
          className="w-full h-full object-cover opacity-65" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

        {/* Header Actions */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <button 
            onClick={onBack}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
            </button>
            <button className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Banner Badges */}
        <div className="absolute bottom-3 inset-x-4 flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-emerald-500 text-white rounded-md tracking-wider shadow-xs">
            {course.level} Level
          </span>
          <span className="text-[10px] font-bold px-2 py-1 bg-white/20 backdrop-blur-md text-white rounded-md">
            SDG {course.sdgGoals.join(', ')}
          </span>
        </div>
      </div>

      {/* Main Course Info */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
          <span className="flex items-center gap-1 font-semibold text-emerald-800">
            <Clock className="w-3.5 h-3.5" /> {course.durationMin} minutes total
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <Award className="w-3.5 h-3.5" /> +{course.points} Eco-Points
          </span>
        </div>

        <h1 className="text-lg font-bold text-slate-900 leading-snug">
          {course.title}
        </h1>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          {course.description}
        </p>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {course.skillTags.map((tag) => (
            <span 
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Progress Bar Card */}
        <div className="mt-4 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-700">Course Completion</span>
            <span className="font-extrabold text-emerald-700">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
            <span>{completedCount} of {allLessons.length} micro-lessons finished</span>
            <span>Cert. eligible at 100%</span>
          </div>
        </div>
      </div>

      {/* Modules Syllabus Accordion */}
      <div className="px-4 mt-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Course Syllabus ({course.modules.length} Modules)
        </h2>

        <div className="space-y-3">
          {course.modules.map((module, mIdx) => {
            const isExpanded = !!expandedModules[module.id];
            return (
              <div 
                key={module.id} 
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
              >
                {/* Module Header Accordion Trigger */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {mIdx + 1}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {module.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {/* Lessons in Module */}
                {isExpanded && (
                  <div className="px-3.5 pb-3 pt-1 border-t border-slate-100 divide-y divide-slate-100">
                    {module.lessons.map((lesson, lIdx) => {
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => onSelectLesson(lesson)}
                          className="py-2.5 flex items-center justify-between gap-3 hover:bg-emerald-50/50 rounded-xl px-2 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 shrink-0" />
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-400">
                                  {mIdx + 1}.{lIdx + 1}
                                </span>
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                  {lesson.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                <span className="flex items-center gap-1">
                                  {lesson.type === 'audio' ? (
                                    <Headphones className="w-3 h-3 text-teal-600" />
                                  ) : (
                                    <FileText className="w-3 h-3 text-emerald-600" />
                                  )}
                                  {lesson.durationMin} min read
                                </span>
                                <span>•</span>
                                <span className="text-amber-700 font-semibold">
                                  +{lesson.quiz.points} pts quiz
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-1.5 text-slate-300 group-hover:text-emerald-600 transition-colors">
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </div>
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

      {/* Floating Bottom Action */}
      <div className="fixed bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 z-20 flex items-center justify-between max-w-md mx-auto">
        <div className="text-xs">
          <div className="text-[11px] text-slate-500">Ready to start?</div>
          <div className="font-bold text-slate-900 line-clamp-1">{nextLesson.title}</div>
        </div>

        <button
          onClick={() => onSelectLesson(nextLesson)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{completedCount === 0 ? 'Start Course' : 'Resume Lesson'}</span>
        </button>
      </div>
    </div>
  );
};
