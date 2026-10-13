import React, { useState, useEffect } from 'react';
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
  Lightbulb,
  RotateCcw,
  Headphones,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson } from '../../data/layer11Data';

interface WebLessonPlayerViewProps {
  lesson: Lesson;
  courseTitle: string;
  onBack: () => void;
  onLessonCompleted: (lessonId: string, pointsEarned: number) => void;
  onNavigateToAction: (actionType: string, targetId?: string) => void;
}

export const WebLessonPlayerView: React.FC<WebLessonPlayerViewProps> = ({
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

  // Web Speech API synthesis for real audio narration
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      setIsPlayingAudio(!isPlayingAudio);
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${lesson.title}. ${lesson.summary}. ${lesson.transcript}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
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
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      onLessonCompleted(lesson.id, awarded);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
  };

  return (
    <div className="w-full min-h-full bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Breadcrumb Nav */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Syllabus</span>
          </button>
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
            <span>{courseTitle}</span>
            <span>/</span>
            <span className="text-white font-semibold truncate max-w-sm">{lesson.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-amber-400 fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save Lesson'}</span>
          </button>
        </div>
      </div>

      {/* Main Website Lesson Workspace */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Lesson Media, Narration & Transcript (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Lesson Media Banner Card */}
            <div className="bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 border border-emerald-900/50 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
                  {lesson.type.toUpperCase()} • 2 MINUTE CIVIC MICRO-LESSON
                </span>
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Award className="w-4 h-4" /> +{lesson.quiz.points} Points on Quiz
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {lesson.title}
              </h1>

              {/* Interactive Audio Narration Player */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSpeech}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    )}
                  </button>

                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Live Speech Narration</span>
                      {isPlayingAudio && (
                        <span className="text-xs text-amber-400 font-normal">Speaking...</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      High-clarity civic voice synthesis • 1:45 duration
                    </div>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs text-emerald-400 font-mono font-bold">Web Speech AI</span>
                </div>
              </div>
            </div>

            {/* Core Municipal Rule Summary */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Statutory Civic Rule Breakdown</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {lesson.summary}
              </p>
            </div>

            {/* Full Transcript Reader */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Full Civic Lecture Transcript &amp; Legal Context</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                {lesson.transcript}
              </div>
            </div>

            {/* Practical Action Trigger Box */}
            <div className="bg-gradient-to-r from-teal-950 via-slate-950 to-emerald-950 border border-teal-800/80 rounded-3xl p-6 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-extrabold text-teal-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>PrajaPulse Action Directive</span>
              </div>
              <h3 className="text-base font-bold text-white">
                {lesson.actionCard.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lesson.actionCard.description}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigateToAction(lesson.actionCard.actionType, lesson.actionCard.targetActionId)}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Launch Practical Field Action</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Micro-Quiz & Scoring (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-6">
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                    Step 3: Verification Quiz
                  </span>
                  <h2 className="text-base font-bold text-white mt-0.5">
                    {lesson.quiz.title}
                  </h2>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  +{lesson.quiz.points} pts
                </span>
              </div>

              {/* Quiz Questions */}
              <div className="space-y-6">
                {lesson.quiz.questions.map((question, qIdx) => {
                  const selectedOpt = selectedAnswers[question.id];
                  return (
                    <div key={question.id} className="space-y-3">
                      <div className="text-xs sm:text-sm font-bold text-white">
                        {qIdx + 1}. {question.question}
                      </div>

                      <div className="space-y-2">
                        {question.options.map((opt, optIdx) => {
                          const isSelected = selectedOpt === optIdx;
                          let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

                          if (quizSubmitted) {
                            if (optIdx === question.correctAnswer) {
                              btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                            } else if (isSelected && optIdx !== question.correctAnswer) {
                              btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 line-through';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-emerald-950/60 border-emerald-500 text-white font-semibold';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => handleSelectAnswer(question.id, optIdx)}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIdx === question.correctAnswer && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                              )}
                              {quizSubmitted && isSelected && optIdx !== question.correctAnswer && (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Feedback */}
                      {quizSubmitted && (
                        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs space-y-1.5">
                          <div className="font-bold text-slate-200 flex items-center gap-1.5">
                            <Lightbulb className="w-4 h-4 text-amber-400" />
                            <span>Civic Legal Rationale:</span>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            {question.explanation}
                          </p>
                          {question.civicTip && (
                            <div className="mt-2 p-2 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded-xl text-[11px] font-semibold">
                              💡 {question.civicTip}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit / Results Actions */}
              <div className="pt-3 border-t border-slate-850">
                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < lesson.quiz.questions.length}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Submit Answers &amp; Collect +{lesson.quiz.points} Eco-Points
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className={`p-4 rounded-2xl text-center border ${
                      quizPassed
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-amber-950/60 border-amber-500 text-amber-200'
                    }`}>
                      <div className="text-sm font-extrabold">
                        {quizPassed ? `🎉 Passed with 100%! +${pointsEarned} Points Added to Ledger!` : 'Review the civic tips and retry to achieve 100%'}
                      </div>
                    </div>

                    {!quizPassed && (
                      <button
                        onClick={handleResetQuiz}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry Quiz</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
