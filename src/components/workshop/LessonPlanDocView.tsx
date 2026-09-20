import React, { useState } from 'react';
import {
  Copy,
  Download,
  Printer,
  Check,
  Edit3,
  RefreshCw,
  FileText,
  Clock,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Sparkles,
  HelpCircle,
  Home,
  Users,
  Target,
} from 'lucide-react';
import { LessonPlanData } from '../../types';
import { downloadLessonPlanAsDoc, formatLessonPlanForGoogleDocs } from '../../data/workshopGenerator';

interface LessonPlanDocViewProps {
  lessonPlan: LessonPlanData;
  onUpdate: (updated: LessonPlanData) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const LessonPlanDocView: React.FC<LessonPlanDocViewProps> = ({
  lessonPlan,
  onUpdate,
  onRegenerate,
  isRegenerating,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<LessonPlanData>(lessonPlan);

  const handleCopy = async () => {
    const text = formatLessonPlanForGoogleDocs(lessonPlan);
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
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

  const handleDownloadDoc = () => {
    downloadLessonPlanAsDoc(lessonPlan);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEdit = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Action Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Google Docs – 15-Section Lesson Plan
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                Step 1 of Workshop
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formatted with standard pedagogical headings ready to copy directly into Google Docs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={() => {
              if (isEditing) {
                handleSaveEdit();
              } else {
                setEditForm(lessonPlan);
                setIsEditing(true);
              }
            }}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Save Changes' : 'Edit Plan'}</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            title="Regenerate this lesson plan with fresh activities"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          <button
            onClick={handleDownloadDoc}
            title="Download formatted file for Google Docs or MS Word"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Download .doc</span>
          </button>

          <button
            onClick={handlePrint}
            title="Print or save as PDF"
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
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied for Docs!' : 'Copy for Docs'}</span>
          </button>
        </div>
      </div>

      {/* Document Preview Canvas */}
      <div className="bg-slate-100 dark:bg-slate-950 p-3 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-center">
        <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-6 sm:p-10 text-slate-800 dark:text-slate-100 space-y-6 print:shadow-none print:border-none print:p-0">
          {/* Header Banner */}
          <div className="border-b-2 border-blue-600 pb-5">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <span>Standard Curriculum Lesson Plan</span>
              <span>Google Docs Template</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {lessonPlan.topic}
            </h1>
          </div>

          {/* Metadata Grid (Items 1-4) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">1. Subject</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{lessonPlan.subject}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">2. Class / Grade</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{lessonPlan.grade}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">3. Topic</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate block" title={lessonPlan.topic}>
                {lessonPlan.topic}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">4. Duration</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lessonPlan.duration}
              </span>
            </div>
          </div>

          {/* 5. Learning Objectives */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              5. Learning Objectives
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {lessonPlan.learningObjectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </section>

          {/* 6. Learning Outcomes */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              6. Learning Outcomes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              By the end of this lesson, students will be able to:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {lessonPlan.learningOutcomes.map((out, i) => (
                <li key={i}>{out}</li>
              ))}
            </ul>
          </section>

          {/* 7. Previous Knowledge */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              7. Previous Knowledge
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {lessonPlan.previousKnowledge.map((pk, i) => (
                <li key={i}>{pk}</li>
              ))}
            </ul>
          </section>

          {/* 8. Warm-up Activity */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <span className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                8. Introduction / Warm-Up Activity
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                {lessonPlan.warmupActivity.time}
              </span>
            </h2>
            <div className="bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-3.5 rounded-r-lg">
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                {lessonPlan.warmupActivity.title}
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {lessonPlan.warmupActivity.description}
              </p>
            </div>
          </section>

          {/* 9. Teaching & Learning Activities */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              9. Teaching and Learning Activities
            </h2>
            <div className="space-y-2.5">
              {lessonPlan.teachingActivities.map((act, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      Step {i + 1}: {act.step}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {act.details}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 10. Examples */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              10. Examples
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {lessonPlan.examples.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </section>

          {/* 11. Student Activity */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                11. Student Activity
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                {lessonPlan.studentActivity.time}
              </span>
            </h2>
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-2">
                {lessonPlan.studentActivity.title}
              </h4>
              <ol className="list-decimal list-outside ml-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                {lessonPlan.studentActivity.instructions.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ol>
            </div>
          </section>

          {/* 12. Assessment Questions */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <HelpCircle className="w-4 h-4 text-rose-600" />
              12. Assessment Questions
            </h2>
            <ol className="list-decimal list-outside ml-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {lessonPlan.assessmentQuestions.map((q, i) => (
                <li key={i} className="font-medium text-slate-800 dark:text-slate-200">
                  {q}
                </li>
              ))}
            </ol>
          </section>

          {/* 13. Homework */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <Home className="w-4 h-4 text-blue-600" />
              13. Homework
            </h2>
            <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {lessonPlan.homework.map((hw, i) => (
                <li key={i}>{hw}</li>
              ))}
            </ul>
          </section>

          {/* 14 & 15. Differentiation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* 14. Support for Slow Learners */}
            <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-1.5">
                <span>🛡️</span> 14. Differentiation / Support for Slow Learners
              </h3>
              <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {lessonPlan.differentiationSlowLearners.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* 15. Extension for Advanced Learners */}
            <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
              <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-1.5">
                <span>🚀</span> 15. Extension Activity for Advanced Learners
              </h3>
              <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {lessonPlan.extensionAdvancedLearners.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
