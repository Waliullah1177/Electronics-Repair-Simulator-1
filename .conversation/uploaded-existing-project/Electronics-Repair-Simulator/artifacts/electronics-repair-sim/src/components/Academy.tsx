import { useState, useCallback } from 'react';
import { useGame } from '@/state/GameContext';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';
import { lessons, isLessonUnlocked, getNextLesson } from '@/game/lessons';
import type { Lesson } from '@/types';
import {
  ChevronLeft, ChevronRight, Lock, CheckCircle2, GraduationCap,
  BookOpen, Award, ArrowRight, CircleDot, Home,
} from '@/lucide-icons';

interface AcademyProps {
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
  onGoToGuidedRepair: () => void;
  onHome: () => void;
}

export default function Academy({ onBack, onOpenLesson, onGoToGuidedRepair, onHome }: AcademyProps) {
  const { state } = useGame();
  const { play } = useAudio();
  const { t } = useTranslation();
  const completed = state.academy.completedLessons;
  const nextLesson = getNextLesson(completed);
  const allDone = lessons.every((l) => completed.includes(l.id));

  const modules = [
    { id: 'basics', label: 'Electronics Basics', color: 'cyan' },
    { id: 'components', label: 'Components & PCB', color: 'green' },
    { id: 'tools', label: 'Tools & Power', color: 'yellow' },
    { id: 'repair', label: 'Repair Methods', color: 'orange' },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => { play('click'); onBack(); }}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-700"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap size={28} className="text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold">{t('academy.title')}</h1>
              <p className="text-zinc-400 text-sm">{t('academy.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => { play('click'); onHome(); }}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Home size={18} /> {t('common.home')}
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span>{completed.length} of {lessons.length} lessons completed</span>
            <span>{Math.round((completed.length / lessons.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(completed.length / lessons.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Next lesson CTA */}
        {nextLesson && !allDone && (
          <button
            onClick={() => { play('click'); onOpenLesson(nextLesson.id); }}
            className="w-full mb-6 group relative overflow-hidden bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl p-4 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs text-cyan-200 uppercase tracking-wider">{t('menu.continueLearning')}</div>
                <div className="text-lg font-semibold mt-0.5">{nextLesson.title}</div>
                <div className="text-sm text-cyan-100 mt-0.5">{nextLesson.description}</div>
              </div>
              <ArrowRight size={24} className="text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        )}

        {/* Guided repair CTA */}
        {allDone && !state.guidedRepairCompleted && (
          <button
            onClick={() => { play('click'); onGoToGuidedRepair(); }}
            className="w-full mb-6 group relative overflow-hidden bg-green-600 hover:bg-green-500 text-white rounded-xl p-4 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs text-green-200 uppercase tracking-wider">All Lessons Complete!</div>
                <div className="text-lg font-semibold mt-0.5">Start Guided Repair Mission</div>
                <div className="text-sm text-green-100 mt-0.5">Put your knowledge into practice with step-by-step guidance</div>
              </div>
              <ArrowRight size={24} className="text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        )}

        {/* Lesson modules */}
        {modules.map((mod) => {
          const modLessons = lessons.filter((l) => l.module === mod.id);
          if (modLessons.length === 0) return null;
          return (
            <div key={mod.id} className="mb-6">
              <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 text-${mod.color}-400`}>
                {mod.label}
              </h2>
              <div className="space-y-2">
                {modLessons.map((lesson, idx) => {
                  const isDone = completed.includes(lesson.id);
                  const unlocked = isLessonUnlocked(lesson.id, completed);
                  const score = state.academy.lessonScores[lesson.id];

                  return (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      index={idx}
                      isDone={isDone}
                      unlocked={unlocked}
                      score={score}
                      onClick={() => {
                        if (unlocked) { play('click'); onOpenLesson(lesson.id); }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Return home */}
        <button
          onClick={() => { play('click'); onBack(); }}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl text-sm font-medium transition-colors border border-zinc-800 flex items-center justify-center gap-2"
        >
          <Home size={16} /> {t('common.home')}
        </button>
      </div>
    </div>
  );
}

function LessonCard({
  lesson, index, isDone, unlocked, score, onClick,
}: {
  lesson: Lesson;
  index: number;
  isDone: boolean;
  unlocked: boolean;
  score?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!unlocked}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
        !unlocked
          ? 'bg-zinc-900/40 border-zinc-800/50 opacity-50 cursor-not-allowed'
          : isDone
          ? 'bg-green-950/20 border-green-800/50 hover:border-green-600'
          : 'bg-zinc-900 border-zinc-700 hover:border-cyan-600 hover:bg-zinc-800'
      }`}
    >
      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
        !unlocked
          ? 'bg-zinc-800 text-zinc-600'
          : isDone
          ? 'bg-green-900 text-green-300'
          : 'bg-cyan-900 text-cyan-300'
      }`}>
        {!unlocked ? <Lock size={16} /> : isDone ? <CheckCircle2 size={18} /> : index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-sm ${!unlocked ? 'text-zinc-500' : 'text-white'}`}>
          {lesson.title}
        </div>
        <div className="text-xs text-zinc-500 mt-0.5 truncate">
          {lesson.description}
        </div>
        {isDone && score !== undefined && (
          <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
            <Award size={12} /> Score: {score}%
          </div>
        )}
      </div>
      {unlocked && !isDone && (
        <CircleDot size={16} className="text-cyan-500 shrink-0" />
      )}
    </button>
  );
}
