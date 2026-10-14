import { useState } from 'react';
import { useGame } from '@/state/GameContext';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';
import {
  Cpu, Play, RotateCcw, Settings, Volume2, VolumeX,
  Wrench, Zap, Trophy, TrendingUp, GraduationCap, Library,
  ClipboardList, BookOpen, Award, Lock, CheckCircle2, Home,
} from '@/lucide-icons';

interface MainMenuProps {
  onContinue: () => void;
  onSettings: () => void;
  onOpenAcademy: () => void;
  onOpenLibrary: () => void;
  onOpenMissions: () => void;
  onOpenWorkshop: () => void;
  onOpenGuidedRepair: () => void;
  onOpenProgress: () => void;
}

export default function MainMenu({
  onContinue, onSettings, onOpenAcademy, onOpenLibrary,
  onOpenMissions, onOpenWorkshop, onOpenGuidedRepair, onOpenProgress,
}: MainMenuProps) {
  const { state, hasSave, resetProgress } = useGame();
  const { play } = useAudio();
  const { t } = useTranslation();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const hasProgress = state.completedMissions.length > 0 || state.level > 1 || state.academy.completedLessons.length > 0;
  const completedLessons = state.academy.completedLessons.length;
  const totalLessons = 8;
  const allLessonsDone = completedLessons >= totalLessons;
  const canRepair = state.guidedRepairCompleted || (state.completedMissions.length > 0);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 overflow-y-auto relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-md w-full py-4">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <div className="relative">
              <Cpu size={64} className="text-cyan-400" strokeWidth={1.2} />
              <div className="absolute inset-0 blur-2xl bg-cyan-500/30 rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {t('app.title')}
          </h1>
          <h2 className="text-lg sm:text-xl font-light text-cyan-400 tracking-widest uppercase">
            {t('app.subtitle')}
          </h2>
          <p className="text-zinc-500 text-xs mt-2 max-w-xs mx-auto">
            {t('app.tagline')}
          </p>
        </div>

        {/* Continue Learning button (if has progress) */}
        {hasProgress && (
          <button
            onClick={() => { play('click'); onContinue(); }}
            className="w-full group relative overflow-hidden bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-600/30 mb-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="flex items-center justify-center gap-2">
              <Play size={20} /> {t('menu.continueLearning')}
            </span>
            <div className="text-xs font-normal text-cyan-100 mt-0.5">
              {t('menu.level')} {state.level} · ${state.money} · {completedLessons}/{totalLessons} {t('menu.lessons')} · {state.completedMissions.length} {t('menu.repairs')}
            </div>
          </button>
        )}

        {/* Menu grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {/* Electronics Academy */}
          <MenuCard
            icon={GraduationCap}
            title={t('menu.academy')}
            subtitle={allLessonsDone ? t('menu.academyComplete') : completedLessons > 0 ? `${completedLessons}/${totalLessons} done` : t('menu.academyStartHere')}
            onClick={() => { play('click'); onOpenAcademy(); }}
            highlight={!hasProgress}
            color="cyan"
          />

          {/* Guided Repair */}
          <MenuCard
            icon={ClipboardList}
            title={t('menu.guidedRepair')}
            subtitle={state.guidedRepairCompleted ? t('menu.guidedRepairComplete') : allLessonsDone ? t('menu.guidedRepairReady') : t('menu.guidedRepairLocked')}
            onClick={() => { if (allLessonsDone) { play('click'); onOpenGuidedRepair(); } }}
            locked={!allLessonsDone}
            color="green"
          />

          {/* Repair Missions */}
          <MenuCard
            icon={Wrench}
            title={t('menu.repairJobs')}
            subtitle={canRepair ? `${state.unlockedMissions.length} ${t('menu.repairJobsAvailable')}` : t('menu.repairJobsLocked')}
            onClick={() => { if (canRepair) { play('click'); onOpenMissions(); } }}
            locked={!canRepair}
            color="orange"
          />

          {/* Workshop */}
          <MenuCard
            icon={Home}
            title={t('menu.workshop')}
            subtitle={t('menu.workshop3D')}
            onClick={() => { play('click'); onOpenWorkshop(); }}
            color="cyan"
          />

          {/* Component Library */}
          <MenuCard
            icon={Library}
            title={t('menu.components')}
            subtitle={t('menu.componentsRef')}
            onClick={() => { play('click'); onOpenLibrary(); }}
            color="cyan"
          />

          {/* Progress */}
          <MenuCard
            icon={Trophy}
            title={t('menu.progress')}
            subtitle={t('menu.progressAchievements')}
            onClick={() => { play('click'); onOpenProgress(); }}
            color="yellow"
          />
        </div>

        {/* Settings + New Game row */}
        <div className="flex gap-2.5 mb-4">
          <button
            onClick={() => { play('click'); onSettings(); }}
            className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-zinc-800 text-sm"
          >
            <Settings size={18} /> {t('menu.settings')}
          </button>
          {hasProgress && (
            <button
              onClick={() => { play('click'); setShowResetConfirm(true); }}
              className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-zinc-800 text-sm"
            >
              <RotateCcw size={18} /> {t('menu.reset')}
            </button>
          )}
        </div>

        {/* Stats summary */}
        {hasProgress && (
          <div className="grid grid-cols-4 gap-2 text-center">
            <StatCard icon={TrendingUp} label={t('menu.level')} value={state.level} />
            <StatCard icon={Zap} label={t('progress.money')} value={`${state.money}`} />
            <StatCard icon={Award} label={t('progress.xp')} value={state.xp} />
            <StatCard icon={Wrench} label={t('menu.repairs')} value={state.completedMissions.length} />
          </div>
        )}

        {/* Reset confirm */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowResetConfirm(false)}>
            <div className="bg-zinc-900 border border-red-800 rounded-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-white text-lg font-semibold mb-2">{t('menu.resetConfirmTitle')}</h3>
              <p className="text-zinc-400 text-sm mb-4">
                {t('menu.resetConfirmBody')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {t('menu.cancel')}
                </button>
                <button
                  onClick={() => { resetProgress(); setShowResetConfirm(false); }}
                  className="flex-1 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {t('menu.reset')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuCard({
  icon: Icon, title, subtitle, onClick, highlight, locked, color,
}: {
  icon: any; title: string; subtitle: string; onClick: () => void;
  highlight?: boolean; locked?: boolean; color: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400 border-cyan-600/30 hover:border-cyan-500',
    green: 'text-green-400 border-green-600/30 hover:border-green-500',
    orange: 'text-orange-400 border-orange-600/30 hover:border-orange-500',
    yellow: 'text-yellow-400 border-yellow-600/30 hover:border-yellow-500',
  };
  const colorClass = colorMap[color] ?? colorMap.cyan;

  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`relative p-3.5 rounded-xl border bg-zinc-900 transition-all text-left ${
        locked
          ? 'opacity-40 cursor-not-allowed border-zinc-800'
          : highlight
          ? 'bg-cyan-950/30 border-cyan-600 hover:bg-cyan-900/30 hover:scale-[1.02] active:scale-[0.98] animate-pulse'
          : `${colorClass} hover:bg-zinc-800/50 hover:scale-[1.02] active:scale-[0.98]`
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {locked ? <Lock size={18} className="text-zinc-500" /> : <Icon size={18} className={locked ? 'text-zinc-500' : color === 'cyan' ? 'text-cyan-400' : color === 'green' ? 'text-green-400' : color === 'orange' ? 'text-orange-400' : 'text-yellow-400'} />}
        <span className="text-white font-semibold text-sm">{title}</span>
      </div>
      <div className="text-xs text-zinc-500">{subtitle}</div>
      {highlight && !locked && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
      )}
    </button>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-2">
      <Icon size={14} className="text-cyan-400 mx-auto mb-1" />
      <div className="text-white font-bold text-xs">{value}</div>
      <div className="text-zinc-500 text-[10px]">{label}</div>
    </div>
  );
}
