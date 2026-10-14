import { useRef, useCallback } from 'react';
import { useGame } from '@/state/GameContext';

type SoundName =
  | 'click'
  | 'select'
  | 'measure'
  | 'beep'
  | 'remove'
  | 'install'
  | 'success'
  | 'failure'
  | 'purchase'
  | 'levelup'
  | 'solder'
  | 'error';

export function useAudio() {
  const { state } = useGame();
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (!state.settings.soundEnabled) return null;
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, [state.settings.soundEnabled]);

  const play = useCallback((sound: SoundName) => {
    const ctx = getCtx();
    if (!ctx) return;
    const vol = state.settings.volume;
    const now = ctx.currentTime;

    const makeOsc = (freq: number, type: OscillatorType, start: number, duration: number, gain: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + start);
      g.gain.setValueAtTime(0, now + start);
      g.gain.linearRampToValueAtTime(gain * vol, now + start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration + 0.05);
    };

    switch (sound) {
      case 'click':
        makeOsc(600, 'square', 0, 0.05, 0.15);
        break;
      case 'select':
        makeOsc(800, 'sine', 0, 0.08, 0.2);
        break;
      case 'measure':
        makeOsc(440, 'sine', 0, 0.15, 0.2);
        makeOsc(880, 'sine', 0.1, 0.1, 0.1);
        break;
      case 'beep':
        makeOsc(2000, 'square', 0, 0.15, 0.2);
        break;
      case 'remove':
        makeOsc(300, 'sawtooth', 0, 0.2, 0.15);
        makeOsc(150, 'sawtooth', 0.15, 0.15, 0.1);
        break;
      case 'install':
        makeOsc(500, 'triangle', 0, 0.1, 0.2);
        makeOsc(700, 'triangle', 0.1, 0.1, 0.15);
        break;
      case 'solder':
        makeOsc(120, 'sawtooth', 0, 0.3, 0.08);
        makeOsc(80, 'square', 0.05, 0.25, 0.06);
        break;
      case 'success':
        makeOsc(523, 'sine', 0, 0.15, 0.2);
        makeOsc(659, 'sine', 0.15, 0.15, 0.2);
        makeOsc(784, 'sine', 0.3, 0.25, 0.2);
        break;
      case 'failure':
        makeOsc(200, 'sawtooth', 0, 0.3, 0.2);
        makeOsc(150, 'sawtooth', 0.2, 0.4, 0.15);
        break;
      case 'error':
        makeOsc(150, 'square', 0, 0.1, 0.2);
        makeOsc(100, 'square', 0.1, 0.15, 0.15);
        break;
      case 'purchase':
        makeOsc(659, 'sine', 0, 0.1, 0.2);
        makeOsc(880, 'sine', 0.1, 0.15, 0.2);
        break;
      case 'levelup':
        makeOsc(523, 'sine', 0, 0.1, 0.2);
        makeOsc(659, 'sine', 0.1, 0.1, 0.2);
        makeOsc(784, 'sine', 0.2, 0.1, 0.2);
        makeOsc(1047, 'sine', 0.3, 0.3, 0.25);
        break;
    }
  }, [getCtx, state.settings.volume]);

  return { play };
}
