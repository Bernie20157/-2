/**
 * Type declarations for the Enemy Action Tracker application.
 */

export type EnemyId = 'warrior' | 'thief' | 'archer' | 'mage';
export type AreaId = 'red' | 'blue' | 'purple' | 'gray';
export type EventCardStatus = 'unpicked' | 'picked' | 'processed';

export interface Enemy {
  id: EnemyId;
  name: string;
  visitedAreas: Record<AreaId, boolean>;
}

export interface AreaConfig {
  id: AreaId;
  name: string;
  colorClass: string;       // Style for active state
  inactiveColorClass: string; // Style for inactive state
  textColor: string;
  bgLight: string;
  borderColor: string;
  accentColor: string;
}

export interface AppState {
  enemies: Record<EnemyId, Record<AreaId, boolean>>;
  rookieCount: number;
  rookieAllocation: Record<AreaId, number>;
  eventCardCount: number;
  eventCardProcessedCount: number; // Simplified tracking count of processed/drawn events
}
