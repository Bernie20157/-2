import React from 'react';
import { Check, ShieldOff, Sword, Eye, Star, Sparkles } from 'lucide-react';
import { EnemyId, AreaId } from '../types';
import { ENEMIES, AREAS, AREA_ORDER } from '../constants';

interface EnemySectionProps {
  enemies: Record<EnemyId, Record<AreaId, boolean>>;
  onToggleArea: (enemyId: EnemyId, areaId: AreaId) => void;
}

const ENEMY_ICONS: Record<EnemyId, React.ReactNode> = {
  warrior: <Sword className="w-5 h-5 text-red-600" />,
  thief: <Eye className="w-5 h-5 text-amber-500" />,
  archer: <Star className="w-5 h-5 text-emerald-500" />,
  mage: <Sparkles className="w-5 h-5 text-purple-500" />,
};

export const EnemySection: React.FC<EnemySectionProps> = ({ enemies, onToggleArea }) => {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-xs select-none">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-6 bg-red-600 rounded-full"></div>
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">一、 四大敵人追蹤</h2>
        <span className="text-xs text-slate-400 font-medium ml-2">每個敵人都會去四個區域各一次</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {ENEMIES.map((enemy) => {
          const currentEnStatus = enemies[enemy.id] || {};
          
          // Calculate remaining zones
          const visitedArr: string[] = [];
          const remainingArr: string[] = [];

          AREA_ORDER.forEach((areaId) => {
            const areaName = AREAS[areaId].name;
            if (currentEnStatus[areaId]) {
              visitedArr.push(areaName);
            } else {
              remainingArr.push(areaName);
            }
          });

          const isFullyFinished = remainingArr.length === 0;

          return (
            <div 
              key={enemy.id} 
              id={`enemy-card-${enemy.id}`}
              className={`border rounded-xl transition-all duration-300 p-4 flex flex-col justify-between ${
                isFullyFinished 
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs' 
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs hover:shadow-sm'
              }`}
            >
              <div>
                {/* Enemy Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-dashed border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isFullyFinished ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                      {ENEMY_ICONS[enemy.id]}
                    </div>
                    <span className="font-bold text-slate-800 text-base">{enemy.name}</span>
                  </div>
                  {isFullyFinished && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                      ✓ 全完成
                    </span>
                  )}
                </div>

                {/* Area Toggle Actions */}
                <div className="space-y-2.5">
                  {AREA_ORDER.map((areaId) => {
                    const area = AREAS[areaId];
                    const isVisited = currentEnStatus[areaId] ?? false;

                    return (
                      <button
                        key={areaId}
                        id={`enemy-${enemy.id}-area-${areaId}-btn`}
                        onClick={() => onToggleArea(enemy.id, areaId)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold border transition-all active:scale-98 cursor-pointer ${
                          isVisited 
                            ? `${area.colorClass}` 
                            : `${area.inactiveColorClass}`
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-3.5 rounded-full bg-current opacity-70"></span>
                          <span>{area.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {isVisited ? (
                            <span className="flex items-center gap-1 text-xs border border-current px-1.5 py-0.5 rounded-sm font-bold">
                              <Check className="w-3 h-3 stroke-[3]" />
                              已去
                            </span>
                          ) : (
                            <span className="text-xs opacity-60 font-medium px-1.5 py-0.5 border border-dashed border-slate-300 rounded-sm">
                              未去
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer Progress Info */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                {isFullyFinished ? (
                  <div className="text-emerald-700 font-bold flex items-center justify-center py-1 bg-emerald-100/50 rounded-md">
                    🎉 已全部完成！
                  </div>
                ) : (
                  <div className="text-slate-500 font-medium leading-relaxed">
                    <span className="text-slate-400">剩餘：</span>
                    <span className="text-slate-700 font-bold">{remainingArr.join('、')}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
