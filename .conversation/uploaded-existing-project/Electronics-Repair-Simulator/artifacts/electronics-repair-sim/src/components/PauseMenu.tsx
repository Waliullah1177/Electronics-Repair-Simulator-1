import { Home, X, RotateCcw } from '@/lucide-icons';
import { useAudio } from '@/game/audio';
import { useGame } from '@/state/GameContext';
import { useTranslation } from '@/i18n/useTranslation';
import { useState } from 'react';

interface PauseMenuProps {
  onResume: () => void;
  onExitToWorkshop: () => void;
  onExitToMenu: () => void;
}

export default function PauseMenu({ onResume, onExitToWorkshop, onExitToMenu }: PauseMenuProps) {
  const { play } = useAudio();
  const { resetProgress } = useGame();
  const { t } = useTranslation();
  const [showReset, setShowReset] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onResume}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-xs w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-white text-xl font-bold text-center mb-6">{t('pause.paused')}</h2>

        <div className="space-y-2">
          <button
            onClick={() => { play('click'); onResume(); }}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition-colors"
          >
            {t('pause.resume')}
          </button>
          <button
            onClick={() => { play('click'); onExitToWorkshop(); }}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
          >
            {t('pause.backToWorkshop')}
          </button>
          <button
            onClick={() => { play('click'); onExitToMenu(); }}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
          >
            {t('pause.mainMenu')}
          </button>

          {showReset ? (
            <div className="pt-2">
              <button
                onClick={() => { resetProgress(); onExitToMenu(); }}
                className="w-full py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors mb-1"
              >
                {t('pause.confirmReset')}
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="w-full py-2 bg-zinc-800 text-zinc-400 rounded-lg text-sm transition-colors"
              >
                {t('menu.cancel')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowReset(true)}
              className="w-full py-2 text-red-400/70 hover:text-red-400 text-sm transition-colors"
            >
              {t('pause.resetProgress')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
