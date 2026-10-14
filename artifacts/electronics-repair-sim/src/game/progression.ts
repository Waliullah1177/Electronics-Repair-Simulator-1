import type { PlayerState } from '@/types';

/**
 * Guided Repair remains locked at the starting level.
 * Keep this as the single source for both the gate and its unlock dialog.
 */
export const GUIDED_REPAIR_UNLOCK_LEVEL = 2;

export function isGuidedRepairUnlocked(
  state: Pick<PlayerState, 'level' | 'guidedRepairUnlocked' | 'guidedRepairCompleted'>,
): boolean {
  return state.guidedRepairUnlocked
    || state.guidedRepairCompleted
    || state.level >= GUIDED_REPAIR_UNLOCK_LEVEL;
}
