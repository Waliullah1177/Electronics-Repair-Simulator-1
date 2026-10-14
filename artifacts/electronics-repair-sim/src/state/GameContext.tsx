import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from 'react';
import type { PlayerState, GameSettings, InventoryItem, ComponentType, AcademyProgress } from '@/types';
import { missions } from '@/game/missions';
import { GUIDED_REPAIR_UNLOCK_LEVEL } from '@/game/progression';

const STORAGE_KEY = 'ecr-sim-save';
const STARTING_MONEY = 200;
const STARTING_XP = 0;
const STARTING_LEVEL = 1;

const defaultInventory: InventoryItem[] = [
  { refDes: 'F-2A', type: 'fuse', value: '2A', nominalValue: 2, unit: 'A', quantity: 5 },
  { refDes: 'F-5A', type: 'fuse', value: '5A', nominalValue: 5, unit: 'A', quantity: 3 },
  { refDes: 'C-22uF', type: 'capacitor', value: '22µF', nominalValue: 22, unit: 'µF', quantity: 5 },
  { refDes: 'C-100uF', type: 'capacitor', value: '100µF', nominalValue: 100, unit: 'µF', quantity: 3 },
  { refDes: 'C-1000uF', type: 'capacitor', value: '1000µF', nominalValue: 1000, unit: 'µF', quantity: 2 },
  { refDes: 'R-100', type: 'resistor', value: '100Ω', nominalValue: 100, unit: 'Ω', quantity: 5 },
  { refDes: 'R-1k', type: 'resistor', value: '1kΩ', nominalValue: 1000, unit: 'Ω', quantity: 5 },
  { refDes: 'R-4.7k', type: 'resistor', value: '4.7kΩ', nominalValue: 4700, unit: 'Ω', quantity: 3 },
  { refDes: 'R-10k', type: 'resistor', value: '10kΩ', nominalValue: 10000, unit: 'Ω', quantity: 3 },
  { refDes: 'R-2.2k', type: 'resistor', value: '2.2kΩ', nominalValue: 2200, unit: 'Ω', quantity: 3 },
  { refDes: 'D-1N4007', type: 'diode', value: '1N4007', nominalValue: 0.7, unit: 'V', quantity: 3 },
  { refDes: 'D-1N5819', type: 'diode', value: '1N5819', nominalValue: 0.4, unit: 'V', quantity: 2 },
  { refDes: 'Q-IRF540', type: 'mosfet', value: 'IRF540', nominalValue: 30, unit: 'V', quantity: 2 },
  { refDes: 'Q-IRF3205', type: 'mosfet', value: 'IRF3205', nominalValue: 55, unit: 'V', quantity: 2 },
  { refDes: 'U-LM7812', type: 'regulator', value: 'LM7812', nominalValue: 12, unit: 'V', quantity: 2 },
  { refDes: 'U-LM7805', type: 'regulator', value: 'LM7805', nominalValue: 5, unit: 'V', quantity: 2 },
  { refDes: 'C-470uF', type: 'capacitor', value: '470µF', nominalValue: 470, unit: 'µF', quantity: 3 },
  { refDes: 'C-2200uF', type: 'capacitor', value: '2200µF', nominalValue: 2200, unit: 'µF', quantity: 1 },
];

const defaultSettings: GameSettings = {
  soundEnabled: true,
  volume: 0.5,
  quality: 'medium',
  showSchematic: false,
  language: 'en',
};

const defaultAcademyProgress: AcademyProgress = {
  completedLessons: [],
  lessonScores: {},
  currentLessonId: null,
  currentPageIndex: 0,
};

function createInitialState(): PlayerState {
  return {
    money: STARTING_MONEY,
    xp: STARTING_XP,
    level: STARTING_LEVEL,
    completedMissions: [],
    unlockedMissions: missions.filter((mission) => mission.requiredLevel <= STARTING_LEVEL).map((mission) => mission.id),
    purchasedUpgrades: [],
    inventory: defaultInventory.map((i) => ({ ...i })),
    settings: { ...defaultSettings },
    academy: { ...defaultAcademyProgress },
    guidedRepairCompleted: false,
    guidedRepairUnlocked: false,
  };
}

