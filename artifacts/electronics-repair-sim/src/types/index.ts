export type ComponentType =
  | 'resistor'
  | 'capacitor'
  | 'diode'
  | 'fuse'
  | 'mosfet'
  | 'regulator'
  | 'ic'
  | 'connector'
  | 'testpoint'
  | 'inductor'
  | 'led';

export type FaultType =
  | 'open'
  | 'short'
  | 'value_drift'
  | 'none';

export type MultimeterMode =
  | 'dc_voltage'
  | 'resistance'
  | 'continuity'
  | 'diode_test';

export type ToolType =
  | 'multimeter'
  | 'soldering_iron'
  | 'desoldering_pump'
  | 'oscilloscope'
  | 'power_supply';

export interface CircuitComponent {
  id: string;
  refDes: string;
  type: ComponentType;
  value: string;
  nominalValue: number;
  unit: string;
  /** Position on PCB in percentages (0-100) */
  x: number;
  y: number;
  /** Rotation in degrees */
  rotation: number;
  /** Size scale factor */
  scale: number;
  /** Whether this component is faulty */
  fault: FaultType;
  /** The actual (possibly faulty) electrical value */
  actualValue: number;
  /** Test points associated with this component */
  testPoints: TestPoint[];
  /** Description shown in info panel */
  description: string;
  /** Whether component is currently removed from board */
  removed: boolean;
  /** Whether a replacement has been installed */
  replaced: boolean;
  /** Package/footprint type */
  package: string;
}

export interface TestPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  /** Net name this test point connects to */
  net: string;
}

export interface CircuitNet {
  name: string;
  /** Components connected to this net */
  components: string[];
  /** Nominal voltage on this net (for voltage calculations) */
  nominalVoltage: number;
}

export interface CircuitDefinition {
  id: string;
  name: string;
  description: string;
  /** Board dimensions in SVG units */
  width: number;
  height: number;
  components: CircuitComponent[];
  nets: CircuitNet[];
  /** Test points that can be probed */
  testPoints: TestPoint[];
  /** Input voltage for the circuit */
  inputVoltage: number;
  /** Expected output voltage */
  outputVoltage: number;
  /** Schematic nodes for optional schematic view */
  schematicNodes?: SchematicNode[];
  schematicWires?: SchematicWire[];
}

export interface SchematicNode {
  id: string;
  refDes: string;
  x: number;
  y: number;
  type: ComponentType;
}

export interface SchematicWire {
  from: string;
  to: string;
  fromPort: string;
  toPort: string;
}

export interface Mission {
  id: string;
  title: string;
  customer: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  circuitId: string;
  /** IDs of components that must be correctly replaced */
  targetComponents: string[];
  /** Reward money on completion */
  reward: number;
  /** XP reward */
  xp: number;
  /** Hints available */
  maxHints: number;
  /** Time limit in seconds (0 = no limit) */
  timeLimit: number;
  /** Minimum accuracy to pass (0-100) */
  minAccuracy: number;
  /** Required player level to unlock */
  requiredLevel: number;
  /** Objectives shown to player */
  objectives: string[];
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'tools' | 'workshop' | 'inventory' | 'diagnostics';
  icon: string;
  /** Effect description */
  effect: string;
}

export interface InventoryItem {
  refDes: string;
  type: ComponentType;
  value: string;
  nominalValue: number;
  unit: string;
  quantity: number;
}

export interface PlayerState {
  money: number;
  xp: number;
  level: number;
  completedMissions: string[];
  unlockedMissions: string[];
  purchasedUpgrades: string[];
  inventory: InventoryItem[];
  settings: GameSettings;
  academy: AcademyProgress;
  guidedRepairCompleted: boolean;
  guidedRepairUnlocked: boolean;
}

export type Language = 'en' | 'ur';

export interface GameSettings {
  soundEnabled: boolean;
  volume: number;
  quality: 'low' | 'medium' | 'high';
  showSchematic: boolean;
  language: Language;
}

export interface RepairReport {
  missionId: string;
  success: boolean;
  accuracy: number;
  hintsUsed: number;
  timeTaken: number;
  componentsReplaced: string[];
  incorrectAttempts: number;
  reward: number;
  xp: number;
}

export type GameScreen =
  | 'menu'
  | 'workshop'
  | 'pcb'
  | 'missions'
  | 'shop'
  | 'inventory'
  | 'settings'
  | 'report'
  | 'academy'
  | 'lesson'
  | 'componentLibrary'
  | 'guidedRepair'
  | 'progress';

export type ProbeColor = 'red' | 'black';

// Academy types
export interface LessonPage {
  type: 'theory' | 'interactive' | 'quiz';
  title: string;
  content: string;
  urduHint?: string;
  interaction?: LessonInteraction;
  quiz?: QuizQuestion[];
}

export interface LessonInteraction {
  kind: 'ohms_law' | 'series_parallel' | 'component_match' | 'multimeter_mode' | 'circuit_path' | 'fault_identify';
  data: Record<string, unknown>;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  module: 'basics' | 'components' | 'tools' | 'repair';
  order: number;
  pages: LessonPage[];
  xpReward: number;
  requiresLessonId?: string;
}

export interface ComponentInfo {
  type: ComponentType;
  name: string;
  symbol: string;
  function: string;
  howItWorks: string;
  failureSymptoms: string;
  testingMethod: string;
  applications: string;
  commonMistakes: string;
  exampleValue: string;
  urduHint?: string;
}

export interface AcademyProgress {
  completedLessons: string[];
  lessonScores: Record<string, number>;
  currentLessonId: string | null;
  currentPageIndex: number;
}
