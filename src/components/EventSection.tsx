import React from 'react';
import { Layers, Plus, Minus, CheckCircle, ClipboardList } from 'lucide-react';
import { EVENT_CARDS_MIN, EVENT_CARDS_MAX } from '../constants';

interface EventSectionProps {
  eventCardCount: number;
  eventCardProcessedCount: number;
  onUpdateEventCardCount: (newCount: number) => void;
  onAdjustEventCardProcessed: (delta: number) => void;
}

export const EventSection: React.FC<EventSectionProps> = ({
  eventCardCount,
  eventCardProcessedCount,
  onUpdateEventCardCount,
  onAdjustEventCardProcessed,
}) => {
  const isAllProcessed = eventCardCount > 0 && eventCardProcessedCount === eventCardCount;
  const isPlusDisabled = eventCardProcessedCount >= eventCardCount;
  const isMinusDisabled = eventCardProcessedCount <= 0;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-xs select-none">
      {/* Header & Configuration */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-purple-600 rounded-full"></div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">三、 事件卡處理追蹤</h2>
            <p className="text-xs text-slate-400 font-medium">追蹤事件卡目前已處理與抽取的累積次數</p>
          </div>
        </div>

        {/* Input Settings for Total Number of Event Cards */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200 w-fit self-end md:self-auto">
          <label htmlFor="event-count-input" className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-purple-500" />
            事件卡總數設定：
          </label>
          <div className="flex items-center gap-1.5 font-mono">
            <button
              onClick={() => onUpdateEventCardCount(eventCardCount - 1)}
              disabled={eventCardCount <= EVENT_CARDS_MIN}
              className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              title="減少事件卡"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              id="event-count-input"
              type="number"
              min={EVENT_CARDS_MIN}
              max={EVENT_CARDS_MAX}
              value={eventCardCount}
              onChange={(e) => onUpdateEventCardCount(parseInt(e.target.value) ?? EVENT_CARDS_MIN)}
              className="w-12 text-center font-bold text-slate-800 bg-white border border-slate-300 rounded-md py-1 text-sm focus:outline-hidden focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={() => onUpdateEventCardCount(eventCardCount + 1)}
              disabled={eventCardCount >= EVENT_CARDS_MAX}
              className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              title="增加事件卡"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs text-slate-400 font-medium font-mono">({EVENT_CARDS_MIN}-{EVENT_CARDS_MAX}張)</span>
        </div>
      </div>

      {/* Main Counter Display */}
      {eventCardCount === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-400">事件卡總數設定為 0張</p>
          <p className="text-xs text-slate-400 mt-1">請在右上方增加事件卡總設定數以進行流程追蹤。</p>
        </div>
      ) : (
        <div className="max-w-xl mx-auto border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50 hover:bg-slate-50/80 transition-all duration-300">
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-sm font-bold text-slate-600">已處理 / 已抽取事件卡</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-base font-extrabold font-mono px-3 py-1 rounded-md ${
                isAllProcessed ? 'bg-emerald-150 text-emerald-800 border border-emerald-300' : 'bg-slate-200/80 text-slate-800'
              }`}>
                {eventCardProcessedCount} / {eventCardCount} 次
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 mb-5">
            {/* Decrement Event */}
            <button
              id="event-processed-decrement"
              onClick={() => onAdjustEventCardProcessed(-1)}
              disabled={isMinusDisabled}
              className="flex-1 py-3.5 rounded-xl border-2 border-slate-250 text-slate-700 bg-white hover:bg-slate-50 active:scale-98 transition-all disabled:opacity-35 disabled:pointer-events-none hover:border-slate-300 font-bold cursor-pointer flex items-center justify-center gap-1"
            >
              <Minus className="w-4 h-4 shrink-0" />
              <span>減少</span>
            </button>

            {/* Dots Counter */}
            <div className="flex items-center justify-center gap-1.5 px-4">
              {Array.from({ length: eventCardCount }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-350 ${
                    idx < eventCardProcessedCount
                      ? 'bg-purple-600 border-purple-700 ring-4 ring-purple-100'
                      : 'bg-white border-slate-350'
                  }`}
                  title={`第 ${idx + 1} 次事件`}
                ></div>
              ))}
            </div>

            {/* Increment Event */}
            <button
              id="event-processed-increment"
              onClick={() => onAdjustEventCardProcessed(1)}
              disabled={isPlusDisabled}
              className="flex-1 py-3.5 rounded-xl border-2 border-slate-250 text-slate-700 bg-white hover:bg-slate-50 active:scale-98 transition-all disabled:opacity-35 disabled:pointer-events-none hover:border-slate-300 font-bold cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>增加</span>
            </button>
          </div>

          {/* Prompt labels */}
          <div className="pt-3 border-t border-slate-200/60 text-center">
            {isAllProcessed ? (
              <div className="text-emerald-700 font-bold flex items-center justify-center gap-1.5 text-sm bg-emerald-100/60 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>事件卡已全部處理完畢！</span>
              </div>
            ) : (
              <span className="text-xs text-slate-500 font-semibold bg-slate-100 border border-slate-200/50 py-1 px-3 rounded-full">
                {eventCardProcessedCount === 0 ? '尚未處理任何事件' : `目前已處理 ${eventCardProcessedCount} 次，剩餘 ${eventCardCount - eventCardProcessedCount} 次`}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
