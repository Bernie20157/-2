import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, RefreshCw } from 'lucide-react';

interface ResetSectionProps {
  onResetEnemies: () => void;
  onResetRookies: () => void;
  onResetEventCards: () => void;
  onResetAll: () => void;
}

export const ResetSection: React.FC<ResetSectionProps> = ({
  onResetEnemies,
  onResetRookies,
  onResetEventCards,
  onResetAll,
}) => {
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

  const triggerReset = (targetID: string, callback: () => void) => {
    if (confirmTarget === targetID) {
      callback();
      setConfirmTarget(null);
    } else {
      setConfirmTarget(targetID);
      // Auto-clear confirmation after 3 seconds
      setTimeout(() => {
        setConfirmTarget((current) => (current === targetID ? null : current));
      }, 3000);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-xs select-none">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-6 bg-red-500 rounded-full"></div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">操作控制台</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Reset Enemies */}
        <button
          onClick={() => triggerReset('enemies', onResetEnemies)}
          className={`flex items-center justify-center gap-1.5 py-3 px-4 rounded-lg font-semibold text-sm border-2 transition-all cursor-pointer ${
            confirmTarget === 'enemies'
              ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          {confirmTarget === 'enemies' ? (
            <>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>確認重置敵人？</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4 text-slate-400 shrink-0" />
              <span>重置四大敵人</span>
            </>
          )}
        </button>

        {/* Reset Rookies */}
        <button
          onClick={() => triggerReset('rookies', onResetRookies)}
          className={`flex items-center justify-center gap-1.5 py-3 px-4 rounded-lg font-semibold text-sm border-2 transition-all cursor-pointer ${
            confirmTarget === 'rookies'
              ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          {confirmTarget === 'rookies' ? (
            <>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>確認重置菜鳥？</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4 text-slate-400 shrink-0" />
              <span>重置菜鳥區域</span>
            </>
          )}
        </button>

        {/* Reset Event Cards */}
        <button
          onClick={() => triggerReset('events', onResetEventCards)}
          className={`flex items-center justify-center gap-1.5 py-3 px-4 rounded-lg font-semibold text-sm border-2 transition-all cursor-pointer ${
            confirmTarget === 'events'
              ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          {confirmTarget === 'events' ? (
            <>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>確認重置事件カード？</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4 text-slate-400 shrink-0" />
              <span>重置事件卡</span>
            </>
          )}
        </button>

        {/* Reset All */}
        <button
          onClick={() => triggerReset('all', onResetAll)}
          className={`col-span-2 flex items-center justify-center gap-1.5 py-3 px-6 rounded-lg font-bold text-sm border-2 transition-all cursor-pointer ${
            confirmTarget === 'all'
              ? 'bg-rose-600 text-white border-rose-700 animate-pulse col-span-2'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300 col-span-2'
          }`}
        >
          {confirmTarget === 'all' ? (
            <>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>確定重置「全部」狀態與設定？</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 text-rose-500 shrink-0" />
              <span>重置全部資料</span>
            </>
          )}
        </button>
      </div>
      {confirmTarget && (
        <p className="mt-2 text-xs text-amber-600 text-center font-medium animate-pulse">
          * 再次點擊以確認重置。 3 秒後自動取消
        </p>
      )}
    </section>
  );
};
