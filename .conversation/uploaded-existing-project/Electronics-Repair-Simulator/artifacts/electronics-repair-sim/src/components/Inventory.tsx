import { useGame } from '@/state/GameContext';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';
import { Boxes, ChevronLeft, Home } from '@/lucide-icons';

interface InventoryProps {
  onBack: () => void;
  onHome: () => void;
}

export default function Inventory({ onBack, onHome }: InventoryProps) {
  const { state } = useGame();
  const { play } = useAudio();
  const { t, localize } = useTranslation();

  const grouped = state.inventory.reduce((acc, item) => {
    if (item.quantity <= 0) return acc;
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, typeof state.inventory>);

  const typeLabels: Record<string, string> = {
    resistor: t('inventory.resistors'),
    capacitor: t('inventory.capacitors'),
    diode: t('inventory.diodes'),
    fuse: t('inventory.fuses'),
    mosfet: t('inventory.mosfets'),
    regulator: t('inventory.regulators'),
    ic: t('inventory.ics'),
    connector: t('inventory.connectors'),
    inductor: t('inventory.inductors'),
    led: t('inventory.leds'),
  };

  const typeColors: Record<string, string> = {
    resistor: 'text-amber-400',
    capacitor: 'text-blue-400',
    diode: 'text-purple-400',
    fuse: 'text-gray-400',
    mosfet: 'text-red-400',
    regulator: 'text-green-400',
    ic: 'text-cyan-400',
    connector: 'text-orange-400',
    inductor: 'text-pink-400',
    led: 'text-yellow-400',
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { play('click'); onBack(); }}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-700"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Boxes size={24} className="text-cyan-400" /> {t('inventory.title')}</h1>
            <p className="text-zinc-400 text-sm">{t('inventory.subtitle')}</p>
          </div>
          <button
            onClick={() => { play('click'); onHome(); }}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Home size={18} /> {t('workshop.home')}
          </button>
        </div>

        {/* Inventory groups */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center text-zinc-500 py-20">
            <Boxes size={48} className="mx-auto mb-3 opacity-30" />
            <p>{t('inventory.empty')} {t('inventory.emptyDesc')}</p>
          </div>
        ) : (
          Object.entries(grouped).map(([type, items]) => (
            <div key={type} className="mb-6">
              <h2 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${typeColors[type] ?? 'text-zinc-400'}`}>
                {localize(typeLabels[type] ?? type)}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {items.map((item) => (
                  <div key={item.refDes} className="bg-zinc-900 border border-zinc-700 rounded-lg p-3">
                    <div className="font-mono text-white text-sm font-semibold">{item.value}</div>
                    <div className="text-xs text-zinc-500 mt-0.5 capitalize">{localize(item.type)}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-zinc-600">{item.refDes}</span>
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded">
                        {t('pcb.qty')}: {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
