import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface ExportSectionProps {
  summaryText: string;
}

export const ExportSection: React.FC<ExportSectionProps> = ({ summaryText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-slate-600 rounded-full"></div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">四、 匯出紀錄與戰報</h2>
        </div>

        {/* Copy Button */}
        <button
          id="copy-summary-btn"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 py-2 px-4 rounded-lg font-bold text-sm border cursor-pointer transition-all ${
            copied
              ? 'bg-emerald-500 text-white border-emerald-600'
              : 'bg-slate-800 text-white border-slate-900 hover:bg-slate-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>已複製！</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>一鍵複製戰報</span>
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <textarea
          id="summary-output-textarea"
          readOnly
          value={summaryText}
          className="w-full h-80 bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-xs leading-relaxed text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          placeholder="暫無戰局資料可匯出..."
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />
        <div className="absolute right-3 bottom-4 pointer-events-none text-xs text-slate-400 flex items-center gap-1">
          <Share2 className="w-3.5 h-3.5" />
          <span>點擊框内文字可全選</span>
        </div>
      </div>
    </section>
  );
};