type Action =
  | { type: 'LOAD'; state: PlayerState }
  | { type: 'RESET' }
  | { type: 'ADD_MONEY'; amount: number }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'COMPLETE_MISSION'; missionId: string; reward: number; xp: number }
  | { type: 'PURCHASE_UPGRADE'; upgradeId: string; cost: number }
  | { type: 'UNLOCK_MISSION'; missionId: string }
  | { type: 'USE_COMPONENT'; refDes: string; componentType: ComponentType; nominalValue: number; value: string; unit: string }
  | { type: 'ADD_COMPONENT'; item: InventoryItem }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'SET_LEVEL'; level: number }
  | { type: 'COMPLETE_LESSON'; lessonId: string; score: number; xp: number }
  | { type: 'SAVE_LESSON_PROGRESS'; lessonId: string; pageIndex: number }
  | { type: 'COMPLETE_GUIDED_REPAIR' }
  | { type: 'UNLOCK_ALL_MISSIONS' };

function xpForLevel(level: number): number {
  return level * 500;
}

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'LOAD':
      return action.state;
    case 'RESET': {
      const initial = createInitialState();
      return {
        ...initial,
        settings: { ...initial.settings, language: state.settings.language },
      };
    }
    case 'ADD_MONEY':
      return { ...state, money: Math.max(0, state.money + action.amount) };
    case 'ADD_XP': {
      const newXp = state.xp + action.amount;
      let newLevel = state.level;
      while (newXp >= xpForLevel(newLevel)) {
        newLevel++;
      }
      // Unlock missions at new level
      const newUnlocked = [...state.unlockedMissions];
      for (const m of missions) {
        if (m.requiredLevel <= newLevel && !newUnlocked.includes(m.id)) {
          newUnlocked.push(m.id);
        }
      }
      return {
        ...state,
        xp: newXp,
        level: newLevel,
        unlockedMissions: newUnlocked,
        guidedRepairUnlocked: state.guidedRepairUnlocked || newLevel >= GUIDED_REPAIR_UNLOCK_LEVEL,
      };
    }
    case 'COMPLETE_MISSION': {
      const completed = state.completedMissions.includes(action.missionId)
        ? state.completedMissions
        : [...state.completedMissions, action.missionId];
      const newXp = state.xp + action.xp;
      let newLevel = state.level;
      while (newXp >= xpForLevel(newLevel)) {
        newLevel++;
      }
      const newUnlocked = [...state.unlockedMissions];
      for (const m of missions) {
        if (m.requiredLevel <= newLevel && !newUnlocked.includes(m.id)) {
          newUnlocked.push(m.id);
        }
      }
      return {
        ...state,
        money: state.money + action.reward,
        xp: newXp,
        level: newLevel,
        completedMissions: completed,
        unlockedMissions: newUnlocked,
        guidedRepairUnlocked: state.guidedRepairUnlocked || newLevel >= GUIDED_REPAIR_UNLOCK_LEVEL,
      };
    }
    case 'PURCHASE_UPGRADE':
      if (state.purchasedUpgrades.includes(action.upgradeId)) return state;
      return {
        ...state,
        money: state.money - action.cost,
        purchasedUpgrades: [...state.purchasedUpgrades, action.upgradeId],
      };
    case 'UNLOCK_MISSION':
      if (state.unlockedMissions.includes(action.missionId)) return state;
      return { ...state, unlockedMissions: [...state.unlockedMissions, action.missionId] };
    case 'USE_COMPONENT': {
      const inv = state.inventory.map((i) => ({ ...i }));
      const idx = inv.findIndex(
        (i) => i.type === action.componentType && i.nominalValue === action.nominalValue,
      );
      if (idx >= 0) {
        inv[idx].quantity = Math.max(0, inv[idx].quantity - 1);
      }
      return { ...state, inventory: inv };
    }
    case 'ADD_COMPONENT': {
      const inv = state.inventory.map((i) => ({ ...i }));
      const idx = inv.findIndex(
        (i) => i.type === action.item.type && i.nominalValue === action.item.nominalValue,
      );
      if (idx >= 0) {
        inv[idx].quantity += action.item.quantity;
      } else {
        inv.push({ ...action.item });
      }
      return { ...state, inventory: inv };
    }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'SET_LEVEL':
      return {
        ...state,
        level: action.level,
        guidedRepairUnlocked: state.guidedRepairUnlocked || action.level >= GUIDED_REPAIR_UNLOCK_LEVEL,
      };
    case 'COMPLETE_LESSON': {
      const completed = state.academy.completedLessons.includes(action.lessonId)
        ? state.academy.completedLessons
        : [...state.academy.completedLessons, action.lessonId];
      const scores = { ...state.academy.lessonScores, [action.lessonId]: action.score };
      const newXp = state.xp + action.xp;
      let newLevel = state.level;
      while (newXp >= xpForLevel(newLevel)) {
        newLevel++;
      }
      const newUnlocked = [...state.unlockedMissions];
      for (const m of missions) {
        if (m.requiredLevel <= newLevel && !newUnlocked.includes(m.id)) {
          newUnlocked.push(m.id);
        }
      }
      return {
        ...state,
        xp: newXp,
        level: newLevel,
        unlockedMissions: newUnlocked,
        guidedRepairUnlocked: state.guidedRepairUnlocked || newLevel >= GUIDED_REPAIR_UNLOCK_LEVEL,
        academy: { ...state.academy, completedLessons: completed, lessonScores: scores, currentLessonId: null, currentPageIndex: 0 },
      };
    }
    case 'SAVE_LESSON_PROGRESS':
      return {
        ...state,
        academy: { ...state.academy, currentLessonId: action.lessonId, currentPageIndex: action.pageIndex },
      };
    case 'COMPLETE_GUIDED_REPAIR':
      return {
        ...state,
        guidedRepairCompleted: true,
        guidedRepairUnlocked: true,
        unlockedMissions: state.unlockedMissions.length > 0 ? state.unlockedMissions : ['mission-1', 'mission-2'],
      };
    case 'UNLOCK_ALL_MISSIONS':
      return {
        ...state,
        unlockedMissions: missions.map((m) => m.id),
      };
    default:
      return state;
  }
}

