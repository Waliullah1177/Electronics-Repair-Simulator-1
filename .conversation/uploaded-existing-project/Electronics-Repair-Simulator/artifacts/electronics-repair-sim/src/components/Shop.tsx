import { useGame } from '@/state/GameContext';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';
import { upgrades } from '@/game/upgrades';
import { CheckCircle2, DollarSign, ChevronLeft, Wrench, Gauge, Activity, Archive, Lightbulb, Zap, Table, BrainCircuit, Home } from '@/lucide-icons';

interface ShopProps {
  onBack: () => void;
  onHome: () => void;
}

const iconMap: Record<string, any> = {
  Gauge: Gauge,
  Flame: Wrench,
  Activity: Activity,
  Archive: Archive,
  Lightbulb: Lightbulb,
  Zap: Zap,
  Table: Table,
  BrainCircuit: BrainCircuit,
};

export default function Shop({ onBack, onHome }: ShopProps) {
  const { state, dispatch } = useGame();
  const { play } = useAudio();
  const { t, localize } = useTranslation();

  const categories = [
    { id: 'tools', label: t('shop.tools') },
    { id: 'workshop', label: t('shop.workshopCat') },
    { id: 'inventory', label: t('shop.inventoryCat') },
    { id: 'diagnostics', label: t('shop.diagnostics') },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { play('click'); onBack(); }}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-700"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{t('shop.title')}</h1>
              <p className="text-zinc-400 text-sm">{t('shop.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { play('click'); onHome(); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Home size={18} /> {t('workshop.home')}
            </button>
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2">
              <DollarSign size={18} className="text-green-400" />
              <span className="font-bold text-lg">{state.money}</span>
            </div>
          </div>
        </div>

        {/* Upgrade sections */}
        {categories.map((cat) => {
          const catUpgrades = upgrades.filter((u) => u.category === cat.id);
          if (catUpgrades.length === 0) return null;
          return (
            <div key={cat.id} className="mb-6">
              <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">{cat.label}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {catUpgrades.map((upgrade) => {
                  const isPurchased = state.purchasedUpgrades.includes(upgrade.id);
                  const canAfford = state.money >= upgrade.cost;
                  const Icon = iconMap[upgrade.icon] ?? Wrench;

                  return (
                    <div
                      key={upgrade.id}
                      className={`rounded-xl border p-4 transition-all ${
                        isPurchased
                          ? 'bg-green-950/30 border-green-800'
                          : canAfford
                          ? 'bg-zinc-900 border-zinc-700 hover:border-cyan-600'
                          : 'bg-zinc-900/50 border-zinc-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2.5 rounded-lg ${isPurchased ? 'bg-green-900/50' : 'bg-zinc-800'}`}>
                          <Icon size={24} className={isPurchased ? 'text-green-400' : 'text-cyan-400'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm">{localize(upgrade.name)}</h3>
                          <p className="text-xs text-zinc-400 mt-0.5">{localize(upgrade.description)}</p>
                        </div>
                      </div>
                      <div className="text-xs text-cyan-300/70 bg-cyan-950/30 rounded px-2 py-1 mb-3 border border-cyan-900/30">
                        {localize(upgrade.effect)}
                      </div>
                      {isPurchased ? (
                        <div className="flex items-center justify-center gap-2 py-2 text-green-400 text-sm font-medium">
                          <CheckCircle2 size={18} /> {t('shop.purchased')}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              play('purchase');
                              dispatch({ type: 'PURCHASE_UPGRADE', upgradeId: upgrade.id, cost: upgrade.cost });
                            } else {
                              play('error');
                            }
                          }}
                          disabled={!canAfford}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${
                            canAfford
                              ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                          }`}
                        >
                          <DollarSign size={16} /> {upgrade.cost}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
