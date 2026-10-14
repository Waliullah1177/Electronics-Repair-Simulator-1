import { useState, useCallback, useEffect } from 'react';
import { GameProvider, useGame } from '@/state/GameContext';
import { useAudio } from '@/game/audio';
import type { GameScreen, CircuitDefinition, CircuitComponent, RepairReport } from '@/types';
import { cloneCircuit } from '@/game/circuits';
import { getMission } from '@/game/missions';
import { verifyRepair, diagnoseComponent } from '@/game/simulation';
import { getLesson } from '@/game/lessons';

import MainMenu from '@/components/MainMenu';
import Workshop3D from '@/components/Workshop3D';
import PCBInspection from '@/components/PCBInspection';
import MissionSelect from '@/components/MissionSelect';
import Shop from '@/components/Shop';
import Inventory from '@/components/Inventory';
import SettingsScreen from '@/components/SettingsScreen';
import RepairReportScreen from '@/components/RepairReportScreen';
import HUD from '@/components/HUD';
import PauseMenu from '@/components/PauseMenu';
import Academy from '@/components/Academy';
import LessonViewer from '@/components/LessonViewer';
import ComponentLibrary from '@/components/ComponentLibrary';
import GuidedRepair from '@/components/GuidedRepair';
import ProgressScreen from '@/components/ProgressScreen';

