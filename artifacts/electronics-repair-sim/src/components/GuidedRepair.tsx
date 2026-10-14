import { useState, useCallback } from 'react';
import { useGame } from '@/state/GameContext';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';
import { cloneCircuit } from '@/game/circuits';
import { getMission } from '@/game/missions';
import { verifyRepair } from '@/game/simulation';
import type { CircuitDefinition, CircuitComponent, RepairReport } from '@/types';
import PCBInspection from '@/components/PCBInspection';
import {
  ChevronLeft, ChevronRight, CheckCircle2, ClipboardList,
  Wrench, Gauge, Search, AlertTriangle, Award, Home,
} from '@/lucide-icons';

interface GuidedRepairProps {
  onBack: () => void;
  onComplete: () => void;
  onHome: () => void;
}

interface GuidedStep {
  title: string;
  instruction: string;
  hint: string;
}

const guidedSteps: GuidedStep[] = [
  {
    title: 'Customer Report',
    instruction: 'Read the customer\'s problem: "My 12V power supply has no output. It just stopped working yesterday." This tells you to check the power path from input to output.',
    hint: 'No output usually means something in the power path is broken. Start by checking the input protection (fuse), then work towards the output.',
  },
  {
    title: 'Visual Inspection',
    instruction: 'Look at the PCB. Click on each component to identify it. Check the fuse F1 — does it look burned or broken? Look for any bulging capacitors or dark marks.',
    hint: 'The fuse is at the left side of the board, labeled F1. It protects against overcurrent. If it is blown (open), no power reaches the rest of the circuit.',
  },
  {
    title: 'Identify Components',
    instruction: 'Click on each component to see its info. You should see: F1 (fuse), D1 (diode), C1 (capacitor), U1 (regulator), C2 (capacitor), J1 (connector). Understand what each does in the power supply.',
    hint: 'F1 = fuse (protects), D1 = diode (rectifies), C1 = capacitor (filters), U1 = regulator (12V output), C2 = capacitor (output filter), J1 = connector (output jack).',
  },
  {
    title: 'Select Multimeter Mode',
    instruction: 'Switch the multimeter to DC Voltage mode. We need to measure voltage at different points to find where the power stops.',
    hint: 'DC Voltage mode measures the voltage difference between two points. Red probe on the test point, black probe on ground.',
  },
  {
    title: 'Measure Input Voltage',
    instruction: 'Place the red probe on TP1 (input) and the black probe on TP2 (ground). The input should read about 24V. If it reads 0V, the input itself has a problem.',
    hint: 'TP1 is on the left side of the board. It connects to the VIN net. If voltage is 0V here, the input connector or power source is bad.',
  },
  {
    title: 'Measure After Fuse',
    instruction: 'Now measure TP3 (after the fuse, before the diode) with red probe, black on ground. If the fuse is good, you should see voltage here. If it reads 0V, the fuse is blown (open).',
    hint: 'If TP1 shows voltage but TP3 shows 0V, the fuse F1 is open — it has blown and needs replacement.',
  },
  {
    title: 'Diagnose the Fault',
    instruction: 'Based on your measurements: if TP1 has voltage but TP3 reads 0V, the fuse F1 is open. This confirms the fault: the fuse is blown and needs to be replaced.',
    hint: 'An open fuse means the thin wire inside has melted. This protects the circuit but means no power flows past it.',
  },
  {
    title: 'Remove the Faulty Fuse',
    instruction: 'Switch to the Remove tool. Click on F1 (the fuse) to remove it from the board. The component will show as removed.',
    hint: 'Select the "Remove" tool from the bottom-left toolbar, then click on F1 to desolder and remove it.',
  },
  {
    title: 'Install Replacement',
    instruction: 'Click on the removed F1 to open the install modal. Select a 2A fuse from your inventory and install it. Make sure you pick the right value!',
    hint: 'The original fuse is 2A. Select the F-2A (2A fuse) from the inventory list. Using a wrong value could cause problems.',
  },
  {
    title: 'Run Post-Repair Test',
    instruction: 'Click "Run Test" to verify the repair. The system will check if F1 has been replaced correctly and if the output voltage is normal.',
    hint: 'The test checks that all target components are replaced and the output voltage is correct (12V). If it passes, the repair is complete!',
  },
  {
    title: 'Review Repair Report',
    instruction: 'Check the repair report. It shows whether the repair passed, your accuracy, hints used, and reward. A successful repair earns you money and XP!',
    hint: 'Good accuracy comes from using fewer hints and making fewer wrong attempts. Practice improves your score.',
  },
];

