import type { CircuitDefinition, CircuitComponent, TestPoint, FaultType, ComponentType } from '@/types';

function makeComponent(
  id: string,
  refDes: string,
  type: ComponentType,
  value: string,
  nominalValue: number,
  unit: string,
  x: number,
  y: number,
  rotation: number,
  scale: number,
  fault: FaultType,
  description: string,
  pkg: string,
  testPointLabels: [string, string],
): CircuitComponent {
  const actualValue = fault === 'open' ? Infinity : fault === 'short' ? 0 : nominalValue;
  const tp1: TestPoint = { id: `${id}-tp1`, label: testPointLabels[0], x: x - 4, y: y - 4, net: `${id}-a` };
  const tp2: TestPoint = { id: `${id}-tp2`, label: testPointLabels[1], x: x + 4, y: y + 4, net: `${id}-b` };
  return {
    id, refDes, type, value, nominalValue, unit, x, y, rotation, scale,
    fault, actualValue, testPoints: [tp1, tp2], description,
    removed: false, replaced: false, package: pkg,
  };
}

// Circuit 1: Basic Power Supply with Fuse
const circuit1: CircuitDefinition = {
  id: 'psu-basic',
  name: '12V Linear Power Supply',
  description: 'A basic linear power supply with fuse, bridge rectifier, filter capacitor, and 12V regulator.',
  width: 800,
  height: 500,
  inputVoltage: 24,
  outputVoltage: 12,
  components: [
    makeComponent('F1', 'F1', 'fuse', '2A', 2, 'A', 15, 50, 0, 1, 'open',
      '2A fast-blow fuse protecting the input stage.', 'fuse-5x20',
      ['TP1', 'TP2']),
    makeComponent('D1', 'D1', 'diode', '1N4007', 0.7, 'V', 35, 50, 0, 1, 'none',
      'Rectifier diode converting AC to DC.', 'DO-41',
      ['TP3', 'TP4']),
    makeComponent('C1', 'C1', 'capacitor', '1000µF', 1000, 'µF', 55, 50, 0, 1, 'none',
      'Filter capacitor smoothing the rectified DC.', 'radial-8mm',
      ['TP5', 'TP6']),
    makeComponent('U1', 'U1', 'regulator', 'LM7812', 12, 'V', 75, 50, 0, 1, 'none',
      '12V linear voltage regulator.', 'TO-220',
      ['TP7', 'TP8']),
    makeComponent('C2', 'C2', 'capacitor', '10µF', 10, 'µF', 90, 50, 0, 1, 'none',
      'Output filter capacitor for stability.', 'radial-5mm',
      ['TP9', 'TP10']),
    makeComponent('J1', 'J1', 'connector', 'DC Jack', 12, 'V', 95, 80, 0, 0.8, 'none',
      'Output DC power jack.', 'DC-2.1mm',
      ['TP11', 'TP12']),
  ],
  nets: [
    { name: 'VIN', components: ['F1', 'D1'], nominalVoltage: 24 },
    { name: 'VRECT', components: ['D1', 'C1', 'U1'], nominalVoltage: 23.3 },
    { name: 'VOUT', components: ['U1', 'C2', 'J1'], nominalVoltage: 12 },
    { name: 'GND', components: ['C1', 'C2', 'J1'], nominalVoltage: 0 },
  ],
  testPoints: [
    { id: 'TP1', label: 'TP1', x: 10, y: 50, net: 'VIN' },
    { id: 'TP2', label: 'TP2', x: 20, y: 50, net: 'GND' },
    { id: 'TP3', label: 'TP3', x: 30, y: 50, net: 'VRECT' },
    { id: 'TP4', label: 'TP4', x: 40, y: 50, net: 'GND' },
    { id: 'TP5', label: 'TP5', x: 50, y: 50, net: 'VRECT' },
    { id: 'TP6', label: 'TP6', x: 60, y: 50, net: 'GND' },
    { id: 'TP7', label: 'TP7', x: 70, y: 50, net: 'VOUT' },
    { id: 'TP8', label: 'TP8', x: 80, y: 50, net: 'GND' },
    { id: 'TP9', label: 'TP9', x: 88, y: 50, net: 'VOUT' },
    { id: 'TP10', label: 'TP10', x: 95, y: 50, net: 'GND' },
  ],
};

