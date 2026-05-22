import { useState, useEffect } from 'react';
import { EnemyId, AreaId, AppState } from '../types';
import { ENEMIES, AREAS, AREA_ORDER, ROOKIE_DEFAULT, EVENT_CARDS_DEFAULT } from '../constants';

const LOCAL_STORAGE_KEY = 'board_game_enemy_tracker_state';

const initialEnemiesState: Record<EnemyId, Record<AreaId, boolean>> = {
  warrior: { red: false, blue: false, purple: false, gray: false },
  thief: { red: false, blue: false, purple: false, gray: false },
  archer: { red: false, blue: false, purple: false, gray: false },
  mage: { red: false, blue: false, purple: false, gray: false },
};

const initialRookieState: Record<AreaId, number> = {
  red: 0,
  blue: 0,
  purple: 0,
  gray: 0,
};

export function useAppState() {
  // Load state from local storage or set defaults
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure structure is correct
        if (parsed.enemies && parsed.rookieAllocation) {
          return {
            enemies: { ...initialEnemiesState, ...parsed.enemies },
            rookieCount: typeof parsed.rookieCount === 'number' ? parsed.rookieCount : ROOKIE_DEFAULT,
            rookieAllocation: { ...initialRookieState, ...parsed.rookieAllocation },
            eventCardCount: typeof parsed.eventCardCount === 'number' ? parsed.eventCardCount : EVENT_CARDS_DEFAULT,
            eventCardProcessedCount: typeof parsed.eventCardProcessedCount === 'number' ? parsed.eventCardProcessedCount : 0,
          };
        }
      }
    } catch (e) {
      console.error('Failed to parse state from localStorage, using defaults', e);
    }

    return {
      enemies: initialEnemiesState,
      rookieCount: ROOKIE_DEFAULT,
      rookieAllocation: initialRookieState,
      eventCardCount: EVENT_CARDS_DEFAULT,
      eventCardProcessedCount: 0,
    };
  });

  // Automatically save to local storage when state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Handle Enemy Area Toggling
  const toggleEnemyArea = (enemyId: EnemyId, areaId: AreaId) => {
    setState((prev) => {
      const currentVal = prev.enemies[enemyId]?.[areaId] ?? false;
      return {
        ...prev,
        enemies: {
          ...prev.enemies,
          [enemyId]: {
            ...prev.enemies[enemyId],
            [areaId]: !currentVal,
          },
        },
      };
    });
  };

  // Adjust Rookie Total Count
  const updateRookieCount = (newCount: number) => {
    // Keep raw value inside the bounds of 4 to 12
    const clamped = Math.max(4, Math.min(12, newCount));
    setState((prev) => ({
      ...prev,
      rookieCount: clamped,
    }));
  };

  // Adjust Rookie Area Visits
  const adjustRookieAreaAllocation = (areaId: AreaId, delta: number) => {
    setState((prev) => {
      const current = prev.rookieAllocation[areaId] ?? 0;
      const target = current + delta;
      
      // Prevent going below 0 or above 3
      if (target < 0 || target > 3) {
        return prev;
      }

      // Check rookie allocation limit
      const currentAllocatedTotal = (Object.values(prev.rookieAllocation) as number[]).reduce((a, b) => a + b, 0);
      const newAllocatedTotal = currentAllocatedTotal + delta;

      // Prevent exceeding rookie count (only for adding)
      if (delta > 0 && newAllocatedTotal > prev.rookieCount) {
        return prev;
      }

      return {
        ...prev,
        rookieAllocation: {
          ...prev.rookieAllocation,
          [areaId]: target,
        },
      };
    });
  };

  // Set Event Card Total Count
  const updateEventCardCount = (newCount: number) => {
    const clamped = Math.max(0, Math.min(6, newCount));
    setState((prev) => {
      // Clamp processed count to total count if total decreased
      const updatedProcessed = Math.min(prev.eventCardProcessedCount, clamped);
      return {
        ...prev,
        eventCardCount: clamped,
        eventCardProcessedCount: updatedProcessed,
      };
    });
  };

  // Adjust Event Card Processed Count
  const adjustEventCardProcessed = (delta: number) => {
    setState((prev) => {
      const nextCount = prev.eventCardProcessedCount + delta;
      if (nextCount < 0 || nextCount > prev.eventCardCount) {
        return prev;
      }
      return {
        ...prev,
        eventCardProcessedCount: nextCount,
      };
    });
  };

  // Resets
  const resetEnemies = () => {
    setState((prev) => ({
      ...prev,
      enemies: initialEnemiesState,
    }));
  };

  const resetRookies = () => {
    setState((prev) => ({
      ...prev,
      rookieAllocation: initialRookieState,
    }));
  };

  const resetEventCards = () => {
    setState((prev) => ({
      ...prev,
      eventCardProcessedCount: 0,
    }));
  };

  const resetAll = () => {
    setState({
      enemies: initialEnemiesState,
      rookieCount: ROOKIE_DEFAULT,
      rookieAllocation: initialRookieState,
      eventCardCount: EVENT_CARDS_DEFAULT,
      eventCardProcessedCount: 0,
    });
  };

  // Statistics calculation for Dashboard
  // 1. Four Enemies Completed progress: 16 slots total (4 enemies * 4 areas)
  const getEnemyProgress = () => {
    let visitedCount = 0;
    Object.values(state.enemies).forEach((areas) => {
      Object.values(areas).forEach((visited) => {
        if (visited) visitedCount++;
      });
    });
    return { visited: visitedCount, total: 16 };
  };

  // 2. Rookie Allocation Progress
  const getRookieProgress = () => {
    const allocated = (Object.values(state.rookieAllocation) as number[]).reduce((a, b) => a + b, 0);
    return { allocated, limit: state.rookieCount };
  };

  // 3. Event Cards processed vs total active
  const getEventCardProgress = () => {
    return { processed: state.eventCardProcessedCount, total: state.eventCardCount };
  };

  // Validate if allocated sum exceeds rookie count (happens if rookieCount is adjusted downwards)
  const isRookieAllocationExceeded = () => {
    const allocated = (Object.values(state.rookieAllocation) as number[]).reduce((a, b) => a + b, 0);
    return allocated > state.rookieCount;
  };

  // Formatted Output Text Generation helper
  const generateSummaryText = () => {
    // 1. Four Enemies Section
    const enemyLines = ENEMIES.map((enemy) => {
      const visited: any[] = [];
      const remaining: any[] = [];
      
      AREA_ORDER.forEach((areaId) => {
        const areaName = AREAS[areaId].name;
        if (state.enemies[enemy.id]?.[areaId]) {
          visited.push(areaName);
        } else {
          remaining.push(areaName);
        }
      });

      if (visited.length === 4) {
        return `${enemy.name}：已全部完成`;
      }
      if (visited.length === 0) {
        return `${enemy.name}：尚未行動`;
      }

      return `${enemy.name}：已去${visited.join('、')}；剩餘${remaining.join('、')}`;
    });

    // 2. Rookies Section
    const rookieTotalAllocated = (Object.values(state.rookieAllocation) as number[]).reduce((a, b) => a + b, 0);
    const rookieLines = [
      `菜鳥數量：${state.rookieCount}`,
      `目前已分配：${rookieTotalAllocated} / ${state.rookieCount}`,
      ...AREA_ORDER.map((areaId) => `${AREAS[areaId].name}：${state.rookieAllocation[areaId] ?? 0} / 3`),
    ];

    // 3. Event Cards Section
    const eventLines = [
      `事件卡數量：${state.eventCardCount}`,
      `已處理次數：${state.eventCardProcessedCount} / ${state.eventCardCount}`,
    ];

    return `【四大敵人】
${enemyLines.join('\n')}

【菜鳥】
${rookieLines.join('\n')}

【事件卡】
${eventLines.join('\n')}`;
  };

  return {
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
    getEnemyProgress,
    getRookieProgress,
    getEventCardProgress,
    isRookieAllocationExceeded,
    generateSummaryText,
  };
}
