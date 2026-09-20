import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  FileText,
  Table,
  Tv,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Clock,
  Wand2,
  RefreshCw,
  GitBranch,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  LessonPlanData,
  QuizQuestionData,
  SlideData,
  StudentMarkRecord,
  WorkshopPackage,
  MindMap,
  MindNodeData,
  ConnectionStyle,
} from '../../types';
import {
  generateLessonPlan,
  generateQuiz,
  generateSlides,
  generateStudents,
  generateWorkshopPackage,
  WORKSHOP_PRESETS,
  PresetTopic,
} from '../../data/workshopGenerator';
import { LessonPlanDocView } from './LessonPlanDocView';
import { MarksheetSheetView } from './MarksheetSheetView';
import { SlidesDeckView } from './SlidesDeckView';
import { QuizFormView } from './QuizFormView';
import { WorkshopChecklist } from './WorkshopChecklist';

interface TeachersWorkshopViewProps {
  onBackToCanvas: () => void;
  onApplyMindMap: (map: {
    title: string;
    rootId: string;
    nodes: Record<string, MindNodeData>;
    defaultLineStyle?: ConnectionStyle;
  }) => void;
}

export const TeachersWorkshopView: React.FC<TeachersWorkshopViewProps> = ({
  onBackToCanvas,
  onApplyMindMap,
}) => {
  // Topic inputs
  const [subject, setSubject] = useState('Science (Biology)');
  const [grade, setGrade] = useState('Grade 7');
  const [topic, setTopic] = useState('Photosynthesis: How Plants Make Food');
  const [duration, setDuration] = useState('45 Minutes');

  // Workshop Package State
  const [packageData, setPackageData] = useState<WorkshopPackage>(() =>
    generateWorkshopPackage(
      'Science (Biology)',
      'Grade 7',
      'Photosynthesis: How Plants Make Food',
      '45 Minutes'
    )
  );

  // Active Tab: 'docs' | 'sheets' | 'slides' | 'forms' | 'checklist'
  const [activeTab, setActiveTab] = useState<'docs' | 'sheets' | 'slides' | 'forms' | 'checklist'>('docs');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Regeneration states for individual tabs
  const [isRegeneratingSection, setIsRegeneratingSection] = useState(false);

  const handleSelectPreset = (preset: PresetTopic) => {
    setSubject(preset.subject);
    setGrade(preset.grade);
    setTopic(preset.topic);
    setDuration(preset.duration);
  };

  const handleGenerateWorkshop = async () => {
    setIsGenerating(true);
    setGenerationStep('Synthesizing 15-section Lesson Plan for Google Docs...');

    await new Promise((r) => setTimeout(r, 450));
    setGenerationStep('Populating 15-student marksheet with Google Sheets formulas...');

    await new Promise((r) => setTimeout(r, 450));
    setGenerationStep('Designing 8-slide presentation deck for Google Slides...');

    await new Promise((r) => setTimeout(r, 450));
    setGenerationStep('Formatting 10-question auto-graded quiz for Google Forms...');

    await new Promise((r) => setTimeout(r, 400));
    const newPkg = generateWorkshopPackage(subject, grade, topic, duration);
    setPackageData(newPkg);
    setIsGenerating(false);
    setGenerationStep('');
    setActiveTab('docs');
  };

  // Section update handlers
  const handleUpdateLessonPlan = (updated: LessonPlanData) => {
    setPackageData((prev) => ({ ...prev, lessonPlan: updated }));
  };

  const handleUpdateStudents = (updated: StudentMarkRecord[]) => {
    setPackageData((prev) => ({ ...prev, students: updated }));
  };

  const handleUpdateSlides = (updated: SlideData[]) => {
    setPackageData((prev) => ({ ...prev, slides: updated }));
  };

  const handleUpdateQuiz = (updated: QuizQuestionData[]) => {
    setPackageData((prev) => ({ ...prev, quiz: updated }));
  };

  // Regeneration handlers for individual sections
  const handleRegenerateLessonPlan = () => {
    setIsRegeneratingSection(true);
    setTimeout(() => {
      const plan = generateLessonPlan(packageData.subject, packageData.grade, packageData.topic, packageData.duration);
      setPackageData((prev) => ({ ...prev, lessonPlan: plan }));
      setIsRegeneratingSection(false);
    }, 400);
  };

  const handleRegenerateStudents = () => {
    setIsRegeneratingSection(true);
    setTimeout(() => {
      const students = generateStudents(packageData.subject, packageData.topic);
      setPackageData((prev) => ({ ...prev, students }));
      setIsRegeneratingSection(false);
    }, 400);
  };

  const handleRegenerateSlides = () => {
    setIsRegeneratingSection(true);
    setTimeout(() => {
      const slides = generateSlides(packageData.subject, packageData.grade, packageData.topic);
      setPackageData((prev) => ({ ...prev, slides }));
      setIsRegeneratingSection(false);
    }, 400);
  };

  const handleRegenerateQuiz = () => {
    setIsRegeneratingSection(true);
    setTimeout(() => {
      const quiz = generateQuiz(packageData.subject, packageData.grade, packageData.topic);
      setPackageData((prev) => ({ ...prev, quiz }));
      setIsRegeneratingSection(false);
    }, 400);
  };

  // Convert workshop into a Mind Map structure
  const handleConvertToMindMap = () => {
    const rootId = `root-${Date.now()}`;
    const objId = `obj-${Date.now()}`;
    const warmupId = `warmup-${Date.now()}`;
    const actId = `act-${Date.now()}`;
    const assessId = `assess-${Date.now()}`;
    const sheetsId = `sheets-${Date.now()}`;

    const nodes: any[] = [
      {
        id: rootId,
        text: packageData.topic,
        x: 600,
        y: 400,
        color: '#3b82f6',
        shape: 'rounded',
        fontSize: 20,
        fontStyle: 'bold',
        textColor: '#ffffff',
        borderStyle: 'solid',
        isRoot: true,
      },
      {
        id: objId,
        parentId: rootId,
        text: '1. Learning Objectives',
        x: 250,
        y: 260,
        color: '#10b981',
        shape: 'rounded',
        fontSize: 15,
        fontStyle: 'bold',
        textColor: '#ffffff',
        borderStyle: 'solid',
      },
      {
        id: warmupId,
        parentId: rootId,
        text: `2. Warm-up (${packageData.lessonPlan.warmupActivity.time})`,
        x: 250,
        y: 520,
        color: '#f59e0b',
        shape: 'rounded',
        fontSize: 15,
        fontStyle: 'bold',
        textColor: '#ffffff',
        borderStyle: 'solid',
      },
      {
        id: actId,
        parentId: rootId,
        text: '3. Teaching Activities',
        x: 950,
        y: 260,
        color: '#6366f1',
        shape: 'rounded',
        fontSize: 15,
        fontStyle: 'bold',
        textColor: '#ffffff',
        borderStyle: 'solid',
      },
      {
        id: assessId,
        parentId: rootId,
        text: '4. Google Forms Quiz (10 Pts)',
        x: 950,
        y: 520,
        color: '#a855f7',
        shape: 'rounded',
        fontSize: 15,
        fontStyle: 'bold',
        textColor: '#ffffff',
        borderStyle: 'solid',
      },
      {
        id: sheetsId,
        parentId: rootId,
        text: '5. Student Marksheet (15)',
        x: 600,
        y: 650,
        color: '#06b6d4',
        shape: 'rounded',
        fontSize: 14,
        fontStyle: 'bold',
        textColor: '#ffffff',
        borderStyle: 'solid',
      },
    ];

    // Add children nodes for objectives
    packageData.lessonPlan.learningObjectives.slice(0, 2).forEach((obj, idx) => {
      nodes.push({
        id: `obj-sub-${idx}`,
        parentId: objId,
        text: obj.length > 40 ? obj.slice(0, 40) + '...' : obj,
        x: 50,
        y: 220 + idx * 70,
        color: '#ecfdf5',
        shape: 'rounded',
        fontSize: 12,
        fontStyle: 'normal',
        textColor: '#065f46',
        borderStyle: 'solid',
      });
    });

    // Add children for teaching activities
    packageData.lessonPlan.teachingActivities.slice(0, 2).forEach((act, idx) => {
      nodes.push({
        id: `act-sub-${idx}`,
        parentId: actId,
        text: `[${act.time}] ${act.step}`,
        x: 1200,
        y: 220 + idx * 70,
        color: '#eef2ff',
        shape: 'rounded',
        fontSize: 12,
        fontStyle: 'normal',
        textColor: '#3730a3',
        borderStyle: 'solid',
      });
    });

    const nodesRecord: Record<string, MindNodeData> = {};
    nodes.forEach((n) => {
      nodesRecord[n.id] = n;
    });

    onApplyMindMap({
      title: `${packageData.topic} - Lesson Mind Map`,
      rootId,
      nodes: nodesRecord,
      defaultLineStyle: 'curved',
    });
    onBackToCanvas();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToCanvas}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Canvas</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold bg-gradient-to-r from-blue-600 via-emerald-600 to-purple-600 bg-clip-text text-transparent">
                  AI for Teachers Workshop
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Teaching Package Generator
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                One Topic across Google Docs, Sheets, Slides, and Forms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleConvertToMindMap}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors"
              title="Convert this lesson package into an interactive Mind Map"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send to Mind Map</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Topic Input Generator Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Workshop Activity Parameters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your Subject, Class/Grade, Chapter/Topic, and Duration to generate the unified 4-tool teaching suite.
              </p>
            </div>

            {/* Quick Presets Dropdown/Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 uppercase mr-1">Presets:</span>
              {WORKSHOP_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                    topic === preset.topic
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="mr-1">{preset.icon}</span>
                  {preset.subject.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Science (Biology)"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                Class / Grade
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Grade 7 / Class 8"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                Chapter / Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis: How Plants Make Food"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 45 Minutes"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Prominent Generate Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Active Topic: <span className="font-semibold text-slate-800 dark:text-slate-200">{packageData.topic}</span> ({packageData.subject} • {packageData.grade})
            </div>

            <button
              onClick={handleGenerateWorkshop}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{generationStep || 'Synthesizing 4 Connected Activities...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Workshop Activity</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5-Step Process Pipeline */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-3 overflow-x-auto">
          <div className="flex items-center min-w-[650px] justify-between">
            {/* Tab 1: Docs */}
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex-1 flex items-center gap-2 p-2.5 rounded-xl transition-all ${
                activeTab === 'docs'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">1. Google Docs</div>
                <div className="text-[10px] text-slate-400 font-normal">Lesson Plan (15 Pts)</div>
              </div>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mx-1" />

            {/* Tab 2: Sheets */}
            <button
              onClick={() => setActiveTab('sheets')}
              className={`flex-1 flex items-center gap-2 p-2.5 rounded-xl transition-all ${
                activeTab === 'sheets'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                <Table className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">2. Google Sheets</div>
                <div className="text-[10px] text-slate-400 font-normal">Marksheet (15 Students)</div>
              </div>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mx-1" />

            {/* Tab 3: Slides */}
            <button
              onClick={() => setActiveTab('slides')}
              className={`flex-1 flex items-center gap-2 p-2.5 rounded-xl transition-all ${
                activeTab === 'slides'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                <Tv className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">3. Google Slides</div>
                <div className="text-[10px] text-slate-400 font-normal">8-Slide Presentation</div>
              </div>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mx-1" />

            {/* Tab 4: Forms */}
            <button
              onClick={() => setActiveTab('forms')}
              className={`flex-1 flex items-center gap-2 p-2.5 rounded-xl transition-all ${
                activeTab === 'forms'
                  ? 'bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">4. Google Forms</div>
                <div className="text-[10px] text-slate-400 font-normal">10-Question Quiz</div>
              </div>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mx-1" />

            {/* Tab 5: Checklist */}
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex-1 flex items-center gap-2 p-2.5 rounded-xl transition-all ${
                activeTab === 'checklist'
                  ? 'bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-600 dark:text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">5. Review & Checklist</div>
                <div className="text-[10px] text-slate-400 font-normal">Package Completion</div>
              </div>
            </button>
          </div>
        </div>

        {/* Tab View Contents */}
        {activeTab === 'docs' && (
          <LessonPlanDocView
            lessonPlan={packageData.lessonPlan}
            onUpdate={handleUpdateLessonPlan}
            onRegenerate={handleRegenerateLessonPlan}
            isRegenerating={isRegeneratingSection}
          />
        )}

        {activeTab === 'sheets' && (
          <MarksheetSheetView
            students={packageData.students}
            topic={packageData.topic}
            onUpdateStudents={handleUpdateStudents}
            onRegenerate={handleRegenerateStudents}
            isRegenerating={isRegeneratingSection}
          />
        )}

        {activeTab === 'slides' && (
          <SlidesDeckView
            slides={packageData.slides}
            topic={packageData.topic}
            onUpdateSlides={handleUpdateSlides}
            onRegenerate={handleRegenerateSlides}
            isRegenerating={isRegeneratingSection}
          />
        )}

        {activeTab === 'forms' && (
          <QuizFormView
            quiz={packageData.quiz}
            topic={packageData.topic}
            onUpdateQuiz={handleUpdateQuiz}
            onRegenerate={handleRegenerateQuiz}
            isRegenerating={isRegeneratingSection}
          />
        )}

        {activeTab === 'checklist' && (
          <WorkshopChecklist
            workshop={packageData}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onConvertToMindMap={handleConvertToMindMap}
            onStartNew={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>
    </div>
  );
};
