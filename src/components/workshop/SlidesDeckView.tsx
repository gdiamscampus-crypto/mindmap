import React, { useState } from 'react';
import {
  Copy,
  Printer,
  Check,
  RefreshCw,
  Tv,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Maximize2,
  Image as ImageIcon,
  MessageSquare,
  Edit3,
  FileText,
} from 'lucide-react';
import { SlideData } from '../../types';
import { formatSlidesForGoogleSlides } from '../../data/workshopGenerator';

interface SlidesDeckViewProps {
  slides: SlideData[];
  topic: string;
  onUpdateSlides: (slides: SlideData[]) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const SlidesDeckView: React.FC<SlidesDeckViewProps> = ({
  slides,
  topic,
  onUpdateSlides,
  onRegenerate,
  isRegenerating,
}) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'slide' | 'grid'>('slide');
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const activeSlide = slides[currentSlideIdx] || slides[0];

  const handleCopy = async () => {
    const text = formatSlidesForGoogleSlides(slides, topic);
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

  const handleUpdateCurrentSlide = (field: keyof SlideData, value: any) => {
    const updated = slides.map((s, idx) => {
      if (idx !== currentSlideIdx) return s;
      return { ...s, [field]: value };
    });
    onUpdateSlides(updated);
  };

  const handlePrev = () => {
    setCurrentSlideIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIdx((prev) => Math.min(slides.length - 1, prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Google Slides – 8-Slide Presentation
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Step 3 of Workshop
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exactly 8 pedagogical slides with visuals and teacher speaking points
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Mode Switcher: Single Slide vs Grid */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode('slide')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'slide'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Slide View</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View (8)</span>
            </button>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isEditing
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Done Editing' : 'Edit Slide'}</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            title="Regenerate presentation content"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-600' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          <button
            onClick={handlePrint}
            title="Print Slides"
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
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied for Slides!' : 'Copy for Slides'}</span>
          </button>
        </div>
      </div>

      {viewMode === 'slide' ? (
        <div className="space-y-4">
          {/* Main 16:9 Slide Canvas */}
          <div className="flex justify-center">
            <div className="w-full max-w-4xl bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col">
              {/* Slide Title Bar */}
              <div className="bg-slate-800/90 px-5 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  <span>Slide {activeSlide.slideNumber} of 8</span>
                  <span className="text-slate-500">•</span>
                  <span>{topic}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    disabled={currentSlideIdx === 0}
                    className="p-1 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-700">
                    {currentSlideIdx + 1} / 8
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentSlideIdx === slides.length - 1}
                    className="p-1 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 16:9 Presentation Stage */}
              <div className="p-8 sm:p-12 min-h-[360px] sm:min-h-[420px] flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/40 relative">
                {/* Slide Header */}
                <div className="space-y-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={activeSlide.title}
                      onChange={(e) => handleUpdateCurrentSlide('title', e.target.value)}
                      className="text-2xl sm:text-3xl font-bold bg-slate-800/80 text-white px-3 py-1.5 rounded-lg border border-amber-500/60 w-full outline-none"
                    />
                  ) : (
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-300 drop-shadow-xs">
                      {activeSlide.title}
                    </h2>
                  )}

                  {/* Bullet Points */}
                  <div className="space-y-2.5 pt-2">
                    {isEditing ? (
                      <textarea
                        rows={5}
                        value={activeSlide.content.join('\n')}
                        onChange={(e) =>
                          handleUpdateCurrentSlide(
                            'content',
                            e.target.value.split('\n').filter((l) => l.trim())
                          )
                        }
                        className="w-full bg-slate-800/80 text-white p-3 rounded-lg border border-amber-500/60 text-sm font-sans outline-none leading-relaxed"
                      />
                    ) : (
                      <ul className="space-y-2.5 text-base sm:text-lg text-slate-200">
                        {activeSlide.content.map((point, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-amber-400 mt-2.5 shrink-0" />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Suggested Visual Badge at bottom of slide */}
                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-amber-400/20 text-amber-300">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-300">Suggested Visual:</span>
                    <span className="italic text-slate-400 max-w-xl truncate" title={activeSlide.suggestedVisual}>
                      {activeSlide.suggestedVisual}
                    </span>
                  </div>
                  <span className="font-bold text-slate-500 tracking-wider">#{activeSlide.slideNumber}</span>
                </div>
              </div>

              {/* Speaker Notes Drawer (Google Slides Style) */}
              <div className="bg-slate-850 p-4 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-400 uppercase tracking-wider text-[11px] mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Teacher Speaking Point (Presenter Note)</span>
                </div>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={activeSlide.speakingPoint}
                    onChange={(e) => handleUpdateCurrentSlide('speakingPoint', e.target.value)}
                    className="w-full bg-slate-800 text-slate-200 p-2 rounded border border-amber-500/60 outline-none text-xs"
                  />
                ) : (
                  <p className="text-slate-300 italic leading-relaxed pl-5 border-l-2 border-amber-500">
                    "{activeSlide.speakingPoint}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Filmstrip Slide Thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto py-2 px-1">
            {slides.map((slide, idx) => {
              const isSelected = idx === currentSlideIdx;
              return (
                <button
                  key={slide.slideNumber}
                  onClick={() => setCurrentSlideIdx(idx)}
                  className={`shrink-0 w-36 h-24 rounded-xl p-2.5 text-left flex flex-col justify-between transition-all border ${
                    isSelected
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-md scale-105'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>Slide {slide.slideNumber}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight">
                    {slide.title}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">
                    {slide.content.length} bullets
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Grid View: All 8 Slides */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {slides.map((slide, idx) => (
            <div
              key={slide.slideNumber}
              onClick={() => {
                setCurrentSlideIdx(idx);
                setViewMode('slide');
              }}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between h-72"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                  <span>Slide {slide.slideNumber} of 8</span>
                  <span className="text-slate-400 font-normal">Click to View</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {slide.title}
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-outside ml-4">
                  {slide.content.slice(0, 3).map((pt, i) => (
                    <li key={i} className="line-clamp-1">{pt}</li>
                  ))}
                  {slide.content.length > 3 && (
                    <li className="text-slate-400 text-[10px]">+{slide.content.length - 3} more...</li>
                  )}
                </ul>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold truncate">
                  <ImageIcon className="w-3 h-3 shrink-0" />
                  <span className="truncate">{slide.suggestedVisual}</span>
                </div>
                <div className="text-[10px] italic text-slate-400 line-clamp-2">
                  "{slide.speakingPoint}"
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
