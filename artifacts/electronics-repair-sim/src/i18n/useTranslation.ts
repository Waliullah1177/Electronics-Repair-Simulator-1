import { useCallback } from 'react';
import { useGame } from '@/state/GameContext';
import {
  translate,
  translateContent,
  translateContentTree,
  type TranslationKey,
} from '@/i18n/translations';

export function useTranslation() {
  const { state } = useGame();
  const lang = state.settings.language;

  const t = useCallback((key: TranslationKey) => translate(key, lang), [lang]);
  const localize = useCallback((text: string) => translateContent(text, lang), [lang]);
  const localizeTree = useCallback(<T,>(value: T) => translateContentTree(value, lang), [lang]);

  return { t, lang, localize, localizeTree };
}
