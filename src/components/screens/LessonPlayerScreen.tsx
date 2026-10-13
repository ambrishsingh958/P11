import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Share2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson } from '../../data/layer11Data';

interface LessonPlayerScreenProps {
  lesson: Lesson;
  courseTitle: string;
  onBack: () => void;
  onLessonCompleted: (lessonId: string, pointsEarned: number) => void;
  onNavigateToAction: (actionType: string, targetId?: string) => void;
}

export const LessonPlayerScreen: React.FC<LessonPlayerScreenProps> = ({
  lesson,
  courseTitle,
  onBack,
  onLessonCompleted,
  onNavigateToAction,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    // In a React Native build, this calls Expo AV / react-native-sound
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    const questions = lesson.quiz.questions;
    let correctCount = 0;

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const passed = correctCount === questions.length;
    setQuizSubmitted(true);
    setQuizPassed(passed);

    if (passed) {
      const awarded = lesson.quiz.points;
      setPointsEarned(awarded);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      onLessonCompleted(lesson.id, awarded);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 text-slate-900 pb-28">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
              {courseTitle}
            </div>
            <h1 className="text-xs font-bold text-slate-900 line-clamp-1">
              {lesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-amber-500 fill-amber-500' : ''}`} />
          </button>
        </div>
      </header>

      {/* Media & Audio Player Card */}
      <div className="px-4 pt-3">
        <div className="p-4 bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 bg-emerald-700/80 rounded-md border border-emerald-500/30">
              {lesson.type.toUpperCase()} • 2 MIN READ
            </span>
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> +{lesson.quiz.points} pts quiz
            </span>
          </div>

          <h2 className="text-base font-extrabold text-white leading-snug">
            {lesson.title}
          </h2>

          {/* Audio Narration Toggle Widget */}
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-between border border-white/15">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={toggleAudio}
                className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                {isPlayingAudio ? (
                  <Pause className="w-4 h-4 fill-white" />
                ) : (
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                )}
              </button>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Audio Narration</span>
                  {isPlayingAudio && (
                    <span className="text-[10px] text-emerald-300 font-normal animate-pulse">Playing (1:45)</span>
                  )}
                </div>
                <div className="text-[10px] text-emerald-200">Hindi / English Audio Available</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isPlayingAudio ? (
                <Volume2 className="w-4 h-4 text-emerald-300" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/60" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Micro-Lesson Summary Card */}
      <div className="px-4 mt-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Core Municipal Rule
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {lesson.summary}
          </p>
        </div>
      </div>

      {/* Full Transcript Accordion */}
      <div className="px-4 mt-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            Full Transcript &amp; Civic Notes
          </div>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {lesson.transcript}
          </p>
        </div>
      </div>

      {/* Interactive Micro-Quiz */}
      <section className="px-4 mt-6">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Knowledge Check
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {lesson.quiz.title}
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              +{lesson.quiz.points} pts
            </span>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {lesson.quiz.questions.map((question, qIdx) => {
              const selectedOpt = selectedAnswers[question.id];
              return (
                <div key={question.id} className="pt-2 border-t border-slate-100 first:border-0 first:pt-0">
                  <div className="text-xs font-bold text-slate-800 mb-2">
                    {qIdx + 1}. {question.question}
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      let optionStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (quizSubmitted) {
                        if (optIdx === question.correctAnswer) {
                          optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                        } else if (isSelected && optIdx !== question.correctAnswer) {
                          optionStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleSelectAnswer(question.id, optIdx)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                        >
                          <span>{option}</span>
                          {quizSubmitted && optIdx === question.correctAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          )}
                          {quizSubmitted && isSelected && optIdx !== question.correctAnswer && (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback explanation after submit */}
                  {quizSubmitted && (
                    <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-semibold text-slate-800 flex items-center gap-1 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        Explanation:
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {question.explanation}
                      </p>
                      {question.civicTip && (
                        <div className="mt-2 text-[10px] font-semibold text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/60">
                          💡 Civic Pro-Tip: {question.civicTip}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Submit Button / Result Status */}
          <div className="mt-5">
            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < lesson.quiz.questions.length}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Submit Answers &amp; Earn {lesson.quiz.points} Points
              </button>
            ) : (
              <div className={`p-3 rounded-xl text-center ${
                quizPassed ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                <div className="text-xs font-bold">
                  {quizPassed ? `🎉 Perfect Score! +${pointsEarned} Eco-Points Awarded!` : 'Review the civic tips above and try again!'}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Practical Action Card */}
      <section className="px-4 mt-4">
        <div className="p-4 bg-gradient-to-r from-teal-900 to-emerald-950 text-white rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-300 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            PrajaPulse Action Trigger
          </div>
          <h4 className="text-xs font-bold text-white">
            {lesson.actionCard.title}
          </h4>
          <p className="text-[11px] text-teal-100 mt-1 leading-relaxed">
            {lesson.actionCard.description}
          </p>

          <button
            onClick={() => onNavigateToAction(lesson.actionCard.actionType, lesson.actionCard.targetActionId)}
            className="mt-3 w-full py-2 bg-teal-400 hover:bg-teal-300 text-teal-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Execute Action on Ground</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
