import { useGame } from '@/state/GameContext';
import { useAudio } from '@/game/audio';
import { Volume2, VolumeX, ChevronLeft, RotateCcw, Eye, Home, Languages } from '@/lucide-icons';
import { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import type { Language } from '@/types';

interface SettingsScreenProps {
  onBack: () => void;
  onHome: () => void;
}

export default function SettingsScreen({ onBack, onHome }: SettingsScreenProps) {
  const { state, dispatch, resetProgress } = useGame();
  const { play } = useAudio();
  const { t } = useTranslation();
  const [showReset, setShowReset] = useState(false);
  const { settings } = state;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { play('click'); onBack(); }}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-700"
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
          <button
            onClick={() => { play('click'); onHome(); }}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Home size={18} /> {t('common.home')}
          </button>
        </div>

        {/* Settings options */}
        <div className="space-y-3">
          {/* Sound toggle */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? <Volume2 size={20} className="text-cyan-400" /> : <VolumeX size={20} className="text-zinc-500" />}
              <div>
                <div className="font-medium">{t('settings.soundEffects')}</div>
                <div className="text-xs text-zinc-500">{t('settings.soundDesc')}</div>
              </div>
            </div>
            <button
              onClick={() => {
                play('click');
                dispatch({ type: 'UPDATE_SETTINGS', settings: { soundEnabled: !settings.soundEnabled } });
              }}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.soundEnabled ? 'bg-cyan-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Volume slider */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{t('settings.volume')}</span>
              <span className="text-sm text-zinc-400">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume}
              onChange={(e) => {
                dispatch({ type: 'UPDATE_SETTINGS', settings: { volume: parseFloat(e.target.value) } });
              }}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Schematic toggle */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye size={20} className="text-cyan-400" />
              <div>
                <div className="font-medium">{t('settings.showSchematic')}</div>
                <div className="text-xs text-zinc-500">{t('settings.showSchematicDesc')}</div>
              </div>
            </div>
            <button
              onClick={() => {
                play('click');
                dispatch({ type: 'UPDATE_SETTINGS', settings: { showSchematic: !settings.showSchematic } });
              }}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.showSchematic ? 'bg-cyan-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.showSchematic ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Language selector */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Languages size={20} className="text-cyan-400" />
              <div>
                <div className="font-medium">{t('settings.language')}</div>
                <div className="text-xs text-zinc-500">{t('settings.languageDesc')}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['en', 'ur'] as Language[]).map((l) => (
                <button
                  key={l}
                  aria-pressed={settings.language === l}
                  onClick={() => {
                    play('click');
                    dispatch({ type: 'UPDATE_SETTINGS', settings: { language: l } });
                  }}
                  className={`py-3 rounded-lg text-sm font-medium transition-all border ${
                    settings.language === l
                      ? 'bg-cyan-600 text-white border-cyan-500'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  {l === 'en' ? t('settings.english') : t('settings.romanUrdu')}
                </button>
              ))}
            </div>
          </div>

          {/* Reset progress */}
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <RotateCcw size={20} className="text-red-400" />
              <div>
                <div className="font-medium text-red-300">{t('settings.resetProgress')}</div>
                <div className="text-xs text-zinc-500">{t('settings.resetProgressDesc')}</div>
              </div>
            </div>
            {showReset ? (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => { resetProgress(); setShowReset(false); play('error'); }}
                  className="flex-1 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {t('settings.resetConfirm')}
                </button>
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors"
                >
                  {t('menu.cancel')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowReset(true)}
                className="w-full mt-2 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-300 rounded-lg text-sm font-medium transition-colors border border-red-800/50"
              >
                {t('settings.resetAll')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