// Circuit 2: Filter Capacitor Fault
const circuit2: CircuitDefinition = {
  id: 'amp-circuit',
  name: 'Audio Amplifier Board',
  description: 'An audio amplifier with coupling capacitors, bias resistors, and an op-amp IC.',
  width: 800,
  height: 500,
  inputVoltage: 15,
  outputVoltage: 7.5,
  components: [
    makeComponent('R1', 'R1', 'resistor', '10kΩ', 10000, 'Ω', 15, 40, 0, 1, 'none',
      'Input bias resistor.', 'axial-0.25W',
      ['TP1', 'TP2']),
    makeComponent('C1', 'C1', 'capacitor', '22µF', 22, 'µF', 35, 40, 0, 1, 'short',
      'Input coupling capacitor — currently shorted.', 'radial-5mm',
      ['TP3', 'TP4']),
    makeComponent('R2', 'R2', 'resistor', '4.7kΩ', 4700, 'Ω', 50, 40, 0, 1, 'none',
      'Feedback resistor setting gain.', 'axial-0.25W',
      ['TP5', 'TP6']),
    makeComponent('U1', 'U1', 'ic', 'LM358', 8, 'V', 65, 40, 0, 1.2, 'none',
      'Dual op-amp IC for amplification.', 'DIP-8',
      ['TP7', 'TP8']),
    makeComponent('C2', 'C2', 'capacitor', '100µF', 100, 'µF', 80, 40, 0, 1, 'none',
      'Output coupling capacitor.', 'radial-6mm',
      ['TP9', 'TP10']),
    makeComponent('R3', 'R3', 'resistor', '1kΩ', 1000, 'Ω', 90, 60, 0, 1, 'none',
      'Output load resistor.', 'axial-0.25W',
      ['TP11', 'TP12']),
  ],
  nets: [
    { name: 'VIN', components: ['R1', 'C1'], nominalVoltage: 15 },
    { name: 'BIAS', components: ['C1', 'R2', 'U1'], nominalVoltage: 7.5 },
    { name: 'VOUT', components: ['U1', 'C2', 'R3'], nominalVoltage: 7.5 },
    { name: 'GND', components: ['R1', 'R2', 'R3'], nominalVoltage: 0 },
  ],
  testPoints: [
    { id: 'TP1', label: 'TP1', x: 10, y: 40, net: 'VIN' },
    { id: 'TP2', label: 'TP2', x: 20, y: 40, net: 'GND' },
    { id: 'TP3', label: 'TP3', x: 30, y: 40, net: 'VIN' },
    { id: 'TP4', label: 'TP4', x: 40, y: 40, net: 'BIAS' },
    { id: 'TP5', label: 'TP5', x: 45, y: 40, net: 'BIAS' },
    { id: 'TP6', label: 'TP6', x: 55, y: 40, net: 'GND' },
    { id: 'TP7', label: 'TP7', x: 60, y: 40, net: 'VOUT' },
    { id: 'TP8', label: 'TP8', x: 70, y: 40, net: 'GND' },
    { id: 'TP9', label: 'TP9', x: 78, y: 40, net: 'VOUT' },
    { id: 'TP10', label: 'TP10', x: 85, y: 40, net: 'GND' },
  ],
};