interface GameContextValue {
  state: PlayerState;
  dispatch: React.Dispatch<Action>;
  hasSave: boolean;
  resetProgress: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as PlayerState;
        // Merge with defaults to handle missing fields
        const mergedBase: PlayerState = {
          ...createInitialState(),
          ...parsed,
          settings: { ...defaultSettings, ...parsed.settings },
          academy: { ...defaultAcademyProgress, ...parsed.academy },
        };
        const previousLessonUnlock = (parsed.academy?.completedLessons?.length ?? 0) >= 8;
        const levelUnlockedMissions = missions
          .filter((mission) => mission.requiredLevel <= mergedBase.level)
          .map((mission) => mission.id);
        const merged: PlayerState = {
          ...mergedBase,
          unlockedMissions: [...new Set([
            ...createInitialState().unlockedMissions,
            ...(parsed.unlockedMissions ?? []),
            ...levelUnlockedMissions,
          ])],
          guidedRepairUnlocked: Boolean(
            parsed.guidedRepairUnlocked
            || parsed.guidedRepairCompleted
            || previousLessonUnlock
            || mergedBase.level >= GUIDED_REPAIR_UNLOCK_LEVEL,
          ),
        };
        dispatch({ type: 'LOAD', state: merged });
        setHasSave(true);
      }
    } catch {
      // Corrupted save — start fresh
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setHasSave(true);
    } catch {
      // Storage full or unavailable
    }
  }, [state]);

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET' });
  };

  return (
    <GameContext.Provider value={{ state, dispatch, hasSave, resetProgress }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export { STORAGE_KEY, xpForLevel };
