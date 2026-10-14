import type { Upgrade } from '@/types';

export const upgrades: Upgrade[] = [
  {
    id: 'multimeter-pro',
    name: 'Pro Multimeter (Auto-ranging)',
    description: 'Upgrades your multimeter to auto-ranging mode with higher precision and capacitance measurement.',
    cost: 200,
    category: 'tools',
    icon: 'Gauge',
    effect: 'Auto-ranging measurements, capacitance mode, 0.01V precision',
  },
  {
    id: 'soldering-station-pro',
    name: 'Professional Soldering Station',
    description: 'Temperature-controlled soldering station with faster heat-up and finer tip.',
    cost: 150,
    category: 'tools',
    icon: 'Flame',
    effect: 'Faster soldering, fewer mistakes, cleaner joints',
  },
  {
    id: 'oscilloscope',
    name: 'Digital Oscilloscope',
    description: 'Adds a 100MHz digital oscilloscope for advanced signal analysis.',
    cost: 400,
    category: 'tools',
    icon: 'Activity',
    effect: 'Unlocks oscilloscope for waveform measurement in advanced missions',
  },
  {
    id: 'workbench-upgrade',
    name: 'Anti-static Workbench',
    description: 'Upgrades your workbench with ESD-safe mat, magnifier lamp, and better lighting.',
    cost: 100,
    category: 'workshop',
    icon: 'Lightbulb',
    effect: 'Better lighting, ESD protection, improved workshop appearance',
  },
  {
    id: 'inventory-expansion',
    name: 'Component Storage Cabinet',
    description: 'A organized component storage cabinet with labeled drawers.',
    cost: 120,
    category: 'inventory',
    icon: 'Archive',
    effect: 'Doubles starting component inventory for all missions',
  },
  {
    id: 'diagnostic-hints',
    name: 'Advanced Diagnostic Software',
    description: 'AI-assisted diagnostic hints that suggest likely faulty components.',
    cost: 300,
    category: 'diagnostics',
    icon: 'BrainCircuit',
    effect: 'Provides detailed hints about fault locations and test strategies',
  },
  {
    id: 'power-supply',
    name: 'Bench Power Supply',
    description: 'A adjustable bench power supply for testing boards under load.',
    cost: 250,
    category: 'tools',
    icon: 'Zap',
    effect: 'Unlocks power supply tool for load testing',
  },
  {
    id: 'repair-bench-2',
    name: 'Second Repair Bench',
    description: 'Adds a second repair bench to work on multiple boards simultaneously.',
    cost: 500,
    category: 'workshop',
    icon: 'Table',
    effect: 'Additional visible repair bench in the workshop',
  },
];

export function getUpgrade(id: string): Upgrade | undefined {
  return upgrades.find((u) => u.id === id);
}
