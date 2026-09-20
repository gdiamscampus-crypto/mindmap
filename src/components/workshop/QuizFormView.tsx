import React, { useState } from 'react';
import {
  Copy,
  Printer,
  Check,
  RefreshCw,
  HelpCircle,
  Zap,
  Award,
  Eye,
  Edit3,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { QuizQuestionData } from '../../types';
import { formatQuizForGoogleForms } from '../../data/workshopGenerator';

interface QuizFormViewProps {
  quiz: QuizQuestionData[];
  topic: string;
  onUpdateQuiz: (quiz: QuizQuestionData[]) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const QuizFormView: React.FC<QuizFormViewProps> = ({
  quiz,
  topic,
  onUpdateQuiz,
  onRegenerate,
  isRegenerating,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'teacher' | 'interactive' | 'edit'>('teacher');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCopy = async () => {
    const text = formatQuizForGoogleForms(quiz, topic);
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectOption = (questionId: number, option: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q) => {
      if (userAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        score += q.marks;
      }
    });
    return score;
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
  };

  const handleQuestionEdit = (id: number, field: keyof QuizQuestionData, val: any) => {
    const updated = quiz.map((q) => (q.id === id ? { ...q, [field]: val } : q));
    onUpdateQuiz(updated);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Google Forms – 10-Question Quiz
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                Step 4 of Workshop
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              7 Multiple Choice + 2 True/False + 1 Application Question (10 Points Total)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'teacher'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Teacher Key</span>
            </button>
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'interactive'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Take Quiz</span>
            </button>
            <button
              onClick={() => setViewMode('edit')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'edit'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            title="Regenerate quiz questions"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-purple-600' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          <button
            onClick={handlePrint}
            title="Print quiz test paper"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all ${
              isCopied
                ? 'bg-emerald-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied for Forms!' : 'Copy for Forms'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Score Header Banner (if taking quiz) */}
      {viewMode === 'interactive' && isSubmitted && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
              {calculateScore()}/10
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-base">
                Quiz Evaluation Completed!
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                You scored {calculateScore()} points out of 10 (
                {calculateScore() >= 8 ? 'Outstanding Mastery! 🌟' : calculateScore() >= 5 ? 'Good Effort! 👍' : 'Review Recommended 📚'}
                )
              </p>
            </div>
          </div>
          <button
            onClick={handleResetQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>
        </div>
      )}

      {/* Google Forms Styled Container */}
      <div className="bg-slate-100 dark:bg-slate-950 p-3 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center">
        <div className="w-full max-w-3xl space-y-4">
          {/* Google Forms Top Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border-t-8 border-t-purple-600 border border-slate-200 dark:border-slate-800 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Google Forms Quiz
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                10 Points • Auto-Release Enabled
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {topic} – Unit Knowledge Assessment
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Complete this diagnostic quiz to evaluate your understanding of key mechanisms, word equations, definitions, and application reasoning.
            </p>
          </div>

          {/* Questions List */}
          {quiz.map((question) => {
            const isUserAnswer = userAnswers[question.id];
            const isCorrect =
              isUserAnswer?.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

            return (
              <div
                key={question.id}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 space-y-3.5 transition-all"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {question.id}
                    </span>
                    <div>
                      {viewMode === 'edit' ? (
                        <textarea
                          rows={2}
                          value={question.question}
                          onChange={(e) => handleQuestionEdit(question.id, 'question', e.target.value)}
                          className="w-full text-sm font-semibold bg-slate-50 dark:bg-slate-800 p-2 rounded border border-purple-400 outline-none text-slate-900 dark:text-white"
                        />
                      ) : (
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                          {question.question}
                        </h4>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Auto-grade badge */}
                    {question.autoGrading ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        <span className="hidden sm:inline">Auto-Graded</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        <Award className="w-3 h-3 text-indigo-600" />
                        <span>Rubric</span>
                      </span>
                    )}

                    <span className="text-xs font-bold text-slate-400">
                      {question.marks} pt
                    </span>
                  </div>
                </div>

                {/* Options (MCQ / True-False) */}
                {question.options && question.options.length > 0 && (
                  <div className="space-y-2 pt-1 pl-8">
                    {question.options.map((option, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isSelected = isUserAnswer === option;
                      const isThisCorrect =
                        question.correctAnswer.trim().toLowerCase() === option.trim().toLowerCase();

                      let optionBg =
                        'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-purple-300';

                      if (viewMode === 'teacher') {
                        if (isThisCorrect) {
                          optionBg =
                            'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-400';
                        }
                      } else if (viewMode === 'interactive') {
                        if (isSubmitted) {
                          if (isThisCorrect) {
                            optionBg =
                              'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 font-semibold text-emerald-900 dark:text-emerald-200';
                          } else if (isSelected && !isThisCorrect) {
                            optionBg =
                              'bg-rose-50 dark:bg-rose-950/40 border-rose-500 font-semibold text-rose-900 dark:text-rose-200';
                          }
                        } else if (isSelected) {
                          optionBg =
                            'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-950 dark:text-purple-200 font-semibold ring-1 ring-purple-400';
                        }
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => {
                            if (viewMode === 'interactive') {
                              handleSelectOption(question.id, option);
                            }
                          }}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                            viewMode === 'interactive' && !isSubmitted ? 'cursor-pointer' : ''
                          } ${optionBg}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-[10px] text-slate-500">
                              {letter}
                            </span>
                            <span className="text-slate-800 dark:text-slate-200">{option}</span>
                          </div>

                          {viewMode === 'teacher' && isThisCorrect && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Answer Key
                            </span>
                          )}

                          {viewMode === 'interactive' && isSubmitted && (
                            <>
                              {isThisCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              )}
                              {isSelected && !isThisCorrect && (
                                <XCircle className="w-4 h-4 text-rose-600" />
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Application Question (Open Ended) */}
                {question.type === 'application' && (
                  <div className="pl-8 pt-1">
                    {viewMode === 'interactive' ? (
                      <textarea
                        rows={3}
                        disabled={isSubmitted}
                        value={userAnswers[question.id] || ''}
                        onChange={(e) => handleSelectOption(question.id, e.target.value)}
                        placeholder="Type your reasoned explanation here..."
                        className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs outline-none"
                      />
                    ) : (
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                          Model Rubric Answer (for Teacher Evaluation)
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                          {question.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation / Form Feedback */}
                {(viewMode === 'teacher' || (viewMode === 'interactive' && isSubmitted)) && (
                  <div className="ml-8 mt-2 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border-l-4 border-purple-500 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-purple-900 dark:text-purple-200 block mb-0.5">
                      💡 Automated Form Feedback / Explanation:
                    </span>
                    {question.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Action in Interactive Mode */}
          {viewMode === 'interactive' && !isSubmitted && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsSubmitted(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & View Automated Grade</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
