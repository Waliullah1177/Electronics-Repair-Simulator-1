import { useGame } from '@/state/GameContext';
import { DollarSign, Star, TrendingUp, Pause } from '@/lucide-icons';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';

interface HUDProps {
  onPause: () => void;
}

export default function HUD({ onPause }: HUDProps) {
  const { state } = useGame();
  const { play } = useAudio();
  const { t } = useTranslation();

  return (
    <div className="absolute top-[5.25rem] right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 z-20">
      <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg px-3 py-1.5">
        <div className="flex items-center gap-1 text-green-400">
          <DollarSign size={16} />
          <span className="font-bold text-sm text-white">{state.money}</span>
        </div>
        <div className="w-px h-4 bg-zinc-700" />
        <div className="flex items-center gap-1 text-cyan-400">
          <Star size={14} />
          <span className="font-bold text-sm text-white">{state.xp}</span>
        </div>
        <div className="w-px h-4 bg-zinc-700" />
        <div className="flex items-center gap-1 text-yellow-400">
          <TrendingUp size={14} />
          <span className="font-bold text-sm text-white">Lv.{state.level}</span>
        </div>
      </div>
      <button
        onClick={() => { play('click'); onPause(); }}
        className="p-2 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 hover:bg-zinc-800 rounded-lg transition-colors"
      >
        <Pause size={18} className="text-zinc-300" />
      </button>
      <span className="hidden sm:block text-xs text-zinc-500">{t('hud.pause')}</span>
    </div>
  );
}
