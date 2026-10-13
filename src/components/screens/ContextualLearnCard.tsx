import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Award, 
  ShieldAlert, 
  Clock 
} from 'lucide-react';

interface ContextualLearnCardProps {
  issueTitle?: string;
  wardName?: string;
  category?: string;
  lessonId: string;
  lessonTitle: string;
  explanation: string;
  points: number;
  onOpenLesson: (lessonId: string) => void;
}

export const ContextualLearnCard: React.FC<ContextualLearnCardProps> = ({
  issueTitle = 'Chronic Garbage Dump behind 14th Main Park',
  wardName = 'Ward 174 (HSR Layout)',
  category = 'Waste Segregation',
  lessonId,
  lessonTitle,
  explanation,
  points,
  onOpenLesson,
}) => {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/90 rounded-2xl p-3.5 shadow-xs my-3 text-slate-900">
      {/* Contextual Link Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
            Layer 11 • Contextual Civic Learning
          </span>
        </div>
        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
          +{points} pts
        </span>
      </div>

      {/* Linked Issue Context */}
      <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100 mb-2.5">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span>Linked to report in {wardName}:</span>
        </div>
        <div className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
          "{issueTitle}"
        </div>
      </div>

      {/* Suggested Micro-Lesson */}
      <div className="space-y-1">
        <div className="text-xs font-bold text-slate-900 leading-snug">
          Recommended: {lessonTitle}
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {explanation}
        </p>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between">
        <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3" /> 2-min read &amp; quick quiz
        </span>

        <button
          onClick={() => onOpenLesson(lessonId)}
          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>Learn &amp; Solve</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
