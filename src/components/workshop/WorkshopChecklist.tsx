import React, { useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Table,
  Tv,
  HelpCircle,
  Download,
  Copy,
  Printer,
  Sparkles,
  ArrowRight,
  GitBranch,
  RotateCcw,
  Check,
} from 'lucide-react';
import { WorkshopPackage } from '../../types';
import {
  formatLessonPlanForGoogleDocs,
  formatMarksheetForGoogleSheetsTSV,
  formatQuizForGoogleForms,
  formatSlidesForGoogleSlides,
} from '../../data/workshopGenerator';

interface WorkshopChecklistProps {
  workshop: WorkshopPackage;
  onNavigateTab: (tab: 'docs' | 'sheets' | 'slides' | 'forms') => void;
  onConvertToMindMap: () => void;
  onStartNew: () => void;
}

export const WorkshopChecklist: React.FC<WorkshopChecklistProps> = ({
  workshop,
  onNavigateTab,
  onConvertToMindMap,
  onStartNew,
}) => {
  const [isCopiedAll, setIsCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    const fullPackage = `================================================================================
AI FOR TEACHERS WORKSHOP: COMPLETE DIGITAL TEACHING PACKAGE
================================================================================
Subject: ${workshop.subject}
Class / Grade: ${workshop.grade}
Topic: ${workshop.topic}
Duration: ${workshop.duration}
Generated on: ${new Date(workshop.createdAt).toLocaleString()}

================================================================================
PART 1: GOOGLE DOCS LESSON PLAN
================================================================================
${formatLessonPlanForGoogleDocs(workshop.lessonPlan)}

================================================================================
PART 2: GOOGLE SHEETS STUDENT MARKSHEET (15 STUDENTS WITH FORMULAS)
================================================================================
${formatMarksheetForGoogleSheetsTSV(workshop.students)}

================================================================================
PART 3: GOOGLE SLIDES PRESENTATION (8 SLIDES)
================================================================================
${formatSlidesForGoogleSlides(workshop.slides, workshop.topic)}

================================================================================
PART 4: GOOGLE FORMS QUIZ (10 QUESTIONS WITH AUTO-GRADING)
================================================================================
${formatQuizForGoogleForms(workshop.quiz, workshop.topic)}
`;

    try {
      await navigator.clipboard.writeText(fullPackage);
      setIsCopiedAll(true);
      setTimeout(() => setIsCopiedAll(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullPackage;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopiedAll(true);
      setTimeout(() => setIsCopiedAll(false), 2500);
    }
  };

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Success Completion */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Teaching Package 100% Complete</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {workshop.topic}
            </h2>
            <p className="text-emerald-100 text-sm max-w-xl">
              All 4 connected teaching activities have been synthesized using the exact same subject ({workshop.subject}), grade ({workshop.grade}), and topic.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyAll}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-md ${
                isCopiedAll ? 'bg-emerald-900 text-white' : 'bg-white text-slate-900 hover:bg-emerald-50'
              }`}
            >
              {isCopiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{isCopiedAll ? 'Copied Full Package!' : 'Copy Full Teaching Package'}</span>
            </button>

            <button
              onClick={handlePrintAll}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all backdrop-blur-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Complete Workshop</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Connected Activities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Google Docs */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    1. Google Docs – Lesson Plan
                  </h3>
                  <span className="text-[11px] text-slate-500">15-Point Structured Framework</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            </div>

            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-2 border-l-2 border-blue-500/30">
              <li>• Complete objectives, learning outcomes & previous knowledge</li>
              <li>• Warm-up hook ({workshop.lessonPlan.warmupActivity.time}) & timed teaching stages</li>
              <li>• Student hands-on activity, 3 assessment questions & homework</li>
              <li>• Targeted differentiation for slow learners & advanced extensions</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('docs')}
            className="w-full py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View & Export Lesson Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Google Sheets */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Table className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    2. Google Sheets – Marksheet
                  </h3>
                  <span className="text-[11px] text-slate-500">15 Students + Automated Formulas</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            </div>

            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-2 border-l-2 border-emerald-500/30">
              <li>• Columns: Test 1, Test 2, Assignment, Activity, Final Exam</li>
              <li>• Formulas: =SUM(B2:F2), =G2/100, =IFS(...), =IF(G2&gt;=40,"Pass","Fail")</li>
              <li>• Class statistics: Average, Highest mark, Lowest mark, Pass %</li>
              <li>• Responsive student performance bar chart with color-coded grades</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('sheets')}
            className="w-full py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View & Export Marksheet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Google Slides */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    3. Google Slides – Presentation
                  </h3>
                  <span className="text-[11px] text-slate-500">8 Curated Lesson Slides</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            </div>

            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-2 border-l-2 border-amber-500/30">
              <li>• 8 Slides: Title, Objectives, Hook, Key Concepts, Examples, Activity, Revision, Exit Ticket</li>
              <li>• Crisp pedagogical bullet points calibrated for classroom display</li>
              <li>• Concrete visual ideas & prompt descriptions for every slide</li>
              <li>• Dedicated teacher speaker notes for fluid classroom delivery</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('slides')}
            className="w-full py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View & Export Slides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Google Forms */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    4. Google Forms – Quiz
                  </h3>
                  <span className="text-[11px] text-slate-500">10 Questions (Auto-Grading)</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            </div>

            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-2 border-l-2 border-purple-500/30">
              <li>• 7 Multiple Choice questions with complete distractors & correct answer keys</li>
              <li>• 2 True / False concept checks tagged for instant automated scoring</li>
              <li>• 1 Application / Reasoning question with model rubric answer</li>
              <li>• Form feedback explanations provided for every single question</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('forms')}
            className="w-full py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View & Export Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Integration Bridge to Mind Map & Next Action */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Bridge to Mind Map Canvas
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Automatically convert this lesson topic, objectives, and teaching activities into an interactive Mind Map on your canvas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onStartNew}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Generate Another Topic</span>
          </button>

          <button
            onClick={onConvertToMindMap}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open in Mind Map Canvas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