export default function GuidedRepair({ onBack, onComplete, onHome }: GuidedRepairProps) {
  const { state, dispatch } = useGame();
  const { play } = useAudio();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [circuit, setCircuit] = useState<CircuitDefinition | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<CircuitComponent | null>(null);
  const [testResult, setTestResult] = useState<{ passed: boolean; details: string[] } | null>(null);
  const [repairDone, setRepairDone] = useState(false);
  const [showStepHint, setShowStepHint] = useState(false);
  const [started, setStarted] = useState(false);

  const mission = getMission('mission-1');

  const handleStart = useCallback(() => {
    if (!mission) return;
    const newCircuit = cloneCircuit(mission.circuitId);
    setCircuit(newCircuit);
    setStarted(true);
    play('click');
  }, [mission, play]);

  const handleRemoveComponent = useCallback((compId: string) => {
    if (!circuit) return;
    setCircuit({
      ...circuit,
      components: circuit.components.map((c) =>
        c.id === compId ? { ...c, removed: true } : c,
      ),
    });
    setSelectedComponent((prev) => prev && prev.id === compId ? { ...prev, removed: true } : prev);
  }, [circuit]);

  const handleInstallComponent = useCallback((compId: string, _refDes: string) => {
    if (!circuit) return;
    setCircuit({
      ...circuit,
      components: circuit.components.map((c) =>
        c.id === compId
          ? { ...c, removed: false, replaced: true, fault: 'none' as const, actualValue: c.nominalValue }
          : c,
      ),
    });
    setSelectedComponent((prev) =>
      prev && prev.id === compId
        ? { ...prev, removed: false, replaced: true, fault: 'none', actualValue: prev.nominalValue }
        : prev,
    );
  }, [circuit]);

  const handleRunTest = useCallback(() => {
    if (!circuit || !mission) return;
    const result = verifyRepair(circuit, mission.targetComponents);
    setTestResult(result);
    if (result.passed) {
      setRepairDone(true);
      play('success');
    } else {
      play('failure');
    }
  }, [circuit, mission, play]);

  const handleFinish = useCallback(() => {
    if (!mission) return;
    dispatch({
      type: 'COMPLETE_MISSION',
      missionId: mission.id,
      reward: mission.reward,
      xp: mission.xp,
    });
    dispatch({ type: 'COMPLETE_GUIDED_REPAIR' });
    play('success');
    onComplete();
  }, [mission, dispatch, play, onComplete]);

  // Intro screen
  if (!started) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-4">
              <ClipboardList size={56} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-bold">{t('menu.guidedRepair')}</h1>
            <p className="text-zinc-400 text-sm mt-2">
              Put your Academy training into practice. A step-by-step guided repair of a 12V power supply with a blown fuse.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Wrench size={20} className="text-cyan-400" />
              <h2 className="font-semibold">Mission: Blown Fuse Replacement</h2>
            </div>
            <p className="text-sm text-zinc-300 mb-3">{mission?.description}</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-zinc-800 rounded p-2">
                <Gauge size={14} className="text-cyan-400 mx-auto mb-1" />
                <div className="text-zinc-500">Reward</div>
                <div className="text-white font-bold">${mission?.reward}</div>
              </div>
              <div className="bg-zinc-800 rounded p-2">
                <Award size={14} className="text-yellow-400 mx-auto mb-1" />
                <div className="text-zinc-500">XP</div>
                <div className="text-white font-bold">{mission?.xp}</div>
              </div>
              <div className="bg-zinc-800 rounded p-2">
                <AlertTriangle size={14} className="text-orange-400 mx-auto mb-1" />
                <div className="text-zinc-500">Difficulty</div>
                <div className="text-white font-bold capitalize">{mission?.difficulty}</div>
              </div>
            </div>
          </div>

          <div className="bg-green-950/30 border border-green-800/30 rounded-xl p-4 mb-4">
            <p className="text-sm text-green-200">
              This is a guided mission. You will receive step-by-step instructions with hints at every stage. After completing this, you will unlock real repair missions!
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { play('click'); onBack(); }}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-colors"
            >
              Start Guided Repair
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completion screen
  if (repairDone) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-4">
              <CheckCircle2 size={56} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-bold">{t('report.repairComplete')}</h1>
            <p className="text-zinc-400 text-sm mt-2">
              {t('report.repairCompleteDesc')}
            </p>
          </div>

          {testResult && (
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 mb-4">
              <h3 className="text-sm text-cyan-400 uppercase tracking-wider mb-3">Test Results</h3>
            </div>
          )}

          <div className="bg-green-950/30 border border-green-800/30 rounded-xl p-4 mb-4">
            <p className="text-sm text-green-200">
              Congratulations! You have completed the Academy and your first guided repair. Real repair missions are now unlocked. Visit the Workshop to take on customer repair jobs!
            </p>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Continue to Workshop <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // PCB + guided steps
  if (!circuit || !mission) return null;

  return (
    <div className="absolute inset-0 bg-zinc-950 flex flex-col">
      {/* Guided step panel (top) */}
      <div className="bg-green-950/40 border-b border-green-800/50 px-4 py-3 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
                {step + 1}
              </div>
              <h2 className="text-white font-semibold text-sm">{guidedSteps[step].title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-300">{step + 1} / {guidedSteps.length}</span>
            </div>
          </div>
          <p className="text-sm text-green-100/90 leading-relaxed mb-2">
            {guidedSteps[step].instruction}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { play('click'); setShowStepHint(!showStepHint); }}
              className="flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <Search size={12} /> {showStepHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <div className="flex gap-1 ml-auto">
              <button
                onClick={() => { if (step > 0) { play('click'); setStep(step - 1); setShowStepHint(false); } }}
                disabled={step === 0}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                onClick={() => { play('click'); setStep(step + 1); setShowStepHint(false); }}
                disabled={step === guidedSteps.length - 1}
                className="px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:opacity-30 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
          {showStepHint && (
            <div className="mt-2 bg-yellow-950/40 border border-yellow-800/30 rounded-lg p-3 text-yellow-200/90 text-xs leading-relaxed">
              {guidedSteps[step].hint}
            </div>
          )}
        </div>
      </div>

      {/* PCB Inspection */}
      <div className="flex-1 overflow-hidden">
        <PCBInspection
          circuit={circuit}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          onRemoveComponent={handleRemoveComponent}
          onInstallComponent={handleInstallComponent}
          onRunTest={handleRunTest}
          canRunTest={circuit.components.some((c) => c.replaced)}
          testResult={testResult}
          objectives={mission.objectives}
          hintsUsed={0}
          maxHints={3}
          onUseHint={() => setShowStepHint(true)}
          hint={showStepHint ? guidedSteps[step].hint : null}
          hasProMultimeter={state.purchasedUpgrades.includes('multimeter-pro')}
          hasDiagnosticSW={state.purchasedUpgrades.includes('diagnostic-hints')}
          onExit={onBack}
          onGoHome={onHome}
        />
      </div>
    </div>
  );
}
