import { useRef, useState, useCallback, type ReactElement } from 'react';
import type { CircuitDefinition, CircuitComponent, TestPoint, MultimeterMode, ProbeColor } from '@/types';
import { measure, type MeasurementResult } from '@/game/simulation';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';
import { ChevronLeft, ZoomIn, ZoomOut, Maximize, Crosshair, Trash2, Package, Play, Wrench, HelpCircle, CheckCircle2, XCircle, Home } from '@/lucide-icons';

interface PCBInspectionProps {
  circuit: CircuitDefinition;
  selectedComponent: CircuitComponent | null;
  onSelectComponent: (comp: CircuitComponent | null) => void;
  onRemoveComponent: (compId: string) => void;
  onInstallComponent: (compId: string, inventoryRefDes: string) => void;
  onRunTest: () => void;
  canRunTest: boolean;
  testResult: { passed: boolean; details: string[] } | null;
  objectives: string[];
  hintsUsed: number;
  maxHints: number;
  onUseHint: () => void;
  hint: string | null;
  hasProMultimeter: boolean;
  hasDiagnosticSW: boolean;
  onExit: () => void;
  onGoHome: () => void;
}

export default function PCBInspection(props: PCBInspectionProps) {
  const {
    circuit, selectedComponent, onSelectComponent,
    onRemoveComponent, onInstallComponent, onRunTest,
    canRunTest, testResult, objectives,
    hintsUsed, maxHints, onUseHint, hint,
    hasProMultimeter, hasDiagnosticSW, onExit, onGoHome,
  } = props;

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<MultimeterMode>('dc_voltage');
  const [redProbe, setRedProbe] = useState<TestPoint | null>(null);
  const [blackProbe, setBlackProbe] = useState<TestPoint | null>(null);
  const [measurement, setMeasurement] = useState<MeasurementResult | null>(null);
  const [showSchematic, setShowSchematic] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState<CircuitComponent | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<'inspect' | 'multimeter' | 'solder' | 'remove'>('inspect');
  const [probeSelecting, setProbeSelecting] = useState<ProbeColor | null>(null);
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const { play } = useAudio();
  const { t } = useTranslation();

  const svgRef = useRef<SVGSVGElement>(null);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 0.3, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - 0.3, 0.5));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleComponentClick = useCallback((comp: CircuitComponent) => {
    if (probeSelecting) return;
    play('select');
    onSelectComponent(comp);
  }, [play, onSelectComponent, probeSelecting]);

  const handleTestPointClick = useCallback((tp: TestPoint) => {
    if (!probeSelecting) return;
    play('measure');
    if (probeSelecting === 'red') {
      setRedProbe(tp);
    } else {
      setBlackProbe(tp);
    }
    setProbeSelecting(null);
  }, [play, probeSelecting]);

  // Auto-measure when both probes placed
  const doMeasure = useCallback(() => {
    if (redProbe && blackProbe) {
      play('beep');
      const result = measure(circuit, mode, redProbe, blackProbe);
      setMeasurement(result);
    }
  }, [redProbe, blackProbe, circuit, mode, play]);

  const lastMeasured = useRef('');
  const probeKey = `${redProbe?.id ?? ''}-${blackProbe?.id ?? ''}-${mode}`;
  if (redProbe && blackProbe && lastMeasured.current !== probeKey) {
    lastMeasured.current = probeKey;
    setTimeout(() => doMeasure(), 0);
  }

  const handleStartProbeSelect = useCallback((color: ProbeColor) => {
    play('click');
    setActiveTool('multimeter');
    setProbeSelecting(color);
  }, [play]);

  const handleCancelProbeSelect = useCallback(() => {
    play('click');
    setProbeSelecting(null);
  }, [play]);

  const handleResetProbes = useCallback(() => {
    play('click');
    setRedProbe(null);
    setBlackProbe(null);
    setMeasurement(null);
    setProbeSelecting(null);
  }, [play]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && activeTool === 'inspect' && !probeSelecting) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan, activeTool, probeSelecting]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (activeTool === 'inspect' && !probeSelecting && e.touches.length === 1) {
      setIsPanning(true);
      setPanStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  }, [pan, activeTool, probeSelecting]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isPanning && e.touches.length === 1) {
      setPan({ x: e.touches[0].clientX - panStart.x, y: e.touches[0].clientY - panStart.y });
    }
  }, [isPanning, panStart]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleRemove = useCallback((comp: CircuitComponent) => {
    play('remove');
    onRemoveComponent(comp.id);
  }, [play, onRemoveComponent]);

  const handleInstall = useCallback((inventoryRefDes: string) => {
    if (!showInstallModal) return;
    play('install');
    onInstallComponent(showInstallModal.id, inventoryRefDes);
    setShowInstallModal(null);
  }, [play, onInstallComponent, showInstallModal]);

  const handleRunTest = useCallback(() => {
    play('measure');
    onRunTest();
  }, [play, onRunTest]);

  const handleHint = useCallback(() => {
    play('click');
    onUseHint();
  }, [play, onUseHint]);

  const handleHomeClick = useCallback(() => {
    play('click');
    setShowHomeConfirm(true);
  }, [play]);

  const handleHomeConfirm = useCallback(() => {
    play('click');
    setShowHomeConfirm(false);
    onGoHome();
  }, [play, onGoHome]);

  const modes: { mode: MultimeterMode; label: string; icon: string }[] = [
    { mode: 'dc_voltage', label: 'DC V', icon: 'V' },
    { mode: 'resistance', label: 'Ω', icon: 'Ω' },
    { mode: 'continuity', label: 'BEEP', icon: '♪' },
    { mode: 'diode_test', label: 'Diode', icon: '▶' },
  ];

  return (
    <div className="absolute inset-0 bg-zinc-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-700 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { play('click'); onExit(); }}
            className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm hidden sm:inline">{t('pcb.backToWorkshop')}</span>
          </button>
        </div>
        <h1 className="text-white font-semibold text-sm sm:text-base truncate flex-1 text-center px-2">{circuit.name}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-medium transition-colors"
            title="Return to Workshop Home"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Home</span>
          </button>
          <button
            onClick={() => setShowSchematic(!showSchematic)}
            className="text-xs text-zinc-400 hover:text-cyan-400 transition-colors px-2 py-1"
          >
            {showSchematic ? t('pcb.pcbView') : t('pcb.schematic')}
          </button>
          <button onClick={handleZoomOut} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">
            <ZoomOut size={18} />
          </button>
          <button onClick={handleZoomIn} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">
            <ZoomIn size={18} />
          </button>
          <button onClick={handleResetView} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">
            <Maximize size={18} />
          </button>
        </div>
      </div>

      {/* Probe selection mode banner */}
      {probeSelecting && (
        <div className={`px-4 py-2 shrink-0 border-b flex items-center justify-between ${
          probeSelecting === 'red'
            ? 'bg-red-950/60 border-red-700'
            : 'bg-zinc-800 border-zinc-600'
        }`}>
          <div className="flex items-center gap-2 text-sm">
            <span className={`w-3 h-3 rounded-full ${probeSelecting === 'red' ? 'bg-red-500' : 'bg-zinc-400'}`} />
            <span className="text-white font-medium">
              {probeSelecting === 'red' ? t('pcb.selectTestPointRed') : t('pcb.selectTestPointBlack')}
            </span>
          </div>
          <button
            onClick={handleCancelProbeSelect}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <XCircle size={14} /> {t('pcb.cancel')}
          </button>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* PCB View */}
        <div className="flex-1 relative overflow-hidden bg-zinc-900 select-none">
          <div
            className="absolute inset-0"
            style={{ cursor: probeSelecting ? 'crosshair' : isPanning ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center',
                transition: isPanning ? 'none' : 'transform 0.15s ease-out',
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {showSchematic ? (
                <SchematicView circuit={circuit} onComponentClick={handleComponentClick} selectedId={selectedComponent?.id} />
              ) : (
                <PCBView
                  circuit={circuit}
                  selectedComponent={selectedComponent}
                  onComponentClick={handleComponentClick}
                  onTestPointClick={handleTestPointClick}
                  redProbe={redProbe}
                  blackProbe={blackProbe}
                  probeSelecting={probeSelecting}
                />
              )}
            </div>
          </div>

          {/* Tool selector (bottom-left) */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
            <ToolButton active={activeTool === 'inspect' && !probeSelecting} onClick={() => { play('click'); setActiveTool('inspect'); setProbeSelecting(null); }} icon={Crosshair} label={t('pcb.inspect')} />
            <ToolButton active={activeTool === 'multimeter' || probeSelecting !== null} onClick={() => { play('click'); setActiveTool('multimeter'); }} icon={Wrench} label={t('pcb.measureTool')} />
            <ToolButton active={activeTool === 'remove'} onClick={() => { play('click'); setActiveTool('remove'); setProbeSelecting(null); }} icon={Trash2} label={t('pcb.removeTool')} />
          </div>

          {/* Zoom indicator */}
          <div className="absolute top-4 left-4 text-zinc-500 text-xs bg-zinc-900/70 px-2 py-1 rounded">
            {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-96 bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-700 overflow-y-auto shrink-0 max-h-[50vh] lg:max-h-none">
          {/* Probe + Multimeter combined panel */}
          <div className="p-3 border-b border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">{t('pcb.probesAndMeter')}</h3>
              <span className="text-[10px] text-zinc-500">{hasProMultimeter ? t('pcb.proAutoRange') : t('pcb.standard')}</span>
            </div>

            {/* Mode selector */}
            <div className="grid grid-cols-4 gap-1 mb-2">
              {modes.map((m) => (
                <button
                  key={m.mode}
                  onClick={() => { play('click'); setMode(m.mode); setMeasurement(null); }}
                  className={`py-1.5 text-[11px] font-medium rounded transition-all touch-manipulation ${
                    mode === m.mode
                      ? 'bg-cyan-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Compact probe indicators */}
            <div className="flex gap-1.5 mb-2">
              <div className={`flex-1 flex items-center gap-1.5 rounded-md px-2 py-1.5 border transition-all ${
                probeSelecting === 'red'
                  ? 'border-red-500 bg-red-950/50 animate-pulse'
                  : 'border-red-800/50 bg-red-950/20'
              }`}>
                <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-red-300 font-semibold text-[10px] leading-tight">RED</div>
                  <div className="text-white font-mono text-[11px] font-bold leading-tight truncate">
                    {probeSelecting === 'red' ? 'Select...' : redProbe ? redProbe.label : '—'}
                  </div>
                </div>
              </div>
              <div className={`flex-1 flex items-center gap-1.5 rounded-md px-2 py-1.5 border transition-all ${
                probeSelecting === 'black'
                  ? 'border-zinc-400 bg-zinc-700/60 animate-pulse'
                  : 'border-zinc-600/50 bg-zinc-800/40'
              }`}>
                <span className="w-3 h-3 rounded-full bg-zinc-300 shrink-0" />
                <div className="min-w-0">
                  <div className="text-zinc-200 font-semibold text-[10px] leading-tight">BLACK</div>
                  <div className="text-white font-mono text-[11px] font-bold leading-tight truncate">
                    {probeSelecting === 'black' ? 'Select...' : blackProbe ? blackProbe.label : '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Combined control row: probe buttons + measure + reset */}
            <div className="flex gap-1.5">
              <button
                onClick={() => handleStartProbeSelect('red')}
                disabled={probeSelecting === 'black'}
                className="flex-1 py-1.5 px-1 bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded text-[11px] font-medium transition-colors touch-manipulation"
                title="Change red probe"
              >
                Red
              </button>
              <button
                onClick={() => handleStartProbeSelect('black')}
                disabled={probeSelecting === 'red'}
                className="flex-1 py-1.5 px-1 bg-zinc-600 hover:bg-zinc-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded text-[11px] font-medium transition-colors touch-manipulation"
                title="Change black probe"
              >
                Black
              </button>
              <button
                onClick={handleResetProbes}
                disabled={!redProbe && !blackProbe}
                className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 rounded text-[11px] font-medium transition-colors touch-manipulation"
                title="Reset both probes"
              >
                Clr
              </button>
              <button
                onClick={doMeasure}
                disabled={!redProbe || !blackProbe}
                className="flex-[1.5] py-1.5 px-2 bg-cyan-700 hover:bg-cyan-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded text-[11px] font-semibold transition-colors touch-manipulation"
                title="Measure with multimeter"
              >
                Measure
              </button>
            </div>

            {/* Display */}
            <div className="bg-black rounded-md p-2.5 border border-zinc-700 font-mono mt-2">
              <div className="text-emerald-400 text-xl font-bold text-center tracking-wider min-h-[1.5rem]">
                {measurement?.display ?? '--'}
              </div>
              <div className="text-zinc-500 text-[10px] text-center mt-0.5 leading-tight">
                {measurement?.message ?? t('pcb.setProbesMeasure')}
              </div>
            </div>
          </div>

          {/* Selected component info */}
          {selectedComponent && (
            <div className="p-4 border-b border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">{t('pcb.component')}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  selectedComponent.removed
                    ? 'bg-orange-900 text-orange-300'
                    : selectedComponent.replaced
                    ? 'bg-green-900 text-green-300'
                    : selectedComponent.fault !== 'none'
                    ? 'bg-red-900 text-red-300'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {selectedComponent.removed ? t('pcb.removed') : selectedComponent.replaced ? t('pcb.replaced') : selectedComponent.fault !== 'none' ? t('pcb.faulty') : t('pcb.normal')}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">{t('pcb.reference')}</span><span className="text-white font-mono">{selectedComponent.refDes}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">{t('pcb.type')}</span><span className="text-white capitalize">{selectedComponent.type}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">{t('pcb.value')}</span><span className="text-white font-mono">{selectedComponent.value}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">{t('pcb.package')}</span><span className="text-white">{selectedComponent.package}</span></div>
                <p className="text-zinc-400 text-xs mt-2">{selectedComponent.description}</p>

                {/* Action buttons */}
                <div className="flex gap-2 mt-3">
                  {!selectedComponent.removed && (
                    <button
                      onClick={() => handleRemove(selectedComponent)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-orange-700 hover:bg-orange-600 text-white rounded text-xs font-medium transition-colors touch-manipulation"
                    >
                      <Trash2 size={14} /> {t('pcb.remove')}
                    </button>
                  )}
                  {selectedComponent.removed && !selectedComponent.replaced && (
                    <button
                      onClick={() => { play('click'); setShowInstallModal(selectedComponent); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-700 hover:bg-green-600 text-white rounded text-xs font-medium transition-colors touch-manipulation"
                    >
                      <Package size={14} /> {t('pcb.install')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Objectives */}
          <div className="p-4 border-b border-zinc-700">
            <h3 className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-2">{t('pcb.objectives')}</h3>
            <ul className="space-y-1.5">
              {objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                  <span className="text-cyan-500 mt-0.5">{i + 1}.</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hint section */}
          <div className="p-4 border-b border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">{t('pcb.hints')}</h3>
              <span className="text-xs text-zinc-500">{hintsUsed}/{maxHints} {t('pcb.hintsUsed')}</span>
            </div>
            {hint && (
              <div className="bg-yellow-950/50 border border-yellow-800/50 rounded p-2.5 text-yellow-200 text-xs mb-2">
                {hint}
              </div>
            )}
            <button
              onClick={handleHint}
              disabled={hintsUsed >= maxHints}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-yellow-800 hover:bg-yellow-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded text-xs font-medium transition-colors touch-manipulation"
            >
              <HelpCircle size={14} /> {t('pcb.getHint')}
            </button>
          </div>

          {/* Test button */}
          <div className="p-4">
            <button
              onClick={handleRunTest}
              disabled={!canRunTest}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-700 hover:bg-green-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded font-semibold transition-colors touch-manipulation"
            >
              <Play size={18} /> {t('pcb.runPostRepairTest')}
            </button>
            {testResult && (
              <div className={`mt-3 p-3 rounded border ${
                testResult.passed ? 'bg-green-950/50 border-green-700' : 'bg-red-950/50 border-red-700'
              }`}>
                <div className={`flex items-center gap-2 mb-2 ${testResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {testResult.passed ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  <span className="font-semibold text-sm">{testResult.passed ? t('pcb.repairSuccessful') : t('pcb.repairFailed')}</span>
                </div>
                <ul className="space-y-1">
                  {testResult.details.map((d, i) => (
                    <li key={i} className="text-xs text-zinc-300">{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Home confirmation dialog */}
      {showHomeConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowHomeConfirm(false)}>
          <div className="bg-zinc-900 border border-cyan-700 rounded-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <Home size={24} className="text-cyan-400" />
              <h3 className="text-white text-lg font-semibold">{t('pcb.leaveRepairTitle')}</h3>
            </div>
            <p className="text-zinc-400 text-sm mb-5">
              {t('pcb.leaveRepairBody')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { play('click'); setShowHomeConfirm(false); }}
                className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                {t('pcb.stay')}
              </button>
              <button
                onClick={handleHomeConfirm}
                className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                {t('pcb.goHome')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Install modal */}
      {showInstallModal && (
        <InstallModal
          target={showInstallModal}
          onInstall={handleInstall}
          onClose={() => setShowInstallModal(null)}
        />
      )}
    </div>
  );
}

function ToolButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all touch-manipulation ${
        active ? 'bg-cyan-600 text-white' : 'bg-zinc-800/90 text-zinc-400 hover:bg-zinc-700'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

// ─── Realistic PCB Rendering ───────────────────────────────────────────────
// Procedural SVG that simulates a real PCB with solder mask, copper traces,
// solder pads, through-hole plating, silkscreen, and 3D-looking components.

const PCB_COLORS = {
  substrate: '#202b27',
  solderMask: '#456657',
  solderMaskDark: '#263a33',
  copper: '#ad7940',
  copperBright: '#d7a864',
  copperHighlight: '#f0c98d',
  pad: '#c99b5b',
  padInner: '#805c36',
  solder: '#aeb2a7',
  solderHighlight: '#e2e3d9',
  silk: '#e5e2d4',
  silkDim: '#c2c3b5',
  via: '#a7a99d',
  viaInner: '#26312d',
  groundTrace: '#79947c',
  powerTrace: '#c58d4d',
  signalTrace: '#b79b6c',
};

// L-etched trace path between two points with optional bend
function tracePath(x1: number, y1: number, x2: number, y2: number): string {
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
}

function PCBView({
  circuit,
  selectedComponent,
  onComponentClick,
  onTestPointClick,
  redProbe,
  blackProbe,
  probeSelecting,
}: {
  circuit: CircuitDefinition;
  selectedComponent: CircuitComponent | null;
  onComponentClick: (comp: CircuitComponent) => void;
  onTestPointClick: (tp: TestPoint) => void;
  redProbe: TestPoint | null;
  blackProbe: TestPoint | null;
  probeSelecting: ProbeColor | null;
}) {
  const highlightedNets = new Set<string>();
  if (selectedComponent) {
    circuit.nets.forEach((net) => {
      if (net.components.includes(selectedComponent.id)) {
        highlightedNets.add(net.name);
      }
    });
  }

  const isProbeMode = probeSelecting !== null;
  const probeColor = probeSelecting === 'red' ? '#ff4444' : '#aaa';
  const probeGlow = probeSelecting === 'red' ? '#ff0000' : '#666';

  return (
    <svg
      viewBox="0 0 100 60"
      className="w-full h-full max-w-[800px] max-h-[500px]"
      style={{ touchAction: 'none' }}
    >
      <defs>
        {/* Solder mask gradient for depth */}
        <radialGradient id="maskGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor={PCB_COLORS.solderMask} />
          <stop offset="100%" stopColor={PCB_COLORS.solderMaskDark} />
        </radialGradient>
        {/* Copper trace gradient */}
        <linearGradient id="copperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={PCB_COLORS.copperBright} />
          <stop offset="50%" stopColor={PCB_COLORS.copper} />
          <stop offset="100%" stopColor={PCB_COLORS.padInner} />
        </linearGradient>
        {/* Solder pad radial gradient */}
        <radialGradient id="padGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor={PCB_COLORS.solderHighlight} />
          <stop offset="60%" stopColor={PCB_COLORS.pad} />
          <stop offset="100%" stopColor={PCB_COLORS.padInner} />
        </radialGradient>
        {/* Solder dome gradient */}
        <radialGradient id="solderGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="40%" stopColor={PCB_COLORS.solder} />
          <stop offset="100%" stopColor="#666" />
        </radialGradient>
        {/* Via gradient */}
        <radialGradient id="viaGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#bbb" />
          <stop offset="60%" stopColor={PCB_COLORS.via} />
          <stop offset="100%" stopColor={PCB_COLORS.viaInner} />
        </radialGradient>
        {/* Resistor body gradient */}
        <linearGradient id="resBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0c08a" />
          <stop offset="50%" stopColor="#c9a06a" />
          <stop offset="100%" stopColor="#9a7040" />
        </linearGradient>
        {/* IC body gradient */}
        <linearGradient id="icBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#333" />
          <stop offset="50%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        {/* Capacitor body gradient */}
        <linearGradient id="capBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="50%" stopColor="#222" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
        {/* Metal tab gradient for regulators */}
        <linearGradient id="metalTabGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ccc" />
          <stop offset="50%" stopColor="#999" />
          <stop offset="100%" stopColor="#666" />
        </linearGradient>
        {/* Glow filter for highlighted traces */}
        <filter id="traceGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── PCB substrate with visible laminate edge and solder mask ── */}
      <rect x="0.8" y="0.8" width="98.4" height="58.4" rx="1.8" fill={PCB_COLORS.substrate} stroke="#95865f" strokeWidth="0.28" />
      <rect x="1.5" y="1.5" width="97" height="57" rx="1" fill="#273e35" />
      <rect x="1.5" y="1.5" width="97" height="57" rx="1" fill="url(#maskGrad)" />

      {/* FR4 fiber texture dots */}
      <g opacity="0.11" className="pointer-events-none">
        {Array.from({ length: 92 }).map((_, i) => {
          const px = 3 + (i * 7.31) % 94;
          const py = 3 + (i * 4.73) % 54;
          return <circle key={`tex-${i}`} cx={px} cy={py} r="0.18" fill={i % 3 === 0 ? '#c3c3a1' : '#131d19'} />;
        })}
      </g>
      <g opacity="0.15" className="pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => {
          const y = 5 + i * 3.3;
          return <path key={`fiber-${i}`} d={`M 3 ${y} Q 50 ${y + 0.45} 97 ${y - 0.25}`} fill="none" stroke="#d3ceb0" strokeWidth="0.09" />;
        })}
      </g>

      {/* ── Mounting holes (corners) ── */}
      {[[4, 4], [96, 4], [4, 56], [96, 56]].map(([mhx, mhy], i) => (
        <g key={`mh-${i}`} className="pointer-events-none">
          <circle cx={mhx} cy={mhy} r="1.8" fill="#111916" stroke="#b3a27a" strokeWidth="0.22" />
          <circle cx={mhx} cy={mhy} r="1.2" fill="url(#viaGrad)" />
          <circle cx={mhx} cy={mhy} r="0.7" fill="#041510" />
        </g>
      ))}

      {/* ── Copper pour (ground plane outline) ── */}
      <rect x="3.5" y="3.5" width="93" height="53" rx="0.8" fill="none" stroke={PCB_COLORS.copper} strokeWidth="0.18" opacity="0.38" />

      {/* ── Silkscreen border and labels ── */}
      <rect x="3" y="3" width="94" height="54" rx="0.5" fill="none" stroke={PCB_COLORS.silk} strokeWidth="0.1" opacity="0.3" />
      <text x="50" y="57.5" fontSize="1.5" fill={PCB_COLORS.silkDim} textAnchor="middle" opacity="0.4" className="pointer-events-none select-none">
        {circuit.name}
      </text>
      <text x="6" y="57.5" fontSize="1" fill={PCB_COLORS.silkDim} opacity="0.3" className="pointer-events-none select-none">REV 1.0</text>

      {/* ── Copper traces ── */}
      <TraceLayer circuit={circuit} highlightedNets={highlightedNets} />

      {/* ── Solder pads for each component ── */}
      {circuit.components.map((comp) => (
        <SolderPads key={`pad-${comp.id}`} comp={comp} />
      ))}

      {/* ── Vias (decorative through-hole connections along traces) ── */}
      <g className="pointer-events-none">
        {circuit.nets.flatMap((net, ni) => {
          const tps = circuit.testPoints.filter((tp) => tp.net === net.name);
          return tps.slice(0, -1).map((tp, i) => {
            const next = tps[i + 1];
            const vx = (tp.x + next.x) / 2;
            const vy = (tp.y * 0.6 + next.y * 0.6) / 2;
            return (
              <g key={`via-${ni}-${i}`}>
                <circle cx={vx} cy={vy} r="0.5" fill="url(#viaGrad)" />
                <circle cx={vx} cy={vy} r="0.2" fill={PCB_COLORS.viaInner} />
              </g>
            );
          });
        })}
      </g>

      {/* ── Test points ── */}
      {circuit.testPoints.map((tp) => {
        const isRedProbe = redProbe?.id === tp.id;
        const isBlackProbe = blackProbe?.id === tp.id;
        const isProbed = isRedProbe || isBlackProbe;
        const tpFill = isRedProbe ? '#ff4444' : isBlackProbe ? '#888' : '#e0e0e0';

        return (
          <g key={tp.id}>
            {/* Probe selection highlight ring */}
            {isProbeMode && (
              <circle cx={tp.x} cy={tp.y * 0.6} r="3.5" fill="none" stroke={probeColor} strokeWidth="0.2" opacity="0.6" className="pointer-events-none animate-pulse" />
            )}
            {/* Metallic test point pad */}
            <circle cx={tp.x} cy={tp.y * 0.6} r={isProbeMode ? 2.0 : 1.6} fill="url(#padGrad)" stroke="#555" strokeWidth="0.15" />
            {/* Inner via hole */}
            <circle cx={tp.x} cy={tp.y * 0.6} r={isProbed ? 0.8 : 0.6} fill={tpFill} stroke="#333" strokeWidth="0.1" />
            {/* Probe connection ring */}
            {isProbed && (
              <circle cx={tp.x} cy={tp.y * 0.6} r="2.8" fill="none" stroke={isRedProbe ? '#ff0000' : '#fff'} strokeWidth="0.25" opacity="0.7" className="pointer-events-none" />
            )}
            {/* Clickable invisible circle */}
            <circle
              cx={tp.x} cy={tp.y * 0.6} r="3"
              fill="transparent"
              className={isProbeMode ? 'cursor-pointer' : ''}
              onClick={() => isProbeMode && onTestPointClick(tp)}
            />
            {/* Silkscreen label */}
            <text x={tp.x} y={tp.y * 0.6 - 2.2} fontSize="1.1" fill={PCB_COLORS.silk} textAnchor="middle" className="pointer-events-none select-none font-semibold">
              {tp.label}
            </text>
          </g>
        );
      })}

      {/* ── Components ── */}
      {circuit.components.map((comp) => (
        <ComponentShape
          key={comp.id}
          comp={comp}
          selected={selectedComponent?.id === comp.id}
          onClick={() => onComponentClick(comp)}
        />
      ))}
    </svg>
  );
}

// ─── Trace Layer: copper traces with L-bends and glow on highlight ────────
function TraceLayer({ circuit, highlightedNets }: { circuit: CircuitDefinition; highlightedNets: Set<string> }) {
  const traces: ReactElement[] = [];

  circuit.nets.forEach((net) => {
    const isGround = net.name.toLowerCase().includes('gnd') || net.name.toLowerCase().includes('ground');
    const isPower = net.name.toLowerCase().includes('vin') || net.name.toLowerCase().includes('vcc') || net.name.toLowerCase().includes('power');
    const baseColor = isGround ? PCB_COLORS.groundTrace : isPower ? PCB_COLORS.powerTrace : PCB_COLORS.signalTrace;
    const traceWidth = isPower ? 0.55 : isGround ? 0.5 : 0.4;
    const isHighlighted = highlightedNets.has(net.name);

    // Test point to test point traces (main signal paths)
    const tps = circuit.testPoints.filter((tp) => tp.net === net.name);
    for (let i = 0; i < tps.length - 1; i++) {
      const x1 = tps[i].x, y1 = tps[i].y * 0.6;
      const x2 = tps[i + 1].x, y2 = tps[i + 1].y * 0.6;
      traces.push(
        <path
          key={`${net.name}-tp-${i}`}
          d={tracePath(x1, y1, x2, y2)}
          fill="none"
          stroke={isHighlighted ? '#22ffff' : baseColor}
          strokeWidth={isHighlighted ? traceWidth + 0.2 : traceWidth}
          opacity={isHighlighted ? 0.95 : 0.55}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={isHighlighted ? 'url(#traceGlow)' : undefined}
        />
      );
    }

    // Component to component traces
    const netComps = circuit.components.filter((c) => net.components.includes(c.id));
    for (let i = 0; i < netComps.length - 1; i++) {
      const x1 = netComps[i].x, y1 = netComps[i].y * 0.6;
      const x2 = netComps[i + 1].x, y2 = netComps[i + 1].y * 0.6;
      traces.push(
        <path
          key={`${net.name}-comp-${i}`}
          d={tracePath(x1, y1, x2, y2)}
          fill="none"
          stroke={isHighlighted ? '#22ffff' : baseColor}
          strokeWidth={isHighlighted ? traceWidth + 0.15 : traceWidth * 0.8}
          opacity={isHighlighted ? 0.8 : 0.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={isHighlighted ? 'url(#traceGlow)' : undefined}
        />
      );
    }

    // Component to test point traces
    if (tps.length > 0 && netComps.length > 0) {
      const tp = tps[0];
      const tpX = tp.x, tpY = tp.y * 0.6;
      netComps.forEach((comp, ci) => {
        const cx = comp.x, cy = comp.y * 0.6;
        traces.push(
          <path
            key={`${net.name}-ctp-${ci}`}
            d={tracePath(cx, cy, tpX, tpY)}
            fill="none"
            stroke={isHighlighted ? '#22ffff' : baseColor}
            strokeWidth={isHighlighted ? traceWidth + 0.1 : traceWidth * 0.7}
            opacity={isHighlighted ? 0.75 : 0.35}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      });
    }
  });

  return <g>{traces}</g>;
}

// ─── Solder Pads: realistic through-hole pads with annular ring ────────────
function SolderPads({ comp }: { comp: CircuitComponent }) {
  const x = comp.x;
  const y = comp.y * 0.6;
  const s = comp.scale;

  // Determine pad positions based on component type
  let pads: [number, number][] = [];
  switch (comp.type) {
    case 'resistor':
    case 'diode':
    case 'fuse':
      pads = [[x - 3 * s, y], [x + 3 * s, y]];
      break;
    case 'capacitor':
      pads = [[x - 1.5 * s, y + 2.5 * s], [x + 1.5 * s, y + 2.5 * s]];
      break;
    case 'mosfet':
      pads = [[x - 1.5 * s, y + 3 * s], [x, y + 3 * s], [x + 1.5 * s, y + 3 * s]];
      break;
    case 'regulator':
      pads = [[x - 1.5 * s, y + 3 * s], [x, y + 3 * s], [x + 1.5 * s, y + 3 * s]];
      break;
    case 'ic':
      pads = Array.from({ length: 8 }).map((_, i) => [
        i < 4 ? x - 3 * s : x + 3 * s,
        y - 2 * s + (i % 4) * 1.3 * s,
      ]);
      break;
    case 'connector':
      pads = [[x - 1 * s, y + 1.5 * s], [x + 1 * s, y + 1.5 * s]];
      break;
    case 'led':
      pads = [[x - 1.15 * s, y + 2.5 * s], [x + 1.15 * s, y + 2.5 * s]];
      break;
    case 'testpoint':
      pads = [[x, y]];
      break;
    case 'inductor':
      pads = [[x - 1.5 * s, y + 2 * s], [x + 1.5 * s, y + 2 * s]];
      break;
    default:
      pads = [[x - 2 * s, y], [x + 2 * s, y]];
  }

  return (
    <g className="pointer-events-none">
      {pads.map(([px, py], i) => (
        <g key={`pad-${i}`}>
          {/* Annular ring (copper around hole) */}
          <circle cx={px} cy={py} r="0.9" fill="url(#padGrad)" />
          {/* Through-hole (dark center) */}
          <circle cx={px} cy={py} r="0.35" fill="#041510" />
          {/* Solder dome if component present */}
          {!comp.removed && (
            <circle cx={px} cy={py} r="0.6" fill="url(#solderGrad)" opacity="0.85" />
          )}
        </g>
      ))}
    </g>
  );
}

// ─── Component Shapes: 3D-looking realistic components ─────────────────────
function ComponentShape({ comp, selected, onClick }: { comp: CircuitComponent; selected: boolean; onClick: () => void }) {
  const { t } = useTranslation();
  const x = comp.x;
  const y = comp.y * 0.6;
  const s = comp.scale;
  const isFaulty = comp.fault !== 'none' && !comp.replaced;
  const isRemoved = comp.removed;
  const isReplaced = comp.replaced;

  let body: ReactElement = <rect x={x - 3} y={y - 1.5} width="6" height="3" rx="0.3" fill="#8B4513" />;
  const label = comp.refDes;

  switch (comp.type) {
    case 'resistor':
      body = (
        <g>
          {/* Metal leads */}
          <line x1={x - 4 * s} y1={y} x2={x - 3 * s} y2={y} stroke="#aaa" strokeWidth="0.15" />
          <line x1={x + 3 * s} y1={y} x2={x + 4 * s} y2={y} stroke="#aaa" strokeWidth="0.15" />
          {/* Cylindrical axial body */}
          <rect x={x - 3 * s} y={y - 1.1 * s} width={6 * s} height={2.2 * s} rx={1.1 * s} fill="url(#resBodyGrad)" stroke="#6a4a20" strokeWidth="0.08" />
          {/* Color bands */}
          <rect x={x - 2 * s} y={y - 1.1 * s} width={0.35 * s} height={2.2 * s} fill="#8B4513" />
          <rect x={x - 1.2 * s} y={y - 1.1 * s} width={0.35 * s} height={2.2 * s} fill="#c0392b" />
          <rect x={x - 0.4 * s} y={y - 1.1 * s} width={0.35 * s} height={2.2 * s} fill="#222" />
          <rect x={x + 1.5 * s} y={y - 1.1 * s} width={0.3 * s} height={2.2 * s} fill="#daa520" />
          {/* Highlight strip */}
          <rect x={x - 2.8 * s} y={y - 0.9 * s} width={5.6 * s} height={0.3 * s} rx="0.15" fill="#fff" opacity="0.15" />
        </g>
      );
      break;
    case 'capacitor':
      body = (
        <g>
          {/* Leads */}
          <line x1={x - 1.5 * s} y1={y + 2.5 * s} x2={x - 1.5 * s} y2={y + 3.5 * s} stroke="#aaa" strokeWidth="0.12" />
          <line x1={x + 1.5 * s} y1={y + 2.5 * s} x2={x + 1.5 * s} y2={y + 3.5 * s} stroke="#aaa" strokeWidth="0.12" />
          {/* Cylindrical electrolytic body */}
          <rect x={x - 2 * s} y={y - 2.5 * s} width={4 * s} height={5 * s} rx={2 * s} fill="url(#capBodyGrad)" stroke="#111" strokeWidth="0.1" />
          {/* Top vent cross */}
          <line x1={x - 1.2 * s} y1={y - 2 * s} x2={x + 1.2 * s} y2={y - 2 * s} stroke="#555" strokeWidth="0.08" opacity="0.5" />
          <line x1={x} y1={y - 2.8 * s} x2={x} y2={y - 1.2 * s} stroke="#555" strokeWidth="0.08" opacity="0.5" />
          {/* Polarity stripe (negative side) */}
          <rect x={x - 2 * s} y={y - 1.5 * s} width={0.4 * s} height={3 * s} fill="#e0e0e0" opacity="0.25" />
          <text x={x - 1.4 * s} y={y - 0.5 * s} fontSize="0.7" fill="#ddd" textAnchor="middle" className="pointer-events-none select-none">-</text>
          {/* Value label */}
          <text x={x} y={y + 0.8 * s} fontSize="0.9" fill="#ccc" textAnchor="middle" className="pointer-events-none select-none">{comp.value}</text>
          {/* Highlight */}
          <rect x={x - 1.8 * s} y={y - 2.3 * s} width={0.5 * s} height={4.6 * s} rx="0.25" fill="#fff" opacity="0.08" />
        </g>
      );
      break;
    case 'diode':
      body = (
        <g>
          {/* Leads */}
          <line x1={x - 3.5 * s} y1={y} x2={x - 2.5 * s} y2={y} stroke="#aaa" strokeWidth="0.12" />
          <line x1={x + 2.5 * s} y1={y} x2={x + 3.5 * s} y2={y} stroke="#aaa" strokeWidth="0.12" />
          {/* Glass/black cylindrical body */}
          <rect x={x - 2.5 * s} y={y - 0.9 * s} width={5 * s} height={1.8 * s} rx={0.9 * s} fill="#111" stroke="#333" strokeWidth="0.08" />
          {/* Glass shine */}
          <rect x={x - 2.2 * s} y={y - 0.7 * s} width={4.6 * s} height={0.3 * s} rx="0.15" fill="#fff" opacity="0.1" />
          {/* Polarity band (cathode) */}
          <rect x={x + 1.5 * s} y={y - 0.9 * s} width={0.5 * s} height={1.8 * s} fill="#ddd" opacity="0.8" />
        </g>
      );
      break;
    case 'fuse':
      body = (
        <g>
          {/* Leads */}
          <line x1={x - 4 * s} y1={y} x2={x - 3 * s} y2={y} stroke="#aaa" strokeWidth="0.12" />
          <line x1={x + 3 * s} y1={y} x2={x + 4 * s} y2={y} stroke="#aaa" strokeWidth="0.12" />
          {/* Glass tube body */}
          <rect x={x - 3 * s} y={y - 1.1 * s} width={6 * s} height={2.2 * s} rx={1.1 * s} fill="#eee" stroke="#888" strokeWidth="0.08" opacity="0.85" />
          {/* Metal end caps */}
          <rect x={x - 3 * s} y={y - 1.1 * s} width={0.5 * s} height={2.2 * s} rx="0.25" fill="url(#metalTabGrad)" />
          <rect x={x + 2.5 * s} y={y - 1.1 * s} width={0.5 * s} height={2.2 * s} rx="0.25" fill="url(#metalTabGrad)" />
          {/* Fuse wire inside */}
          <line x1={x - 2.5 * s} y1={y} x2={x + 2.5 * s} y2={y} stroke="#c0392b" strokeWidth="0.15" opacity="0.6" />
        </g>
      );
      break;
    case 'mosfet':
      body = (
        <g>
          {/* Leads (3 pins) */}
          {[-1.5, 0, 1.5].map((off, i) => (
            <line key={i} x1={x + off * s} y1={y + 3 * s} x2={x + off * s} y2={y + 4 * s} stroke="#aaa" strokeWidth="0.1" />
          ))}
          {/* TO-220 black plastic body */}
          <rect x={x - 2.5 * s} y={y - 3 * s} width={5 * s} height={6.2 * s} rx={0.15 * s} fill="url(#icBodyGrad)" stroke="#000" strokeWidth="0.08" />
          {/* Metal tab on top */}
          <rect x={x - 2.8 * s} y={y - 3.2 * s} width={5.6 * s} height={1 * s} rx="0.1" fill="url(#metalTabGrad)" />
          {/* Mounting hole */}
          <circle cx={x} cy={y - 2.7 * s} r="0.35" fill="#222" stroke="#555" strokeWidth="0.06" />
          {/* Label */}
          <text x={x} y={y + 0.5 * s} fontSize="0.9" fill="#ccc" textAnchor="middle" className="pointer-events-none select-none">{comp.value}</text>
          {/* Highlight */}
          <rect x={x - 2.3 * s} y={y - 2.8 * s} width={4.6 * s} height={0.3 * s} fill="#fff" opacity="0.08" />
        </g>
      );
      break;
    case 'regulator':
      body = (
        <g>
          {/* Leads */}
          {[-1.5, 0, 1.5].map((off, i) => (
            <line key={i} x1={x + off * s} y1={y + 3 * s} x2={x + off * s} y2={y + 4 * s} stroke="#aaa" strokeWidth="0.1" />
          ))}
          {/* TO-220 body */}
          <rect x={x - 2 * s} y={y - 3 * s} width={4 * s} height={6.2 * s} rx={0.15 * s} fill="url(#icBodyGrad)" stroke="#000" strokeWidth="0.08" />
          {/* Metal heatsink tab */}
          <rect x={x - 2.5 * s} y={y - 3.2 * s} width={5 * s} height={1.2 * s} rx="0.1" fill="url(#metalTabGrad)" />
          <circle cx={x} cy={y - 2.6 * s} r="0.3" fill="#333" />
          {/* Label */}
          <text x={x} y={y + 0.5 * s} fontSize="0.8" fill="#ccc" textAnchor="middle" className="pointer-events-none select-none">{comp.value}</text>
        </g>
      );
      break;
    case 'ic':
      body = (
        <g>
          {/* DIP pins */}
          {Array.from({ length: 7 }).map((_, i) => (
            <g key={i}>
              <line x1={x - 3 * s} y1={y - 2 * s + i * 0.7 * s} x2={x - 3.5 * s} y2={y - 2 * s + i * 0.7 * s} stroke="#aaa" strokeWidth="0.08" />
              <line x1={x + 3 * s} y1={y - 2 * s + i * 0.7 * s} x2={x + 3.5 * s} y2={y - 2 * s + i * 0.7 * s} stroke="#aaa" strokeWidth="0.08" />
            </g>
          ))}
          {/* Black DIP body */}
          <rect x={x - 3 * s} y={y - 2.5 * s} width={6 * s} height={5 * s} rx="0.2" fill="url(#icBodyGrad)" stroke="#000" strokeWidth="0.1" />
          {/* Pin 1 dot */}
          <circle cx={x - 2.2 * s} cy={y - 1.7 * s} r="0.25" fill="#555" />
          {/* Notch */}
          <path d={`M ${x - 0.4 * s} ${y - 2.5 * s} Q ${x} ${y - 2.1 * s} ${x + 0.4 * s} ${y - 2.5 * s}`} fill="#000" />
          {/* Label */}
          <text x={x} y={y + 0.3 * s} fontSize="0.9" fill="#ccc" textAnchor="middle" className="pointer-events-none select-none">{comp.value}</text>
          {/* Highlight */}
          <rect x={x - 2.8 * s} y={y - 2.3 * s} width={5.6 * s} height="0.25" fill="#fff" opacity="0.08" />
        </g>
      );
      break;
    case 'connector':
      body = (
        <g>
          {/* Pins */}
          {[-1, 0, 1].map((off, i) => (
            <rect key={i} x={x + off * s - 0.15} y={y - 1.5 * s} width="0.3" height="3 * s" fill="url(#metalTabGrad)" />
          ))}
          {/* Plastic housing */}
          <rect x={x - 2 * s} y={y - 1.8 * s} width={4 * s} height={3.6 * s} rx="0.15" fill="#1a2a3a" stroke="#0a1a2a" strokeWidth="0.08" />
          {/* Pin holes */}
          {[-1, 0, 1].map((off, i) => (
            <rect key={i} x={x + off * s - 0.25} y={y - 1.5 * s} width="0.5" height={2.5 * s} rx="0.1" fill="#000" />
          ))}
        </g>
      );
      break;
    case 'led':
      body = (
        <g>
          <line x1={x - 1.15 * s} y1={y + 1.4 * s} x2={x - 1.15 * s} y2={y + 3.1 * s} stroke="#c5c1ae" strokeWidth="0.14" />
          <line x1={x + 1.15 * s} y1={y + 1.4 * s} x2={x + 1.15 * s} y2={y + 2.6 * s} stroke="#c5c1ae" strokeWidth="0.14" />
          <circle cx={x} cy={y} r={1.8 * s} fill="#a53d37" stroke="#e69278" strokeWidth="0.15" opacity="0.96" />
          <path d={`M ${x - 1.25 * s} ${y - 0.9 * s} Q ${x} ${y - 2.1 * s} ${x + 0.55 * s} ${y - 1.7 * s}`} fill="none" stroke="#ffd1b2" strokeWidth="0.2" opacity="0.8" />
          <circle cx={x - 0.55 * s} cy={y - 0.65 * s} r={0.35 * s} fill="#fff0d8" opacity="0.58" />
        </g>
      );
      break;
    case 'testpoint':
      body = (
        <g>
          <circle cx={x} cy={y} r={1.25 * s} fill="url(#padGrad)" stroke="#e2d3a8" strokeWidth="0.16" />
          <circle cx={x} cy={y} r={0.52 * s} fill="#27312c" />
          <path d={`M ${x - 0.6 * s} ${y - 0.3 * s} Q ${x} ${y - 1.1 * s} ${x + 0.6 * s} ${y - 0.3 * s}`} fill="none" stroke="#fff1cc" strokeWidth="0.15" opacity="0.65" />
        </g>
      );
      break;
    case 'inductor':
      body = (
        <g>
          {/* Leads */}
          <line x1={x - 1.5 * s} y1={y + 2 * s} x2={x - 1.5 * s} y2={y + 3 * s} stroke="#aaa" strokeWidth="0.12" />
          <line x1={x + 1.5 * s} y1={y + 2 * s} x2={x + 1.5 * s} y2={y + 3 * s} stroke="#aaa" strokeWidth="0.12" />
          {/* Coil windings */}
          {Array.from({ length: 5 }).map((_, i) => {
            const r = 1.8 * s;
            const cxOff = -1.4 * s + i * 0.7 * s;
            return (
              <ellipse key={i} cx={x + cxOff} cy={y} rx={r * 0.45} ry={r} fill="none" stroke="#c9a06a" strokeWidth="0.18" />
            );
          })}
          {/* Ferrite core background */}
          <rect x={x - 1.8 * s} y={y - 1.2 * s} width={3.6 * s} height={2.4 * s} rx="0.3" fill="#2a1a0a" opacity="0.3" />
        </g>
      );
      break;
    default:
      body = <rect x={x - 2} y={y - 1} width="4" height="2" rx="0.3" fill="#444" />;
  }

  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      opacity={isRemoved ? 0.12 : 1}
    >
      {/* Selection highlight - rounded rect with glow */}
      {selected && (
        <rect
          x={x - 4.5 * s} y={y - 4.5 * s}
          width={9 * s} height={9 * s}
          rx="0.8"
          fill="none"
          stroke="#0ff" strokeWidth="0.25"
          className="animate-pulse pointer-events-none"
          filter="url(#traceGlow)"
        />
      )}
      {/* Fault indicator - pulsing red ring */}
      {isFaulty && !isRemoved && (
        <circle cx={x} cy={y} r={4 * s} fill="none" stroke="#f00" strokeWidth="0.2" opacity="0.5" className="pointer-events-none">
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="r" values={`${4 * s};${4.5 * s};${4 * s}`} dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Replaced indicator - small green check dot */}
      {isReplaced && (
        <g className="pointer-events-none">
          <circle cx={x + 3.5 * s} cy={y - 3 * s} r="0.9" fill="#0a0" opacity="0.8" />
          <path d={`M ${x + 3 * s} ${y - 3 * s} L ${x + 3.4 * s} ${y - 2.6 * s} L ${x + 4 * s} ${y - 3.3 * s}`} fill="none" stroke="#fff" strokeWidth="0.15" />
        </g>
      )}
      {isRemoved && (
        <g className="pointer-events-none">
          <text x={x} y={y + 0.5} fontSize="1.2" fill="#f80" textAnchor="middle" className="select-none font-semibold">{t('pcb.removedTag')}</text>
          {/* Empty pad outline */}
          <rect x={x - 3 * s} y={y - 1.5 * s} width={6 * s} height={3 * s} rx="0.3" fill="none" stroke="#555" strokeWidth="0.1" strokeDasharray="0.3,0.3" />
        </g>
      )}
      <g transform={`rotate(${comp.rotation} ${x} ${y})`} className="pointer-events-none">
        {body}
      </g>
      {/* Reference label - silkscreen style */}
      <text
        x={x} y={y + 4.5 * s}
        fontSize="1.2" fill={PCB_COLORS.silk} textAnchor="middle"
        className="pointer-events-none select-none font-semibold"
      >
        {label}
      </text>
    </g>
  );
}

function SchematicView({ circuit, onComponentClick, selectedId }: { circuit: CircuitDefinition; onComponentClick: (c: CircuitComponent) => void; selectedId?: string }) {
  return (
    <svg viewBox="0 0 100 60" className="w-full h-full max-w-[800px] max-h-[500px]">
      <rect x="0" y="0" width="100" height="60" fill="#1a1a1a" />
      {circuit.components.map((comp, i) => {
        const x = 10 + i * 12;
        const y = 30;
        return (
          <g key={comp.id} onClick={() => onComponentClick(comp)} className="cursor-pointer">
            <rect x={x - 4} y={y - 3} width="8" height="6" rx="0.5"
              fill={selectedId === comp.id ? '#0ff' : '#222'}
              stroke="#666" strokeWidth="0.2" />
            <text x={x} y={y} fontSize="1.5" fill="#fff" textAnchor="middle" className="pointer-events-none select-none">{comp.refDes}</text>
            <text x={x} y={y + 5} fontSize="1" fill="#aaa" textAnchor="middle" className="pointer-events-none select-none">{comp.value}</text>
            {i < circuit.components.length - 1 && (
              <line x1={x + 4} y1={y} x2={x + 8} y2={y} stroke="#888" strokeWidth="0.3" />
            )}
          </g>
        );
      })}
      <text x="5" y="30" fontSize="2" fill="#4af" textAnchor="middle" className="select-none">IN</text>
      <text x="95" y="30" fontSize="2" fill="#4fa" textAnchor="middle" className="select-none">OUT</text>
    </svg>
  );
}

function InstallModal({ target, onInstall, onClose }: { target: CircuitComponent; onInstall: (refDes: string) => void; onClose: () => void }) {
  const { state, dispatch } = useGameContext();
  const { t } = useTranslation();
  const compatible = state.inventory.filter(
    (item) => item.quantity > 0 && item.type === target.type && Math.abs(item.nominalValue - target.nominalValue) < 0.01,
  );
  const incompatible = state.inventory.filter(
    (item) => item.quantity > 0 && item.type === target.type && Math.abs(item.nominalValue - target.nominalValue) >= 0.01,
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-white text-lg font-semibold mb-1">{t('pcb.installReplacement')}</h3>
        <p className="text-zinc-400 text-sm mb-4">
          {t('pcb.selectReplacement')} {target.refDes} ({target.value} {target.type})
        </p>

        {compatible.length > 0 ? (
          <>
            <h4 className="text-green-400 text-xs uppercase tracking-wider mb-2">{t('pcb.compatibleParts')}</h4>
            <div className="space-y-2 mb-4">
              {compatible.map((item) => (
                <button
                  key={item.refDes}
                  onClick={() => {
                    onInstall(item.refDes);
                    dispatch({ type: 'USE_COMPONENT', refDes: item.refDes, componentType: item.type, nominalValue: item.nominalValue, value: item.value, unit: item.unit });
                  }}
                  className="w-full flex items-center justify-between bg-zinc-800 hover:bg-green-900/50 border border-zinc-700 hover:border-green-600 rounded-lg p-3 transition-all"
                >
                  <div className="text-left">
                    <div className="text-white font-mono text-sm">{item.value}</div>
                    <div className="text-zinc-500 text-xs">{item.type} · Qty: {item.quantity}</div>
                  </div>
                  <Package size={20} className="text-green-400" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-red-950/50 border border-red-800 rounded-lg p-3 text-red-300 text-sm mb-4">
            {t('pcb.noCompatibleParts')} You need a {target.value} {target.type}.
          </div>
        )}

        {incompatible.length > 0 && (
          <>
            <h4 className="text-zinc-500 text-xs uppercase tracking-wider mb-2">{t('pcb.incompatibleParts')}</h4>
            <div className="space-y-1">
              {incompatible.map((item) => (
                <div key={item.refDes} className="flex items-center justify-between bg-zinc-800/50 rounded p-2 opacity-50">
                  <span className="text-zinc-400 font-mono text-xs">{item.value} {item.type}</span>
                  <XCircle size={14} className="text-red-500" />
                </div>
              ))}
            </div>
          </>
        )}

        <button onClick={onClose} className="w-full mt-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-sm transition-colors">
          {t('menu.cancel')}
        </button>
      </div>
    </div>
  );
}

// Re-import useGame for the modal
import { useGame as useGameContext } from '@/state/GameContext';
