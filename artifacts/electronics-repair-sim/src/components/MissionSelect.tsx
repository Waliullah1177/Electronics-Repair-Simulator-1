import { useGame } from '@/state/GameContext';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';
import { missions } from '@/game/missions';
import type { Mission } from '@/types';
import { Lock, Clock, Trophy, DollarSign, ChevronLeft, Star, ClipboardList, AlertTriangle, Home } from '@/lucide-icons';

interface MissionSelectProps {
  onBack: () => void;
  onSelectMission: (missionId: string) => void;
  onHome: () => void;
}

export default function MissionSelect({ onBack, onSelectMission, onHome }: MissionSelectProps) {
  const { state } = useGame();
  const { play } = useAudio();
  const { t, localize } = useTranslation();

  const sorted = [...missions].sort((a, b) => {
    const aDone = state.completedMissions.includes(a.id) ? 1 : 0;
    const bDone = state.completedMissions.includes(b.id) ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    return a.requiredLevel - b.requiredLevel;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { play('click'); onBack(); }}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-700"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{t('missions.title')}</h1>
            <p className="text-zinc-400 text-sm">{t('missions.subtitle')}</p>
          </div>
          <button
            onClick={() => { play('click'); onHome(); }}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Home size={18} /> {t('workshop.home')}
          </button>
        </div>

        {/* Mission cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {sorted.map((mission) => {
            const isUnlocked = state.unlockedMissions.includes(mission.id);
            const isCompleted = state.completedMissions.includes(mission.id);

            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                isUnlocked={isUnlocked}
                isCompleted={isCompleted}
                onClick={() => {
                  if (isUnlocked) {
                    play('click');
                    onSelectMission(mission.id);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MissionCard({ mission, isUnlocked, isCompleted, onClick }: {
  mission: Mission;
  isUnlocked: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) {
  const { t, localize } = useTranslation();
  const diffColor = {
    easy: 'text-green-400 bg-green-950/50 border-green-800',
    medium: 'text-yellow-400 bg-yellow-950/50 border-yellow-800',
    advanced: 'text-red-400 bg-red-950/50 border-red-800',
  }[mission.difficulty];

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border p-4 transition-all ${
        isUnlocked
          ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 hover:border-cyan-600 cursor-pointer hover:scale-[1.02]'
          : 'bg-zinc-900/50 border-zinc-800 opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Lock overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 rounded-xl z-10">
          <div className="flex items-center gap-2 text-zinc-500">
            <Lock size={20} />
            <span className="text-sm">{t('missions.requiresLevel')} {mission.requiredLevel}</span>
          </div>
        </div>
      )}

      {/* Completed badge */}
      {isCompleted && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-green-400 text-xs bg-green-950/60 px-2 py-0.5 rounded-full border border-green-800">
          <Trophy size={12} /> {t('missions.done')}
        </div>
      )}

      {/* Difficulty badge */}
      <div className={`inline-block text-xs px-2 py-0.5 rounded border ${diffColor} mb-2 capitalize`}>
        {localize(mission.difficulty)}
      </div>

      <h3 className="font-semibold text-white mb-1">{localize(mission.title)}</h3>
      <p className="text-xs text-zinc-400 mb-3">{localize(mission.customer)}</p>
      <p className="text-sm text-zinc-300 mb-3 line-clamp-2">{localize(mission.description)}</p>

      {/* Footer info */}
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span className="flex items-center gap-1 text-green-400">
          <DollarSign size={12} /> {mission.reward}
        </span>
        <span className="flex items-center gap-1 text-cyan-400">
          <Star size={12} /> {mission.xp} XP
        </span>
        {mission.timeLimit > 0 && (
          <span className="flex items-center gap-1 text-yellow-400">
            <Clock size={12} /> {mission.timeLimit}s
          </span>
        )}
        <span className="flex items-center gap-1">
          <ClipboardList size={12} /> {mission.targetComponents.length} {t('missions.parts')}
        </span>
      </div>
    </div>
  );
}
