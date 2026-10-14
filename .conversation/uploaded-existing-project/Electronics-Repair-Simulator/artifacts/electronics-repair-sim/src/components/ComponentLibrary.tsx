import { useState, useMemo } from 'react';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';
import { componentLibrary } from '@/game/componentLibrary';
import type { ComponentInfo } from '@/types';
import {
  ChevronLeft, Search, Library, HelpCircle, Home,
} from '@/lucide-icons';

interface ComponentLibraryProps {
  onBack: () => void;
  onHome: () => void;
}

export default function ComponentLibrary({ onBack, onHome }: ComponentLibraryProps) {
  const { play } = useAudio();
  const { t, lang, localize, localizeTree } = useTranslation();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ComponentInfo | null>(null);
  const [showHint, setShowHint] = useState(false);
  const displayedSelection = selected ? localizeTree(selected) : null;

  const filtered = useMemo(() => {
    if (!search.trim()) return componentLibrary;
    const q = search.toLowerCase();
    return componentLibrary.filter((c) =>
      localize(c.name).toLowerCase().includes(q) ||
      localize(c.function).toLowerCase().includes(q) ||
      localize(c.applications).toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q)
    );
  }, [search, localize]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => { play('click'); onBack(); }}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-700"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Library size={28} className="text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold">{t('library.title')}</h1>
              <p className="text-zinc-400 text-sm">{t('library.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => { play('click'); onHome(); }}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Home size={18} /> {t('common.home')}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={localize('Search components...')}
            className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Grid + Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4">
          {/* Component list */}
          <div className="space-y-2 lg:max-h-[70vh] lg:overflow-y-auto">
            {filtered.map((comp) => (
              <button
                key={comp.type}
                onClick={() => { play('click'); setSelected(comp); setShowHint(false); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  selected?.type === comp.type
                    ? 'bg-cyan-950/30 border-cyan-600'
                    : 'bg-zinc-900 border-zinc-700 hover:border-cyan-600/50'
                }`}
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400 text-lg font-bold">
                  {comp.symbol}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-white truncate">{localize(comp.name)}</div>
                  <div className="text-xs text-zinc-500 truncate">{localize(comp.function)}</div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center text-zinc-500 text-sm py-8">{localize('No components found.')}</div>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:max-h-[70vh] lg:overflow-y-auto">
            {displayedSelection ? (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-cyan-900/50 flex items-center justify-center text-cyan-300 text-2xl font-bold">
                    {displayedSelection.symbol}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{displayedSelection.name}</h2>
                    <p className="text-xs text-cyan-400">{displayedSelection.exampleValue}</p>
                  </div>
                </div>

                <DetailSection title={t('library.function')} text={displayedSelection.function} />
                <DetailSection title={t('library.howItWorks')} text={displayedSelection.howItWorks} />
                <DetailSection title={t('library.failureSymptoms')} text={displayedSelection.failureSymptoms} />
                <DetailSection title={t('library.testingMethod')} text={displayedSelection.testingMethod} />
                <DetailSection title={t('library.applications')} text={displayedSelection.applications} />
                <DetailSection title={t('library.commonMistakes')} text={displayedSelection.commonMistakes} />

                {selected.urduHint && lang === 'en' && (
                  <div>
                    <button
                      onClick={() => { play('click'); setShowHint(!showHint); }}
                      className="flex items-center gap-2 text-xs text-yellow-500 hover:text-yellow-400 transition-colors"
                    >
                      <HelpCircle size={14} />
                      {localize(showHint ? 'Hide Roman Urdu' : 'Show Roman Urdu')}
                    </button>
                    {showHint && (
                      <div className="mt-2 bg-yellow-950/30 border border-yellow-800/30 rounded-lg p-3 text-yellow-200/90 text-sm leading-relaxed">
                      {selected.urduHint}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 text-center">
                <Library size={48} className="text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 text-sm">{localize('Select a component from the list to see its details.')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSection({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="text-xs text-cyan-400 uppercase tracking-wider font-semibold mb-1">{title}</h3>
      <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
    </div>
  );
}
