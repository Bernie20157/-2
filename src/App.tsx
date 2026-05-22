import { useAppState } from './hooks/useAppState';
import { ResetSection } from './components/ResetSection';
import { EnemySection } from './components/EnemySection';
import { RookieSection } from './components/RookieSection';
import { EventSection } from './components/EventSection';
import { ExportSection } from './components/ExportSection';
import { Swords, Info } from 'lucide-react';

export default function App() {
  const {
    state,
    toggleEnemyArea,
    updateRookieCount,
    adjustRookieAreaAllocation,
    updateEventCardCount,
    adjustEventCardProcessed,
    resetEnemies,
    resetRookies,
    resetEventCards,
    resetAll,
    isRookieAllocationExceeded,
    generateSummaryText,
  } = useAppState();

  const rookieExceeded = isRookieAllocationExceeded();
  const summaryText = generateSummaryText();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* Decorative Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-blue-500 to-purple-500"></div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header Title Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-xs select-none">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 rounded-lg text-white shadow-md animate-pulse">
              <Swords className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                敵人行動追蹤器
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                桌遊戰局輔助工具：四大敵人、菜鳥次數與事件卡隨手寫
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50/50 border border-indigo-100 py-2 px-3.5 rounded-lg text-indigo-800 text-xs font-semibold">
            <Info className="w-4 h-4 shrink-0 text-indigo-500" />
            <span>自動儲存中 ｜ 支援離線與隨開即用</span>
          </div>
        </header>

        {/* 2. Control Desk */}
        <ResetSection
          onResetEnemies={resetEnemies}
          onResetRookies={resetRookies}
          onResetEventCards={resetEventCards}
          onResetAll={resetAll}
        />

        {/* 3. Enemies Section Tracking */}
        <EnemySection 
          enemies={state.enemies} 
          onToggleArea={toggleEnemyArea} 
        />

        {/* 4. Rookie Section Tracking */}
        <RookieSection
          rookieCount={state.rookieCount}
          rookieAllocation={state.rookieAllocation}
          onUpdateRookieCount={updateRookieCount}
          onAdjustRookieAllocation={adjustRookieAreaAllocation}
          isRookieExceeded={rookieExceeded}
        />

        {/* 5. Event Cards Tracking */}
        <EventSection
          eventCardCount={state.eventCardCount}
          eventCardProcessedCount={state.eventCardProcessedCount}
          onUpdateEventCardCount={updateEventCardCount}
          onAdjustEventCardProcessed={adjustEventCardProcessed}
        />

        {/* 6. Text Area Export Section */}
        <ExportSection summaryText={summaryText} />
      </div>

      {/* Small credit footers */}
      <footer className="mt-16 text-center text-xs text-slate-400 select-none border-t border-slate-200/50 pt-6">
        <p>敵人行動追蹤器 (桌遊助手) © {new Date().getFullYear()}</p>
        <p className="mt-0.5 opacity-80">無任何外部傳輸，安全維護隱私資料</p>
      </footer>
    </main>
  );
}
