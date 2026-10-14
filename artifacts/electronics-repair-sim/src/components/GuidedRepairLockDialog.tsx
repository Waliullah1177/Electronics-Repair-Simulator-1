import { Lock, X } from '@/lucide-icons';
import { useGame } from '@/state/GameContext';
import { useTranslation } from '@/i18n/useTranslation';
import { GUIDED_REPAIR_UNLOCK_LEVEL } from '@/game/progression';

export default function GuidedRepairLockDialog({ onClose }: { onClose: () => void }) {
  const { state } = useGame();
  const { t } = useTranslation();
  const levelsRemaining = Math.max(0, GUIDED_REPAIR_UNLOCK_LEVEL - state.level);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="guided-repair-lock-title"
        className="w-full max-w-sm rounded-2xl border border-cyan-800/70 bg-zinc-900 p-5 shadow-2xl shadow-cyan-950/40 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-700/50 bg-cyan-950/60 text-cyan-300">
            <Lock size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="guided-repair-lock-title" className="text-lg font-semibold text-white">
              {t('guided.lockTitle')}
            </h2>
            <p className="mt-1 text-sm text-cyan-300">{t('menu.guidedRepair')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-zinc-300">{t('guided.unlockRequirement')}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-3">
            <div className="text-xs text-zinc-500">{t('guided.currentLevel')}</div>
            <div className="mt-1 text-xl font-bold text-white">{state.level}</div>
          </div>
          <div className="rounded-xl border border-cyan-900/70 bg-cyan-950/30 p-3">
            <div className="text-xs text-cyan-200/70">{t('guided.levelsRemaining')}</div>
            <div className="mt-1 text-xl font-bold text-cyan-300">{levelsRemaining}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 min-h-11 w-full rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
        >
          {t('common.close')}
        </button>
      </section>
    </div>
  );
}
