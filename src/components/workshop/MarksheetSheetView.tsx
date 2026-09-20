import React, { useState } from 'react';
import {
  Copy,
  Download,
  Printer,
  Check,
  RefreshCw,
  Table,
  TrendingUp,
  Award,
  AlertTriangle,
  HelpCircle,
  BarChart2,
  Code,
  Info,
} from 'lucide-react';
import { StudentMarkRecord } from '../../types';
import {
  computeClassStats,
  computeStudentStats,
  downloadMarksheetAsCSV,
  formatMarksheetForGoogleSheetsTSV,
} from '../../data/workshopGenerator';

interface MarksheetSheetViewProps {
  students: StudentMarkRecord[];
  topic: string;
  onUpdateStudents: (students: StudentMarkRecord[]) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const MarksheetSheetView: React.FC<MarksheetSheetViewProps> = ({
  students,
  topic,
  onUpdateStudents,
  onRegenerate,
  isRegenerating,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showFormulaGuide, setShowFormulaGuide] = useState(true);
  const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');
  const [hoveredStudent, setHoveredStudent] = useState<StudentMarkRecord | null>(null);

  const stats = computeClassStats(students);

  const handleCopyTSV = async () => {
    const text = formatMarksheetForGoogleSheetsTSV(students);
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

  const handleDownloadCSV = () => {
    downloadMarksheetAsCSV(students, topic);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCellChange = (
    id: string,
    field: keyof Omit<StudentMarkRecord, 'id'>,
    value: string
  ) => {
    const updated = students.map((s) => {
      if (s.id !== id) return s;
      if (field === 'name') {
        return { ...s, name: value };
      }
      const num = Math.max(0, parseInt(value, 10) || 0);
      return { ...s, [field]: num };
    });
    onUpdateStudents(updated);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Google Sheets – Student Marksheet
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Step 2 of Workshop
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              15 Students with automated SUM, Percentage, IFS Grades, and Pass/Fail formulas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                activeTab === 'table'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                activeTab === 'chart'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Chart</span>
            </button>
          </div>

          <button
            onClick={() => setShowFormulaGuide(!showFormulaGuide)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showFormulaGuide
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Formula Guide</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            title="Generate fresh realistic random marks"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            title="Download CSV file"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={handlePrint}
            title="Print Marksheet"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleCopyTSV}
            title="Copy table with formulas to paste directly into Google Sheets cell A1"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all ${
              isCopied
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied for Sheets!' : 'Copy for Sheets'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Class Average</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.average} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Highest Mark</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.highest} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Lowest Mark</div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {stats.lowest} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            %
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Pass Percentage</div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {stats.passPercentage}%{' '}
              <span className="text-xs font-normal text-slate-400">({stats.passCount}/{students.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formula Guide Card for Beginner Teachers */}
      {showFormulaGuide && (
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 text-sm">
              <Code className="w-4 h-4 text-emerald-600" />
              Google Sheets Formulas Explanation Guide (For Teachers)
            </h4>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
              Copying table auto-injects these exact formulas into Google Sheets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
              <div className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Total Marks (Row 2):</div>
              <code className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold block bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                =SUM(B2:F2)
              </code>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-1">
                Adds Test 1, Test 2, Assignment, Activity, and Final Exam.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
              <div className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Percentage:</div>
              <code className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold block bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                =G2/100
              </code>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-1">
                Divides Total by 100. Format column as Percentage in Sheets.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
              <div className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Grade Calculation:</div>
              <code className="text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold block bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded truncate" title='=IFS(H2>=0.9,"A",H2>=0.75,"B",H2>=0.6,"C",H2>=0.4,"D",TRUE,"F")'>
                =IFS(H2&gt;=0.9,"A",H2&gt;=0.75,"B",...)
              </code>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-1">
                Assigns Grade A (&gt;=90%), B (&gt;=75%), C (&gt;=60%), D (&gt;=40%), F.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
              <div className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Pass / Fail Result:</div>
              <code className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold block bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                =IF(G2&gt;=40,"Pass","Fail")
              </code>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-1">
                Evaluates if student reaches the 40-mark passing benchmark.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area: Table or Chart */}
      {activeTab === 'table' ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Simulated Google Sheets Formula Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 px-3 py-1.5 flex items-center gap-2 text-xs">
            <span className="font-mono font-bold text-slate-400 select-none">fx</span>
            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-600" />
            <span className="font-mono text-slate-700 dark:text-slate-300">
              =SUM(B2:F2) • Press "Copy for Sheets" and paste into Google Sheets cell A1
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700 select-none">
                  <th className="py-2.5 px-3 w-10 text-center text-slate-400">#</th>
                  <th className="py-2.5 px-3 min-w-[140px]">Student Name</th>
                  <th className="py-2.5 px-2.5 text-center min-w-[75px]">Test 1 (20)</th>
                  <th className="py-2.5 px-2.5 text-center min-w-[75px]">Test 2 (20)</th>
                  <th className="py-2.5 px-2.5 text-center min-w-[80px]">Assignment (10)</th>
                  <th className="py-2.5 px-2.5 text-center min-w-[75px]">Activity (10)</th>
                  <th className="py-2.5 px-2.5 text-center min-w-[85px]">Final Exam (40)</th>
                  <th className="py-2.5 px-2.5 text-center font-bold bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 min-w-[80px]">
                    Total (100)
                  </th>
                  <th className="py-2.5 px-2.5 text-center min-w-[75px]">Percentage</th>
                  <th className="py-2.5 px-2.5 text-center min-w-[60px]">Grade</th>
                  <th className="py-2.5 px-3 text-center min-w-[75px]">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((student, idx) => {
                  const { total, percentage, grade, result } = computeStudentStats(student);
                  const isPass = result === 'Pass';

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-2 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) => handleCellChange(student.id, 'name', e.target.value)}
                          className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 px-1.5 py-0.5 rounded outline-none border border-transparent focus:border-indigo-400 w-full"
                        />
                      </td>
                      <td className="py-2 px-2.5 text-center">
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={student.test1}
                          onChange={(e) => handleCellChange(student.id, 'test1', e.target.value)}
                          className="w-14 text-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 px-1 py-0.5 rounded outline-none border border-transparent focus:border-indigo-400 font-mono"
                        />
                      </td>
                      <td className="py-2 px-2.5 text-center">
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={student.test2}
                          onChange={(e) => handleCellChange(student.id, 'test2', e.target.value)}
                          className="w-14 text-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 px-1 py-0.5 rounded outline-none border border-transparent focus:border-indigo-400 font-mono"
                        />
                      </td>
                      <td className="py-2 px-2.5 text-center">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={student.assignment}
                          onChange={(e) => handleCellChange(student.id, 'assignment', e.target.value)}
                          className="w-14 text-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 px-1 py-0.5 rounded outline-none border border-transparent focus:border-indigo-400 font-mono"
                        />
                      </td>
                      <td className="py-2 px-2.5 text-center">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={student.activity}
                          onChange={(e) => handleCellChange(student.id, 'activity', e.target.value)}
                          className="w-14 text-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 px-1 py-0.5 rounded outline-none border border-transparent focus:border-indigo-400 font-mono"
                        />
                      </td>
                      <td className="py-2 px-2.5 text-center">
                        <input
                          type="number"
                          min={0}
                          max={40}
                          value={student.finalExam}
                          onChange={(e) => handleCellChange(student.id, 'finalExam', e.target.value)}
                          className="w-14 text-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 px-1 py-0.5 rounded outline-none border border-transparent focus:border-indigo-400 font-mono font-medium"
                        />
                      </td>
                      <td className="py-2 px-2.5 text-center font-bold text-blue-700 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20 font-mono">
                        {total}
                      </td>
                      <td className="py-2 px-2.5 text-center font-mono text-slate-700 dark:text-slate-300">
                        {percentage}%
                      </td>
                      <td className="py-2 px-2.5 text-center">
                        <span
                          className={`inline-block font-bold text-xs px-2 py-0.5 rounded ${
                            grade === 'A'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : grade === 'B'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                              : grade === 'C'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                              : grade === 'D'
                              ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {grade}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isPass
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {result}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Summary Footer */}
              <tfoot className="bg-slate-50 dark:bg-slate-800 font-semibold border-t-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                <tr>
                  <td colSpan={2} className="py-2.5 px-3 text-right text-xs uppercase font-bold text-slate-500">
                    Class Average
                  </td>
                  <td colSpan={5} className="py-2.5 px-2.5 text-center text-slate-400 text-[11px]">
                    =AVERAGE(G2:G16)
                  </td>
                  <td className="py-2.5 px-2.5 text-center text-blue-700 dark:text-blue-400 font-bold font-mono">
                    {stats.average}
                  </td>
                  <td className="py-2.5 px-2.5 text-center font-mono">
                    {stats.average}%
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">
                    Pass: {stats.passPercentage}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        /* Performance Chart View */
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-600" />
                Student Performance Distribution Chart (Total Marks / 100)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing scores across 15 students with 40-mark passing threshold
              </p>
            </div>

            {/* Grade Legend */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
                Grade A (90+)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-blue-500 inline-block" />
                Grade B (75-89)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
                Grade C (60-74)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-orange-500 inline-block" />
                Grade D (40-59)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
                Fail (&lt;40)
              </span>
            </div>
          </div>

          {/* Bar Chart Canvas */}
          <div className="relative pt-6 pb-2">
            {/* 40-mark pass line indicator */}
            <div
              className="absolute left-8 right-0 border-b-2 border-dashed border-rose-400/80 z-10 flex items-center justify-end pr-2"
              style={{ bottom: `${40 * 2.2 + 28}px` }}
            >
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900 px-1 rounded shadow-xs">
                Pass Threshold (40 Marks)
              </span>
            </div>

            {/* Bars */}
            <div className="flex items-end justify-between gap-1.5 sm:gap-3 h-64 pl-8 pr-2 border-b border-l border-slate-200 dark:border-slate-700">
              {students.map((student) => {
                const { total, grade, result } = computeStudentStats(student);
                const heightPx = Math.max(12, total * 2.2);

                const barColor =
                  grade === 'A'
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : grade === 'B'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : grade === 'C'
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : grade === 'D'
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-rose-500 hover:bg-rose-600';

                return (
                  <div
                    key={student.id}
                    onMouseEnter={() => setHoveredStudent(student)}
                    onMouseLeave={() => setHoveredStudent(null)}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  >
                    {/* Value on top of bar */}
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1 group-hover:text-indigo-600">
                      {total}
                    </span>

                    {/* Bar Pill */}
                    <div
                      style={{ height: `${heightPx}px` }}
                      className={`w-full max-w-[28px] rounded-t-md transition-all duration-200 ${barColor}`}
                    />

                    {/* Student Initials / Short Name below */}
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate max-w-[40px] text-center">
                      {student.name.split(' ')[0]}
                    </span>

                    {/* Tooltip on Hover */}
                    {hoveredStudent?.id === student.id && (
                      <div className="absolute bottom-full mb-6 z-30 bg-slate-900 text-white text-[11px] p-2.5 rounded-lg shadow-xl w-40 pointer-events-none animate-in fade-in">
                        <div className="font-bold border-b border-slate-700 pb-1 mb-1">
                          {student.name}
                        </div>
                        <div className="space-y-0.5 text-slate-300">
                          <div className="flex justify-between">
                            <span>Total Score:</span>
                            <span className="font-bold text-white">{total}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Grade:</span>
                            <span className="font-bold text-emerald-400">{grade}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Final Exam:</span>
                            <span>{student.finalExam}/40</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={result === 'Pass' ? 'text-emerald-400' : 'text-rose-400'}>
                              {result}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grade Breakdown Cards */}
          <div className="grid grid-cols-5 gap-2 pt-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 block">Grade A</span>
              <span className="text-base font-bold text-emerald-900 dark:text-emerald-100">{stats.gradeCounts.A} Students</span>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800">
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 block">Grade B</span>
              <span className="text-base font-bold text-blue-900 dark:text-blue-100">{stats.gradeCounts.B} Students</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 block">Grade C</span>
              <span className="text-base font-bold text-amber-900 dark:text-amber-100">{stats.gradeCounts.C} Students</span>
            </div>
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800">
              <span className="text-[11px] font-semibold text-orange-700 dark:text-orange-300 block">Grade D</span>
              <span className="text-base font-bold text-orange-900 dark:text-orange-100">{stats.gradeCounts.D} Students</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800">
              <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 block">Failed</span>
              <span className="text-base font-bold text-rose-900 dark:text-rose-100">{stats.gradeCounts.F} Students</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
