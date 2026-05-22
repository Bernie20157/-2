import React from 'react';
import { Plus, Minus, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AreaId } from '../types';
import { AREAS, AREA_ORDER, ROOKIE_MIN, ROOKIE_MAX, ROOKIE_AREA_MAX } from '../constants';

interface RookieSectionProps {
  rookieCount: number;
  rookieAllocation: Record<AreaId, number>;
  onUpdateRookieCount: (newCount: number) => void;
  onAdjustRookieAllocation: (areaId: AreaId, delta: number) => void;
  isRookieExceeded: boolean;
}

export const RookieSection: React.FC<RookieSectionProps> = ({
  rookieCount,
  rookieAllocation,
  onUpdateRookieCount,
  onAdjustRookieAllocation,
  isRookieExceeded,
}) => {
  const totalAllocated = (Object.values(rookieAllocation) as number[]).reduce((a, b) => a + b, 0);
  const isFullyAllocated = totalAllocated === rookieCount;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-xs select-none">
      {/* Header & Settings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">二、 菜鳥區域次數追蹤</h2>
            <p className="text-xs text-slate-400 font-medium">不需逐一追蹤，僅需追蹤四個區域被菜鳥造訪的累積次數</p>
          </div>
        </div>

        {/* Input Settings */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200 w-fit self-end md:self-auto">
          <label htmlFor="rookie-count-input" className="text-sm font-semibold text-slate-600 flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-500" />
            菜鳥數量設定：
          </label>
          <div className="flex items-center gap-1.5 font-mono">
            <button
              onClick={() => onUpdateRookieCount(rookieCount - 1)}
              disabled={rookieCount <= ROOKIE_MIN}
              className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              title="減少菜鳥數量"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              id="rookie-count-input"
              type="number"
              min={ROOKIE_MIN}
              max={ROOKIE_MAX}
              value={rookieCount}
              onChange={(e) => onUpdateRookieCount(parseInt(e.target.value) || ROOKIE_MIN)}
              className="w-12 text-center font-bold text-slate-800 bg-white border border-slate-300 rounded-md py-1 text-sm focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => onUpdateRookieCount(rookieCount + 1)}
              disabled={rookieCount >= ROOKIE_MAX}
              className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
              title="增加菜鳥數量"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs text-slate-400 font-medium font-mono">({ROOKIE_MIN}-{ROOKIE_MAX}隻)</span>
        </div>
      </div>

      {/* Exceeded/Warning Alert States */}
      {isRookieExceeded && (
        <div className="mb-5 bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-start gap-2.5 text-amber-800">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">
            <p className="font-bold">目前分配次數已超過菜鳥數量，請先減少區域次數。</p>
            <p className="text-xs text-amber-700/90 mt-0.5">目前已紀錄次數已由系統保留，請手動扣減多餘的區域造訪紀錄。</p>
          </div>
        </div>
      )}

      {/* Allocation Summary Bar */}
      <div className={`mb-5 p-3.5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-2 border ${
        isRookieExceeded 
          ? 'bg-amber-100/30 border-amber-200' 
          : isFullyAllocated 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-blue-50/40 border-blue-100'
      }`}>
        <div className="flex items-center gap-2">
          {isFullyAllocated && !isRookieExceeded ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Users className="w-4 h-4 text-blue-600 shrink-0" />
          )}
          <span className="text-sm font-bold text-slate-700">
            分配進度：菜鳥數量 <span className="font-mono text-blue-600">{rookieCount}</span> 隻 ｜ 目前已分配次數 <span className="font-mono text-emerald-700">{totalAllocated}</span> 次
          </span>
        </div>
        
        <div className="text-xs font-bold shrink-0">
          {isRookieExceeded ? (
            <span className="text-amber-700">請按「－」扣減剩餘次數</span>
          ) : isFullyAllocated ? (
            <span className="text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-bold">✓ 菜鳥已全部分配</span>
          ) : (
            <span className="text-slate-500">尚可分配 {rookieCount - totalAllocated} 次</span>
          )}
        </div>
      </div>

      {/* The Area Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {AREA_ORDER.map((areaId) => {
          const area = AREAS[areaId];
          const count = rookieAllocation[areaId] ?? 0;
          const isMax = count >= ROOKIE_AREA_MAX;
          const isMin = count <= 0;

          // Disable plus if:
          // 1. This area is already full (3/3)
          // 2. Or the maximum total rookies limit is reached (cannot allocate more)
          // 3. Or it is currently already exceeded (Y > X)
          const isPlusDisabled = isMax || totalAllocated >= rookieCount || isRookieExceeded;
          const isMinusDisabled = isMin;

          return (
            <div 
              key={areaId} 
              id={`rookie-area-card-${areaId}`}
              className={`border rounded-xl p-4 flex flex-col justify-between transition-all ${
                isMax 
                  ? 'border-red-300 bg-red-50/10 shadow-xs' 
                  : count > 0 
                  ? 'border-indigo-100 bg-indigo-50/5' 
                  : 'border-slate-200 bg-white'
              }`}
            >
              {/* Card Title Header with Pale Color Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs px-2.5 py-1 rounded-sm font-bold border ${area.colorClass}`}>
                  {area.name}
                </span>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-sm ${
                  isMax ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isMax ? '已滿 (3/3)' : `${count} / 3`}
                </span>
              </div>

              {/* Adjust Action Grid */}
              <div className="flex items-center justify-between gap-2.5">
                {/* Decrement Button */}
                <button
                  id={`rookie-decrement-${areaId}`}
                  onClick={() => onAdjustRookieAllocation(areaId, -1)}
                  disabled={isMinusDisabled}
                  className="flex-1 py-2 rounded-lg border-2 border-slate-200 text-slate-700 bg-white active:bg-slate-50 flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 hover:border-slate-300 font-bold cursor-pointer"
                >
                  <Minus className="w-4 h-4 text-slate-500" />
                </button>

                {/* Progress Visual Indicators (Dots) */}
                <div className="flex items-center gap-1 px-1 select-none">
                  {[1, 2, 3].map((dotIndex) => (
                    <div 
                      key={dotIndex}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        dotIndex <= count 
                          ? isMax 
                            ? 'bg-red-500 ring-2 ring-red-100' 
                            : 'bg-indigo-600 ring-2 ring-indigo-100' 
                          : 'bg-slate-200'
                      }`}
                    ></div>
                  ))}
                </div>

                {/* Increment Button */}
                <button
                  id={`rookie-increment-${areaId}`}
                  onClick={() => onAdjustRookieAllocation(areaId, 1)}
                  disabled={isPlusDisabled}
                  className="flex-1 py-2 rounded-lg border-2 border-slate-200 text-slate-700 bg-white active:bg-slate-50 flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 hover:border-slate-300 font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Action/Helper status text */}
              <div className="mt-3.5 pt-2 border-t border-slate-100/80 text-center text-xs">
                {isMax ? (
                  <span className="text-red-600 font-bold">⚠️ 這區域已經客滿！</span>
                ) : count > 0 ? (
                  <span className="text-slate-500 font-semibold">已造訪 {count} 次</span>
                ) : (
                  <span className="text-slate-400">尚未有任何造訪</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
