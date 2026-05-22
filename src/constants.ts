import { EnemyId, AreaId, AreaConfig } from './types';

export const ENEMIES: { id: EnemyId; name: string }[] = [
  { id: 'warrior', name: '戰士' },
  { id: 'thief', name: '盜賊' },
  { id: 'archer', name: '弓箭手' },
  { id: 'mage', name: '法師' },
];

export const AREAS: Record<AreaId, AreaConfig> = {
  red: {
    id: 'red',
    name: '紅區',
    colorClass: 'bg-red-100 text-red-900 border-red-300 shadow-xs ring-red-400/30',
    inactiveColorClass: 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-600',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50/70',
    borderColor: 'border-red-200',
    accentColor: 'red',
  },
  blue: {
    id: 'blue',
    name: '藍區',
    colorClass: 'bg-blue-100 text-blue-900 border-blue-300 shadow-xs ring-blue-400/30',
    inactiveColorClass: 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-600',
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50/70',
    borderColor: 'border-blue-200',
    accentColor: 'blue',
  },
  purple: {
    id: 'purple',
    name: '紫區',
    colorClass: 'bg-purple-100 text-purple-900 border-purple-300 shadow-xs ring-purple-400/30',
    inactiveColorClass: 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-600',
    textColor: 'text-purple-700',
    bgLight: 'bg-purple-50/70',
    borderColor: 'border-purple-200',
    accentColor: 'purple',
  },
  gray: {
    id: 'gray',
    name: '灰區',
    colorClass: 'bg-gray-200 text-gray-900 border-gray-400 shadow-xs ring-gray-400/30',
    inactiveColorClass: 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-600',
    textColor: 'text-gray-700',
    bgLight: 'bg-gray-100/70',
    borderColor: 'border-gray-300',
    accentColor: 'neutral',
  },
};

export const AREA_ORDER: AreaId[] = ['red', 'blue', 'purple', 'gray'];

export const ROOKIE_MIN = 4;
export const ROOKIE_MAX = 12;
export const ROOKIE_DEFAULT = 6;
export const ROOKIE_AREA_MAX = 3;

export const EVENT_CARDS_MIN = 0;
export const EVENT_CARDS_MAX = 6;
export const EVENT_CARDS_DEFAULT = 6;