// Circuit 3: DC-DC Converter with Shorted MOSFET
const circuit3: CircuitDefinition = {
  id: 'dcdc-converter',
  name: '24V to 5V DC-DC Converter',
  description: 'A buck converter using a MOSFET, inductor, and control IC for step-down conversion.',
  width: 800,
  height: 500,
  inputVoltage: 24,
  outputVoltage: 5,
  components: [
    makeComponent('Q1', 'Q1', 'mosfet', 'IRF540', 30, 'V', 25, 40, 0, 1.2, 'short',
      'N-channel MOSFET switching element — currently shorted.', 'TO-220',
      ['TP1', 'TP2']),
    makeComponent('L1', 'L1', 'inductor', '100µH', 100, 'µH', 45, 40, 0, 1, 'none',
      'Power inductor for energy storage.', 'toroid',
      ['TP3', 'TP4']),
    makeComponent('D1', 'D1', 'diode', '1N5819', 0.4, 'V', 45, 65, 0, 1, 'none',
      'Schottky freewheel diode.', 'DO-41',
      ['TP5', 'TP6']),
    makeComponent('C1', 'C1', 'capacitor', '470µF', 470, 'µF', 60, 40, 0, 1, 'none',
      'Output filter capacitor.', 'radial-10mm',
      ['TP7', 'TP8']),
    makeComponent('U1', 'U1', 'ic', 'TL494', 5, 'V', 75, 40, 0, 1.2, 'none',
      'PWM control IC.', 'DIP-16',
      ['TP9', 'TP10']),
    makeComponent('R1', 'R1', 'resistor', '2.2kΩ', 2200, 'Ω', 75, 65, 0, 1, 'none',
      'Feedback voltage divider resistor.', 'axial-0.25W',
      ['TP11', 'TP12']),
    makeComponent('C2', 'C2', 'capacitor', '1µF', 1, 'µF', 85, 50, 0, 0.8, 'none',
      'Frequency compensation capacitor.', 'radial-3mm',
      ['TP13', 'TP14']),
  ],
  nets: [
    { name: 'VIN', components: ['Q1'], nominalVoltage: 24 },
    { name: 'SW', components: ['Q1', 'L1', 'D1'], nominalVoltage: 12 },
    { name: 'VOUT', components: ['L1', 'C1', 'R1'], nominalVoltage: 5 },
    { name: 'GND', components: ['D1', 'C1', 'R1', 'C2'], nominalVoltage: 0 },
    { name: 'CTRL', components: ['U1', 'Q1', 'R1', 'C2'], nominalVoltage: 5 },
  ],
  testPoints: [
    { id: 'TP1', label: 'TP1', x: 20, y: 40, net: 'VIN' },
    { id: 'TP2', label: 'TP2', x: 30, y: 40, net: 'SW' },
    { id: 'TP3', label: 'TP3', x: 40, y: 40, net: 'SW' },
    { id: 'TP4', label: 'TP4', x: 50, y: 40, net: 'VOUT' },
    { id: 'TP5', label: 'TP5', x: 40, y: 65, net: 'GND' },
    { id: 'TP6', label: 'TP6', x: 55, y: 40, net: 'VOUT' },
    { id: 'TP7', label: 'TP7', x: 60, y: 65, net: 'GND' },
    { id: 'TP8', label: 'TP8', x: 70, y: 40, net: 'CTRL' },
    { id: 'TP9', label: 'TP9', x: 80, y: 40, net: 'CTRL' },
    { id: 'TP10', label: 'TP10', x: 85, y: 65, net: 'GND' },
  ],
};

