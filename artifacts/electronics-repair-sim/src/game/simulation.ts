import type {
  CircuitDefinition,
  CircuitComponent,
  MultimeterMode,
  TestPoint,
  FaultType,
  ComponentType,
} from '@/types';

export interface MeasurementResult {
  value: number | string;
  unit: string;
  display: string;
  valid: boolean;
  message: string;
  isError: boolean;
}

const INF = Infinity;

function formatValue(val: number, unit: string): string {
  if (val === Infinity) return 'O.L';
  if (val === 0 && unit === 'Ω') return '0Ω';
  if (Math.abs(val) >= 1000000) return `${(val / 1000000).toFixed(2)}M${unit}`;
  if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(2)}k${unit}`;
  if (Math.abs(val) < 0.01 && val !== 0) return `${val.toFixed(4)}${unit}`;
  if (Math.abs(val) < 1 && val !== 0) return `${val.toFixed(3)}${unit}`;
  return `${val.toFixed(2)}${unit}`;
}

function findTestPoint(circuit: CircuitDefinition, tpId: string): TestPoint | undefined {
  return circuit.testPoints.find((tp) => tp.id === tpId);
}

function findComponentByTestPoint(circuit: CircuitDefinition, tpId: string): CircuitComponent | undefined {
  return circuit.components.find((c) => c.testPoints.some((tp) => tp.id === tpId));
}

function getNetVoltage(circuit: CircuitDefinition, netName: string): number {
  const net = circuit.nets.find((n) => n.name === netName);
  if (!net) return 0;

  // Check if any component on this net is faulty and affects voltage
  for (const compId of net.components) {
    const comp = circuit.components.find((c) => c.id === compId);
    if (!comp || comp.removed) continue;

    if (comp.type === 'fuse' && comp.fault === 'open') {
      // An open fuse breaks the circuit downstream
      if (net.name === 'VRECT' || net.name === 'VOUT' || net.name === 'VBUS') {
        return 0;
      }
    }
    if (comp.type === 'regulator' && comp.fault === 'short') {
      // Shorted regulator passes full input voltage
      if (net.name === 'VOUT') return circuit.inputVoltage;
    }
    if (comp.type === 'regulator' && comp.fault === 'open') {
      if (net.name === 'VOUT') return 0;
    }
    if (comp.type === 'mosfet' && comp.fault === 'short') {
      // Shorted MOSFET passes full voltage through
      if (net.name === 'SW') {
        return net.nominalVoltage * 2;
      }
    }
    if (comp.type === 'resistor' && comp.fault === 'open') {
      // Open resistor breaks its net
      if (net.name === 'SENSE') return 0;
    }
  }
  return net.nominalVoltage;
}

export function measure(
  circuit: CircuitDefinition,
  mode: MultimeterMode,
  redProbe: TestPoint | null,
  blackProbe: TestPoint | null,
): MeasurementResult {
  if (!redProbe || !blackProbe) {
    return {
      value: '--',
      unit: '',
      display: '--',
      valid: false,
      message: 'Place both probes on test points to measure.',
      isError: false,
    };
  }

  if (redProbe.id === blackProbe.id) {
    return {
      value: '--',
      unit: '',
      display: 'SAME TP',
      valid: false,
      message: 'Probes are on the same test point. Place them on different points.',
      isError: true,
    };
  }

  const redNet = redProbe.net;
  const blackNet = blackProbe.net;

  switch (mode) {
    case 'dc_voltage': {
      const redV = getNetVoltage(circuit, redNet);
      const blackV = getNetVoltage(circuit, blackNet);
      const voltage = redV - blackV;
      return {
        value: voltage,
        unit: 'V',
        display: formatValue(voltage, 'V'),
        valid: true,
        message: `DC voltage between ${redProbe.label} (${redNet}) and ${blackProbe.label} (${blackNet}).`,
        isError: false,
      };
    }

    case 'resistance': {
      // Find components between the two test points
      const redComp = findComponentByTestPoint(circuit, redProbe.id);
      const blackComp = findComponentByTestPoint(circuit, blackProbe.id);

      // Check if the two test points are on the same component
      let targetComp: CircuitComponent | undefined;
      for (const comp of circuit.components) {
        const hasRed = comp.testPoints.some((tp) => tp.id === redProbe.id);
        const hasBlack = comp.testPoints.some((tp) => tp.id === blackProbe.id);
        if (hasRed && hasBlack) {
          targetComp = comp;
          break;
        }
      }

      if (targetComp) {
        if (targetComp.removed) {
          return {
            value: '--',
            unit: 'Ω',
            display: 'O.L',
            valid: true,
            message: 'Component has been removed. No connection.',
            isError: false,
          };
        }
        const res = targetComp.fault === 'open' ? INF : targetComp.fault === 'short' ? 0 : getResistanceValue(targetComp);
        return {
          value: res,
          unit: 'Ω',
          display: formatValue(res, 'Ω'),
          valid: true,
          message: `Resistance across ${targetComp.refDes}: ${targetComp.fault === 'open' ? 'Open circuit' : targetComp.fault === 'short' ? 'Short circuit' : 'Normal reading'}.`,
          isError: false,
        };
      }

      // Check if on same net (would read 0Ω)
      if (redNet === blackNet) {
        return {
          value: 0,
          unit: 'Ω',
          display: '0.00Ω',
          valid: true,
          message: 'Test points are on the same net — near-zero resistance expected.',
          isError: false,
        };
      }

      // Different nets without a direct component — check for path
      return {
        value: INF,
        unit: 'Ω',
        display: 'O.L',
        valid: true,
        message: 'No direct resistance path between these test points.',
        isError: false,
      };
    }

    case 'continuity': {
      if (redNet === blackNet) {
        return {
          value: 0,
          unit: 'Ω',
          display: 'BEEP',
          valid: true,
          message: 'Continuity detected — these points are connected (same net).',
          isError: false,
        };
      }

      // Check for shorted component between nets
      for (const comp of circuit.components) {
        if (comp.removed) continue;
        const hasRed = comp.testPoints.some((tp) => tp.net === redNet);
        const hasBlack = comp.testPoints.some((tp) => tp.net === blackNet);
        if (hasRed && hasBlack && comp.fault === 'short') {
          return {
            value: 0,
            unit: 'Ω',
            display: 'BEEP',
            valid: true,
            message: `Continuity through shorted ${comp.refDes}! This component appears shorted.`,
            isError: false,
          };
        }
      }

      return {
        value: INF,
        unit: 'Ω',
        display: '----',
        valid: true,
        message: 'No continuity between these test points.',
        isError: false,
      };
    }

    case 'diode_test': {
      let targetComp: CircuitComponent | undefined;
      for (const comp of circuit.components) {
        const hasRed = comp.testPoints.some((tp) => tp.id === redProbe.id);
        const hasBlack = comp.testPoints.some((tp) => tp.id === blackProbe.id);
        if (hasRed && hasBlack && (comp.type === 'diode' || comp.type === 'mosfet')) {
          targetComp = comp;
          break;
        }
      }

      if (!targetComp) {
        return {
          value: '--',
          unit: 'V',
          display: 'O.L',
          valid: true,
          message: 'No diode junction detected between these test points.',
          isError: false,
        };
      }

      if (targetComp.removed) {
        return {
          value: '--',
          unit: 'V',
          display: 'O.L',
          valid: true,
          message: 'Component removed — no junction to test.',
          isError: false,
        };
      }

      if (targetComp.fault === 'short') {
        return {
          value: 0,
          unit: 'V',
          display: '0.00V',
          valid: true,
          message: `${targetComp.refDes} reads as shorted! Voltage drop is 0V — junction is failed short.`,
          isError: false,
        };
      }

      if (targetComp.fault === 'open') {
        return {
          value: INF,
          unit: 'V',
          display: 'O.L',
          valid: true,
          message: `${targetComp.refDes} reads as open! No junction voltage detected — component is open.`,
          isError: false,
        };
      }

      const drop = targetComp.type === 'diode' ? 0.65 : 0.7;
      return {
        value: drop,
        unit: 'V',
        display: `${drop.toFixed(2)}V`,
        valid: true,
        message: `${targetComp.refDes} junction voltage drop: ${drop}V — normal.`,
        isError: false,
      };
    }

    default:
      return {
        value: '--',
        unit: '',
        display: '--',
        valid: false,
        message: 'Unknown measurement mode.',
        isError: true,
      };
  }
}

function getResistanceValue(comp: CircuitComponent): number {
  switch (comp.type) {
    case 'resistor':
      return comp.nominalValue;
    case 'fuse':
      return 0.1; // Near-zero for a good fuse
    case 'capacitor':
      return INF; // Caps read as open on resistance mode (DC)
    case 'diode':
      return INF; // Reads open in one direction
    case 'mosfet':
      return INF; // Gate is insulated
    case 'regulator':
      return INF;
    case 'ic':
      return INF;
    case 'inductor':
      return 1; // Very low resistance
    case 'connector':
      return 0.1;
    default:
      return INF;
  }
}

export function getExpectedReadings(circuit: CircuitDefinition): Record<string, { normal: string; faulty: string }> {
  const readings: Record<string, { normal: string; faulty: string }> = {};
  for (const comp of circuit.components) {
    if (comp.fault !== 'none') {
      const faultDesc = comp.fault === 'open' ? 'Open circuit (O.L)' : comp.fault === 'short' ? 'Short circuit (0Ω/0V)' : 'Value drift';
      readings[comp.refDes] = {
        normal: `Normal: ${formatValue(comp.nominalValue, comp.unit)}`,
        faulty: `Faulty: ${faultDesc}`,
      };
    }
  }
  return readings;
}

export function diagnoseComponent(comp: CircuitComponent): string {
  switch (comp.fault) {
    case 'open':
      return `${comp.refDes} is OPEN — the component has failed open circuit. It needs to be replaced with a ${comp.value} ${comp.type}.`;
    case 'short':
      return `${comp.refDes} is SHORTED — the component has failed short circuit. It needs to be replaced with a ${comp.value} ${comp.type}.`;
    case 'value_drift':
      return `${comp.refDes} has drifted from its nominal value of ${comp.value}. Replacement needed.`;
    case 'none':
    default:
      return `${comp.refDes} appears to be functioning normally.`;
  }
}

export function isRepairComplete(circuit: CircuitDefinition, targetIds: string[]): boolean {
  for (const id of targetIds) {
    const comp = circuit.components.find((c) => c.id === id);
    if (!comp) return false;
    if (!comp.removed || !comp.replaced) return false;
    // Check that the replaced component is not faulty
    if (comp.fault !== 'none') {
      // After replacement, fault should be cleared
      // This is set during the replace action
      return false;
    }
  }
  return true;
}

export function verifyRepair(circuit: CircuitDefinition, targetIds: string[]): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;

  for (const id of targetIds) {
    const comp = circuit.components.find((c) => c.id === id);
    if (!comp) {
      details.push(`Component ${id} not found on board.`);
      passed = false;
      continue;
    }
    if (!comp.replaced) {
      details.push(`${comp.refDes} has not been replaced.`);
      passed = false;
      continue;
    }
    if (comp.fault !== 'none') {
      details.push(`${comp.refDes} still shows a fault condition (${comp.fault}).`);
      passed = false;
    } else {
      details.push(`${comp.refDes}: Replaced successfully. Reading ${comp.value} ${comp.unit} — within spec.`);
    }
  }

  // Verify output voltage
  const outNet = circuit.nets.find((n) => n.name === 'VOUT' || n.name === 'VCC5');
  if (outNet && passed) {
    const outV = getNetVoltage(circuit, outNet.name);
    if (Math.abs(outV - outNet.nominalVoltage) < 0.5) {
      details.push(`Output voltage: ${outV.toFixed(2)}V — normal.`);
    } else {
      details.push(`Output voltage: ${outV.toFixed(2)}V — out of spec!`);
      passed = false;
    }
  }

  return { passed, details };
}
