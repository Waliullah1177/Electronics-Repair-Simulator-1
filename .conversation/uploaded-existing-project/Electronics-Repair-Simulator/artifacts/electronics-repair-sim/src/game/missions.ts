import type { Mission } from '@/types';

export const missions: Mission[] = [
  {
    id: 'mission-1',
    title: 'Blown Fuse Replacement',
    customer: 'John\'s Electronics Shop',
    description: 'A customer brought in a 12V power supply that has no output. The fuse appears to be blown. Diagnose and replace it.',
    difficulty: 'easy',
    circuitId: 'psu-basic',
    targetComponents: ['F1'],
    reward: 50,
    xp: 100,
    maxHints: 3,
    timeLimit: 0,
    minAccuracy: 60,
    requiredLevel: 1,
    objectives: [
      'Inspect the PCB and identify the faulty component',
      'Use the multimeter to measure voltage across the fuse',
      'Remove the faulty fuse',
      'Install a replacement 2A fuse',
      'Run the post-repair test to verify fix',
    ],
  },
  {
    id: 'mission-2',
    title: 'Shorted Coupling Capacitor',
    customer: 'AudioTech Repair',
    description: 'An audio amplifier board is distorting the signal badly. A coupling capacitor is suspected to be shorted. Diagnose and fix it.',
    difficulty: 'easy',
    circuitId: 'amp-circuit',
    targetComponents: ['C1'],
    reward: 75,
    xp: 150,
    maxHints: 3,
    timeLimit: 0,
    minAccuracy: 60,
    requiredLevel: 1,
    objectives: [
      'Inspect the amplifier PCB',
      'Measure resistance across coupling capacitor C1',
      'Identify the shorted capacitor',
      'Replace C1 with a 22µF capacitor',
      'Verify the repair with a post-repair test',
    ],
  },
  {
    id: 'mission-3',
    title: 'Shorted MOSFET in DC-DC Converter',
    customer: 'PowerSystems Inc.',
    description: 'A 24V to 5V DC-DC converter is outputting full input voltage instead of 5V. A shorted MOSFET is likely the cause.',
    difficulty: 'medium',
    circuitId: 'dcdc-converter',
    targetComponents: ['Q1'],
    reward: 120,
    xp: 250,
    maxHints: 2,
    timeLimit: 300,
    minAccuracy: 70,
    requiredLevel: 2,
    objectives: [
      'Inspect the DC-DC converter PCB',
      'Measure voltage at the switch node (TP2)',
      'Diagnose the shorted MOSFET Q1',
      'Replace Q1 with a compatible IRF540 MOSFET',
      'Verify output voltage is 5V after repair',
    ],
  },
  {
    id: 'mission-4',
    title: 'Multiple Faults in Inverter Board',
    customer: 'Industrial Motors Ltd.',
    description: 'An inverter control board has multiple failures. The current sense resistor is open and the high-side MOSFET is shorted. Find and fix both faults.',
    difficulty: 'advanced',
    circuitId: 'inverter-control',
    targetComponents: ['R1', 'Q1'],
    reward: 250,
    xp: 500,
    maxHints: 2,
    timeLimit: 600,
    minAccuracy: 75,
    requiredLevel: 3,
    objectives: [
      'Inspect the inverter control board',
      'Diagnose the open current sense resistor R1',
      'Diagnose the shorted high-side MOSFET Q1',
      'Replace R1 with a 100Ω 1W resistor',
      'Replace Q1 with a compatible IRF3205 MOSFET',
      'Run post-repair verification test',
    ],
  },
];

export function getMission(id: string): Mission | undefined {
  return missions.find((m) => m.id === id);
}

export function getMissionsByLevel(level: number): Mission[] {
  return missions.filter((m) => m.requiredLevel <= level);
}