// Circuit 4: Inverter Control Board with Multiple Faults
const circuit4: CircuitDefinition = {
  id: 'inverter-control',
  name: 'Inverter Control Board',
  description: 'A complex inverter control board with regulator, MOSFET driver, and multiple faults.',
  width: 800,
  height: 500,
  inputVoltage: 48,
  outputVoltage: 230,
  components: [
    makeComponent('F1', 'F1', 'fuse', '5A', 5, 'A', 12, 35, 0, 1, 'none',
      '5A slow-blow input fuse.', 'fuse-5x20',
      ['TP1', 'TP2']),
    makeComponent('U1', 'U1', 'regulator', 'LM7805', 5, 'V', 28, 35, 0, 1, 'none',
      '5V regulator for control circuitry.', 'TO-220',
      ['TP3', 'TP4']),
    makeComponent('R1', 'R1', 'resistor', '100Ω', 100, 'Ω', 45, 35, 0, 1, 'open',
      'Current sense resistor — currently open.', 'axial-1W',
      ['TP5', 'TP6']),
    makeComponent('Q1', 'Q1', 'mosfet', 'IRF3205', 55, 'V', 60, 35, 0, 1.2, 'short',
      'High-side MOSFET — currently shorted.', 'TO-220',
      ['TP7', 'TP8']),
    makeComponent('D1', 'D1', 'diode', 'FR107', 1, 'V', 60, 65, 0, 1, 'none',
      'Fast recovery diode.', 'DO-41',
      ['TP9', 'TP10']),
    makeComponent('C1', 'C1', 'capacitor', '2200µF', 2200, 'µF', 75, 35, 0, 1.2, 'none',
      'DC bus filter capacitor.', 'radial-16mm',
      ['TP11', 'TP12']),
    makeComponent('U2', 'U2', 'ic', 'IR2110', 12, 'V', 85, 35, 0, 1.2, 'none',
      'MOSFET gate driver IC.', 'DIP-14',
      ['TP13', 'TP14']),
    makeComponent('R2', 'R2', 'resistor', '10kΩ', 10000, 'Ω', 85, 65, 0, 1, 'none',
      'Gate drive resistor.', 'axial-0.25W',
      ['TP15', 'TP16']),
    makeComponent('C2', 'C2', 'capacitor', '100nF', 0.1, 'µF', 95, 50, 0, 0.8, 'none',
      'Decoupling capacitor.', 'radial-2.5mm',
      ['TP17', 'TP18']),
  ],
  nets: [
    { name: 'VBUS', components: ['F1', 'U1', 'Q1', 'C1'], nominalVoltage: 48 },
    { name: 'VCC5', components: ['U1', 'U2', 'R2', 'C2'], nominalVoltage: 5 },
    { name: 'SENSE', components: ['R1', 'Q1'], nominalVoltage: 47.2 },
    { name: 'SW', components: ['Q1', 'D1'], nominalVoltage: 24 },
    { name: 'GND', components: ['D1', 'C1', 'C2', 'R2'], nominalVoltage: 0 },
  ],
  testPoints: [
    { id: 'TP1', label: 'TP1', x: 8, y: 35, net: 'VBUS' },
    { id: 'TP2', label: 'TP2', x: 18, y: 35, net: 'VBUS' },
    { id: 'TP3', label: 'TP3', x: 25, y: 35, net: 'VCC5' },
    { id: 'TP4', label: 'TP4', x: 32, y: 35, net: 'GND' },
    { id: 'TP5', label: 'TP5', x: 40, y: 35, net: 'SENSE' },
    { id: 'TP6', label: 'TP6', x: 50, y: 35, net: 'VBUS' },
    { id: 'TP7', label: 'TP7', x: 55, y: 35, net: 'SW' },
    { id: 'TP8', label: 'TP8', x: 65, y: 35, net: 'VBUS' },
    { id: 'TP9', label: 'TP9', x: 55, y: 65, net: 'GND' },
    { id: 'TP10', label: 'TP10', x: 70, y: 35, net: 'VCC5' },
    { id: 'TP11', label: 'TP11', x: 80, y: 35, net: 'VBUS' },
    { id: 'TP12', label: 'TP12', x: 88, y: 65, net: 'GND' },
  ],
};

export const circuits: Record<string, CircuitDefinition> = {
  'psu-basic': circuit1,
  'amp-circuit': circuit2,
  'dcdc-converter': circuit3,
  'inverter-control': circuit4,
};

export function getCircuit(id: string): CircuitDefinition | undefined {
  return circuits[id];
}

export function cloneCircuit(id: string): CircuitDefinition {
  const c = circuits[id];
  if (!c) throw new Error(`Circuit ${id} not found`);
  return JSON.parse(JSON.stringify(c));
}
