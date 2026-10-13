import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Flame, 
  Award, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Calendar, 
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Bot
} from 'lucide-react';
import { Course, FieldMission, Workshop, Badge } from '../../data/layer11Data';

interface LearnHomeScreenProps {
  courses: Course[];
  missions: FieldMission[];
  workshops: Workshop[];
  badges: Badge[];
  userPoints: number;
  selectedWard: string;
  onSelectCourse: (courseId: string) => void;
  onSelectMission: (missionId: string) => void;
  onOpenAiTutor: () => void;
  onOpenCertificate: () => void;
  onOpenContextualModal: () => void;
}

export const LearnHomeScreen: React.FC<LearnHomeScreenProps> = ({
  courses,
  missions,
  workshops,
  badges,
  userPoints,
  selectedWard,
  onSelectCourse,
  onSelectMission,
  onOpenAiTutor,
  onOpenCertificate,
  onOpenContextualModal,
}) => {
  const activeCourse = courses[0];
  const activeMission = missions[0];

  return (
    <div className="flex flex-col min-h-full bg-slate-50 text-slate-900 pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm font-black text-sm">
            P11
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PrajaPulse • Layer 11
            </div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">Eco-Training Hub</h1>
          </div>
        </div>

        {/* User Badges & Points Pill */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs font-bold text-emerald-800 shadow-xs hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>{userPoints} pts</span>
          </button>
          
          <div className="flex items-center gap-1 px-2 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-bold text-amber-800">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>5d Streak</span>
          </div>
        </div>
      </header>

      {/* Ward Context Alert Banner */}
      <div className="mx-4 mt-3 p-3 bg-gradient-to-r from-teal-900 to-emerald-950 text-white rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 text-teal-300">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-teal-200">Hyper-Local Civic Zone</div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>{selectedWard}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-teal-800/80 rounded text-teal-200 font-normal">Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onOpenContextualModal}
          className="text-[11px] font-semibold bg-teal-400 text-teal-950 hover:bg-teal-300 px-2.5 py-1.5 rounded-lg shadow-xs flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>Ward Issues (2)</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Daily Eco-Challenge Card */}
      <section className="px-4 mt-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-400/25 text-emerald-100 border border-emerald-300/30">
              <Sparkles className="w-3 h-3 text-amber-300" /> Daily Micro-Challenge
            </span>
            <span className="text-xs font-medium text-emerald-200 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 2 min
            </span>
          </div>

          <h3 className="text-base font-bold text-white leading-snug">
            Label Your Home Sanitary Bin with a Red Cross
          </h3>
          <p className="text-xs text-emerald-100 mt-1 leading-relaxed opacity-95">
            Under Solid Waste Rules 2016, sanitary waste must be wrapped with a red 'X'. Protect sanitation workers in {selectedWard}.
          </p>

          <div className="mt-3.5 pt-3 border-t border-emerald-500/40 flex items-center justify-between">
            <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <span>+30 Eco-Points</span>
            </div>
            <button 
              onClick={() => onSelectCourse(activeCourse.id)}
              className="px-3 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Start Challenge</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Continue Learning Widget */}
      <section className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            In Progress
          </h2>
          <span className="text-xs text-emerald-700 font-semibold cursor-pointer hover:underline">
            View All ({courses.length})
          </span>
        </div>

        <div 
          onClick={() => onSelectCourse(activeCourse.id)}
          className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md mb-1.5">
                {activeCourse.category.toUpperCase()} • {activeCourse.level}
              </span>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {activeCourse.title}
              </h4>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-emerald-700">50%</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full w-1/2 transition-all duration-500"></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span>Next: Lesson 2 • Black Spot Overcoming</span>
              <span className="font-medium text-emerald-600 flex items-center gap-1">
                Resume <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Civic Learning Paths Carousel */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Structured Citizen Paths
          </h2>
          <span className="text-[11px] text-slate-400">3 Curated Tracks</span>
        </div>

        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={course.bannerUrl} 
                  alt={course.title} 
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100" 
                />
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      SDG {course.sdgGoals.join(', ')}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-semibold text-emerald-700">
                      {course.durationMin} mins
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-500 font-medium">
                      {course.lessonsCount} lessons
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                      +{course.points} pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Field Missions Section */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            Civic Field Missions
          </h2>
          <span className="text-xs font-bold text-teal-700">Learn → Act</span>
        </div>

        <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-600 text-white rounded-md uppercase tracking-wider">
              High Impact in {selectedWard}
            </span>
            <span className="text-xs font-extrabold text-teal-900">
              +{activeMission.points} pts
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 mt-2">
            {activeMission.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
            {activeMission.shortDesc}
          </p>

          <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-teal-600" /> {activeMission.durationMin} mins
            </span>
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> GPS Verified
            </span>
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={() => onSelectMission(activeMission.id)}
              className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors text-center cursor-pointer"
            >
              Start Mission Checklist
            </button>
            <button 
              onClick={onOpenAiTutor}
              className="p-2 bg-white border border-teal-200 text-teal-700 rounded-xl hover:bg-teal-50 transition-colors cursor-pointer"
              title="Ask AI Eco-Tutor"
            >
              <Bot className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Community Workshops Preview */}
      <section className="px-4 mt-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            NGO Field Masterclasses
          </h2>
          <span className="text-xs font-semibold text-slate-500">Layer 8 Network</span>
        </div>

        <div className="space-y-2.5">
          {workshops.map((ws) => (
            <div 
              key={ws.id} 
              className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={ws.instructor.avatar} 
                  alt={ws.instructor.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-100" 
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{ws.title}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {ws.date} • {ws.ward}
                  </div>
                  <div className="text-[10px] font-semibold text-indigo-700 mt-0.5">
                    By {ws.partnerNgo}
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                ws.isRegistered ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
              }`}>
                {ws.isRegistered ? 'RSVP\'d' : 'Open'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Floating AI Tutor Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={onOpenAiTutor}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-xs"
        >
          <Bot className="w-4 h-4 text-emerald-200 animate-bounce" />
          <span>Ask Eco-Tutor</span>
        </button>
      </div>
    </div>
  );
};
