import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Play, 
  Pause, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowRight, 
  FileText, 
  Lightbulb, 
  RotateCcw,
  Volume2
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
        particleCount: 80,
        spread: 70,
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
    <div className="w-full min-h-full bg-[#F7F6F0] text-[#1B2D22] flex flex-col font-sans">
      {/* Top Breadcrumb Nav */}
      <div className="bg-[#FAF9F5] hairline-b px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0ECE1] text-[#143628] transition-colors flex items-center gap-1.5 text-xs font-bold border border-[#DDD7C9] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Syllabus</span>
          </button>
          <div className="text-xs text-[#526357] hidden sm:flex items-center gap-2">
            <span>{courseTitle}</span>
            <span>/</span>
            <span className="text-[#143628] font-bold truncate max-w-sm">{lesson.title}</span>
          </div>
        </div>

        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0ECE1] text-[#143628] text-xs font-semibold flex items-center gap-1.5 border border-[#DDD7C9] transition-colors cursor-pointer"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-[#9E4A28] fill-[#9E4A28]' : ''}`} />
          <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Lesson Audio & Transcript (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Box */}
            <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="text-xs text-[#526357] font-semibold space-x-2">
                <span className="text-[#1E4B35] font-bold uppercase">{lesson.type}</span>
                <span>·</span>
                <span>2 Minute Read</span>
                <span>·</span>
                <span className="text-[#9E4A28]">+{lesson.quiz.points} Points on Quiz</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143628] leading-tight">
                {lesson.title}
              </h1>

              {/* Audio Narration Widget */}
              <div className="p-4 bg-[#F5F2EA] border border-[#DDD7C9] rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSpeech}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-[#9E4A28] text-white'
                        : 'bg-[#1E4B35] hover:bg-[#153827] text-white'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    )}
                  </button>

                  <div>
                    <div className="text-xs font-bold text-[#143628] flex items-center gap-2">
                      <span>Audio Narration</span>
                      {isPlayingAudio && (
                        <span className="text-[11px] text-[#9E4A28] font-normal">Speaking aloud...</span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#526357]">
                      Web Speech API synthesis · Clear citizen voice
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#1E4B35] font-bold hidden sm:block">
                  1:45 Audio
                </div>
              </div>
            </div>

            {/* Core Rule Callout */}
            <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 space-y-2 shadow-xs">
              <div className="text-xs font-bold text-[#1E4B35] uppercase tracking-wider">
                Statutory Municipal Summary
              </div>
              <p className="text-sm text-[#143628] leading-relaxed font-medium">
                {lesson.summary}
              </p>
            </div>

            {/* Full Transcript */}
            <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 space-y-3 shadow-xs">
              <div className="text-xs font-bold text-[#526357] uppercase tracking-wider">
                Civic Transcript &amp; By-Law Context
              </div>
              <p className="text-xs sm:text-sm text-[#3E4F42] leading-relaxed whitespace-pre-line">
                {lesson.transcript}
              </p>
            </div>

            {/* Ground Action Card */}
            <div className="bg-[#F3EFE6] border border-[#D9D3C5] rounded-3xl p-6 space-y-3 shadow-xs">
              <div className="text-xs font-bold text-[#1E4B35] uppercase tracking-wider">
                PrajaPulse Ground Action Trigger
              </div>
              <h3 className="text-base font-bold text-[#143628]">
                {lesson.actionCard.title}
              </h3>
              <p className="text-xs text-[#526357] leading-relaxed">
                {lesson.actionCard.description}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigateToAction(lesson.actionCard.actionType, lesson.actionCard.targetActionId)}
                  className="px-5 py-2.5 bg-[#1E4B35] hover:bg-[#153827] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Execute Action on the Ground →</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Quiz Pane (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-6">
            <div className="bg-white border border-[#DDD7C9] rounded-3xl p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 hairline-b">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#1E4B35]">
                    Interactive Knowledge Check
                  </div>
                  <h2 className="text-base font-bold text-[#143628] mt-0.5">
                    {lesson.quiz.title}
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#9E4A28] bg-[#F7EFEA] px-2.5 py-1 rounded-lg border border-[#ECD9D0]">
                  +{lesson.quiz.points} pts
                </span>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {lesson.quiz.questions.map((question, qIdx) => {
                  const selectedOpt = selectedAnswers[question.id];
                  return (
                    <div key={question.id} className="space-y-3">
                      <div className="text-xs sm:text-sm font-bold text-[#143628]">
                        {qIdx + 1}. {question.question}
                      </div>

                      <div className="space-y-2">
                        {question.options.map((opt, optIdx) => {
                          const isSelected = selectedOpt === optIdx;
                          let btnStyle = 'bg-[#FAF9F5] border-[#DDD7C9] text-[#2D3A31] hover:bg-[#F0ECE1]';

                          if (quizSubmitted) {
                            if (optIdx === question.correctAnswer) {
                              btnStyle = 'bg-[#EAF5EE] border-[#76B88F] text-[#143B23] font-bold';
                            } else if (isSelected && optIdx !== question.correctAnswer) {
                              btnStyle = 'bg-[#FDF0EE] border-[#E39D90] text-[#6B1E10] line-through';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-[#EAF3EC] border-[#1E4B35] text-[#143628] font-bold';
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
                                <CheckCircle2 className="w-4 h-4 text-[#1E4B35] shrink-0 ml-2" />
                              )}
                              {quizSubmitted && isSelected && optIdx !== question.correctAnswer && (
                                <XCircle className="w-4 h-4 text-[#9E4A28] shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {quizSubmitted && (
                        <div className="p-3.5 bg-[#F7F5EE] border border-[#DDD7C9] rounded-2xl text-xs space-y-1.5">
                          <div className="font-bold text-[#143628] flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-[#E9C46A]" />
                            <span>Civic Legal Explanation:</span>
                          </div>
                          <p className="text-[#526357] text-xs leading-relaxed">
                            {question.explanation}
                          </p>
                          {question.civicTip && (
                            <div className="mt-2 p-2 bg-[#EAF5EE] text-[#1E5634] border border-[#BDE0C8] rounded-xl text-[11px] font-semibold">
                              💡 {question.civicTip}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit / Result */}
              <div className="pt-3 hairline-t">
                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < lesson.quiz.questions.length}
                    className="w-full py-3 bg-[#1E4B35] hover:bg-[#153827] disabled:bg-[#EAE6DC] disabled:text-[#8D9E92] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    Submit Answers &amp; Collect +{lesson.quiz.points} Eco-Points
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className={`p-4 rounded-2xl text-center border ${
                      quizPassed
                        ? 'bg-[#EAF5EE] border-[#76B88F] text-[#143B23]'
                        : 'bg-[#FDF0EE] border-[#E39D90] text-[#6B1E10]'
                    }`}>
                      <div className="text-xs sm:text-sm font-bold">
                        {quizPassed ? `🎉 Perfect Score! +${pointsEarned} Eco-Points Awarded!` : 'Review the civic tips above and try again!'}
                      </div>
                    </div>

                    {!quizPassed && (
                      <button
                        onClick={handleResetQuiz}
                        className="w-full py-2.5 bg-[#FAF9F5] hover:bg-[#EFECE3] text-[#143628] text-xs font-bold rounded-xl border border-[#DDD7C9] transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