function GameApp() {
  const { state, dispatch } = useGame();
  const { play } = useAudio();
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [prevScreen, setPrevScreen] = useState<GameScreen>('menu');
  const [paused, setPaused] = useState(false);
  const [currentMissionId, setCurrentMissionId] = useState<string | null>(null);
  const [circuit, setCircuit] = useState<CircuitDefinition | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<CircuitComponent | null>(null);
  const [testResult, setTestResult] = useState<{ passed: boolean; details: string[] } | null>(null);
  const [repairReport, setRepairReport] = useState<RepairReport | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  // Timer
  useEffect(() => {
    if (screen !== 'pcb' || !currentMissionId) return;
    const mission = getMission(currentMissionId);
    if (!mission || mission.timeLimit === 0) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
      if (elapsed >= mission.timeLimit) {
        finishMission(false, 0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, currentMissionId, startTime]);

  const handleContinue = useCallback(() => {
    if (state.academy.completedLessons.length < 8 && state.academy.completedLessons.length > 0) {
      setScreen('academy');
    } else if (state.guidedRepairCompleted || state.completedMissions.length > 0) {
      setScreen('workshop');
    } else if (state.academy.completedLessons.length >= 8) {
      setScreen('academy');
    } else {
      setScreen('academy');
    }
  }, [state.academy.completedLessons.length, state.guidedRepairCompleted, state.completedMissions.length]);

  const handleSelectMission = useCallback((missionId: string) => {
    const mission = getMission(missionId);
    if (!mission) return;

    const newCircuit = cloneCircuit(mission.circuitId);
    setCurrentMissionId(missionId);
    setCircuit(newCircuit);
    setSelectedComponent(null);
    setTestResult(null);
    setHintsUsed(0);
    setHint(null);
    setIncorrectAttempts(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setScreen('pcb');
  }, []);

  const handleExitPCB = useCallback(() => {
    setScreen('workshop');
    setCircuit(null);
    setSelectedComponent(null);
    setTestResult(null);
  }, []);

  const handleGoHome = useCallback(() => {
    setPaused(false);
    setSelectedComponent(null);
    setTestResult(null);
    setRepairReport(null);
    setHint(null);
    setHintsUsed(0);
    setIncorrectAttempts(0);
    setScreen('menu');
  }, []);

  const handleRemoveComponent = useCallback((compId: string) => {
    if (!circuit) return;
    const updatedCircuit = {
      ...circuit,
      components: circuit.components.map((c) =>
        c.id === compId ? { ...c, removed: true } : c,
      ),
    };
    setCircuit(updatedCircuit);
    setSelectedComponent((prev) => prev && prev.id === compId ? { ...prev, removed: true } : prev);
  }, [circuit]);

  const handleInstallComponent = useCallback((compId: string, _inventoryRefDes: string) => {
    if (!circuit) return;
    const updatedCircuit = {
      ...circuit,
      components: circuit.components.map((c) =>
        c.id === compId
          ? { ...c, removed: false, replaced: true, fault: 'none' as const, actualValue: c.nominalValue }
          : c,
      ),
    };
    setCircuit(updatedCircuit);
    setSelectedComponent((prev) =>
      prev && prev.id === compId
        ? { ...prev, removed: false, replaced: true, fault: 'none', actualValue: prev.nominalValue }
        : prev,
    );
  }, [circuit]);

  const canRunTest = circuit
    ? circuit.components.some((c) => c.replaced)
    : false;

  const handleRunTest = useCallback(() => {
    if (!circuit || !currentMissionId) return;
    const mission = getMission(currentMissionId);
    if (!mission) return;

    const result = verifyRepair(circuit, mission.targetComponents);
    setTestResult(result);

    if (result.passed) {
      const baseAccuracy = 100;
      const hintPenalty = (hintsUsed / mission.maxHints) * 20;
      const incorrectPenalty = Math.min(incorrectAttempts * 5, 25);
      const accuracy = Math.max(0, Math.round(baseAccuracy - hintPenalty - incorrectPenalty));

      finishMission(true, accuracy);
    } else {
      play('failure');
    }
  }, [circuit, currentMissionId, hintsUsed, incorrectAttempts, play]);

  const finishMission = useCallback((success: boolean, accuracy: number) => {
    if (!currentMissionId) return;
    const mission = getMission(currentMissionId);
    if (!mission) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const reward = success ? mission.reward : 0;
    const xp = success ? mission.xp : Math.floor(mission.xp * 0.1);

    if (success) {
      dispatch({ type: 'COMPLETE_MISSION', missionId: mission.id, reward, xp });
      play('success');
    } else {
      play('failure');
    }

    const report: RepairReport = {
      missionId: mission.id,
      success,
      accuracy,
      hintsUsed,
      timeTaken,
      componentsReplaced: circuit?.components.filter((c) => c.replaced).map((c) => c.refDes) ?? [],
      incorrectAttempts,
      reward,
      xp,
    };
    setRepairReport(report);
    setScreen('report');
  }, [currentMissionId, startTime, hintsUsed, incorrectAttempts, circuit, dispatch, play]);

  const handleUseHint = useCallback(() => {
    if (!circuit || !currentMissionId) return;
    const mission = getMission(currentMissionId);
    if (!mission || hintsUsed >= mission.maxHints) return;

    setHintsUsed((h) => h + 1);

    const hasDiagSW = state.purchasedUpgrades.includes('diagnostic-hints');
    const faultyComponents = circuit.components.filter((c) => c.fault !== 'none' && !c.replaced);

    if (faultyComponents.length === 0) {
      setHint('No faulty components detected. All faults have been repaired.');
      return;
    }

    if (hintsUsed === 0) {
      const comp = faultyComponents[0];
      setHint(`There appears to be an issue near ${comp.refDes} (${comp.type}). Try measuring around that area.`);
    } else if (hintsUsed === 1) {
      const comp = faultyComponents[0];
      const tpInfo = comp.testPoints.map((tp) => tp.label).join(' and ');
      setHint(`Measure ${comp.refDes} using test points ${tpInfo}. The fault is ${hasDiagSW ? comp.fault : 'a ' + comp.type + ' issue'}.`);
    } else {
      const comp = faultyComponents[0];
      setHint(diagnoseComponent(comp));
    }
  }, [circuit, currentMissionId, hintsUsed, state.purchasedUpgrades]);

  const handleReportContinue = useCallback(() => {
    if (repairReport?.success) {
      setCurrentMissionId(null);
      setCircuit(null);
      setRepairReport(null);
      setScreen('workshop');
    } else {
      setRepairReport(null);
      setScreen('pcb');
    }
  }, [repairReport]);

  const handlePause = useCallback(() => {
    setPrevScreen(screen);
    setPaused(true);
  }, [screen]);

  const handleResume = useCallback(() => {
    setPaused(false);
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (screen === 'pcb') {
          handlePause();
        } else if (paused) {
          handleResume();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, paused, handlePause, handleResume]);

  // Lesson completion handler
  const handleLessonComplete = useCallback((score: number) => {
    if (!currentLessonId) return;
    const lesson = getLesson(currentLessonId);
    if (!lesson) return;
    dispatch({ type: 'COMPLETE_LESSON', lessonId: lesson.id, score, xp: lesson.xpReward });
    setCurrentLessonId(null);
    setScreen('academy');
  }, [currentLessonId, dispatch]);

  const handleLessonSave = useCallback((pageIndex: number) => {
    if (currentLessonId) {
      dispatch({ type: 'SAVE_LESSON_PROGRESS', lessonId: currentLessonId, pageIndex });
    }
  }, [currentLessonId, dispatch]);

  // Render based on screen
  if (screen === 'menu') {
    return (
      <MainMenu
        onContinue={handleContinue}
        onSettings={() => setScreen('settings')}
        onOpenAcademy={() => setScreen('academy')}
        onOpenLibrary={() => setScreen('componentLibrary')}
        onOpenMissions={() => setScreen('missions')}
        onOpenWorkshop={() => setScreen('workshop')}
        onOpenGuidedRepair={() => setScreen('guidedRepair')}
        onOpenProgress={() => setScreen('progress')}
      />
    );
  }

  if (screen === 'settings') {
    return <SettingsScreen onBack={() => setScreen(prevScreen === 'menu' ? 'menu' : (state.completedMissions.length > 0 || state.level > 1 ? 'workshop' : 'menu'))} onHome={handleGoHome} />;
  }

  if (screen === 'academy') {
    if (currentLessonId) {
      const lesson = getLesson(currentLessonId);
      if (lesson) {
        return (
          <LessonViewer
            lesson={lesson}
            onBack={() => { setCurrentLessonId(null); setScreen('academy'); }}
            onComplete={handleLessonComplete}
            onSaveProgress={handleLessonSave}
            onHome={handleGoHome}
          />
        );
      }
    }
    return (
      <Academy
        onBack={() => setScreen('menu')}
        onOpenLesson={(id) => { setCurrentLessonId(id); setScreen('lesson'); }}
        onGoToGuidedRepair={() => setScreen('guidedRepair')}
        onHome={handleGoHome}
      />
    );
  }

  if (screen === 'lesson' && currentLessonId) {
    const lesson = getLesson(currentLessonId);
    if (lesson) {
      return (
        <LessonViewer
          lesson={lesson}
          onBack={() => { setCurrentLessonId(null); setScreen('academy'); }}
          onComplete={handleLessonComplete}
          onSaveProgress={handleLessonSave}
          onHome={handleGoHome}
        />
      );
    }
  }

  if (screen === 'componentLibrary') {
    return <ComponentLibrary onBack={() => setScreen('menu')} onHome={handleGoHome} />;
  }

  if (screen === 'guidedRepair') {
    return (
      <GuidedRepair
        onBack={() => setScreen('academy')}
        onComplete={() => setScreen('workshop')}
        onHome={handleGoHome}
      />
    );
  }

  if (screen === 'progress') {
    return <ProgressScreen onBack={() => setScreen('menu')} onHome={handleGoHome} />;
  }

  if (screen === 'missions') {
    return <MissionSelect onBack={() => setScreen('workshop')} onSelectMission={handleSelectMission} onHome={handleGoHome} />;
  }

  if (screen === 'shop') {
    return <Shop onBack={() => setScreen('workshop')} onHome={handleGoHome} />;
  }

  if (screen === 'inventory') {
    return <Inventory onBack={() => setScreen('workshop')} onHome={handleGoHome} />;
  }

  if (screen === 'report' && repairReport) {
    return <RepairReportScreen report={repairReport} onContinue={handleReportContinue} onHome={handleGoHome} />;
  }

  if (screen === 'pcb' && circuit && currentMissionId) {
    const mission = getMission(currentMissionId);
    if (!mission) return null;

    return (
      <>
        <PCBInspection
          circuit={circuit}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          onRemoveComponent={handleRemoveComponent}
          onInstallComponent={handleInstallComponent}
          onRunTest={handleRunTest}
          canRunTest={canRunTest}
          testResult={testResult}
          objectives={mission.objectives}
          hintsUsed={hintsUsed}
          maxHints={mission.maxHints}
          onUseHint={handleUseHint}
          hint={hint}
          hasProMultimeter={state.purchasedUpgrades.includes('multimeter-pro')}
          hasDiagnosticSW={state.purchasedUpgrades.includes('diagnostic-hints')}
          onExit={handleExitPCB}
          onGoHome={handleGoHome}
        />
        {paused && (
          <PauseMenu
            onResume={handleResume}
            onExitToWorkshop={() => { setPaused(false); handleExitPCB(); }}
            onExitToMenu={() => { setPaused(false); handleExitPCB(); setScreen('menu'); }}
          />
        )}
      </>
    );
  }

  // Default: workshop
  return (
    <div className="relative w-full h-screen bg-zinc-950">
      <Workshop3D
        onOpenMissions={() => setScreen('missions')}
        onOpenShop={() => setScreen('shop')}
        onOpenInventory={() => setScreen('inventory')}
        onOpenSettings={() => setScreen('settings')}
        onOpenPCB={handleSelectMission}
        onOpenAcademy={() => setScreen('academy')}
        onOpenLibrary={() => setScreen('componentLibrary')}
        onOpenGuidedRepair={() => setScreen('guidedRepair')}
        onGoHome={handleGoHome}
        currentMissionId={currentMissionId}
        cameraMode="orbit"
      />
      <HUD onPause={handlePause} />
      {currentMissionId && screen === 'workshop' && (() => {
        const mission = getMission(currentMissionId);
        if (!mission || mission.timeLimit === 0) return null;
        const remaining = Math.max(0, mission.timeLimit - elapsedTime);
        return (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-zinc-900/90 border border-yellow-700 rounded-lg px-3 py-1.5 text-yellow-400 text-sm font-mono z-20">
            {Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, '0')}
          </div>
        );
      })()}
      {paused && (
        <PauseMenu
          onResume={handleResume}
          onExitToWorkshop={() => setPaused(false)}
          onExitToMenu={() => { setPaused(false); setScreen('menu'); }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
