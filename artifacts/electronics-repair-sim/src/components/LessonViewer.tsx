import { useState, useCallback, useMemo } from 'react';
import { useGame } from '@/state/GameContext';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';
import type { Lesson, LessonPage, QuizQuestion } from '@/types';
import {
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, Award,
  RefreshCw, BookOpen, HelpCircle, GraduationCap, Home,
} from '@/lucide-icons';

interface LessonViewerProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (score: number) => void;
  onSaveProgress: (pageIndex: number) => void;
  onHome: () => void;
}

export default function LessonViewer({ lesson, onBack, onComplete, onSaveProgress, onHome }: LessonViewerProps) {
  const { play } = useAudio();
  const { t, lang, localize, localizeTree } = useTranslation();
  const displayedLesson = useMemo(() => localizeTree(lesson), [lesson, localizeTree]);
  const [pageIndex, setPageIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const page = displayedLesson.pages[pageIndex];
  const isLastPage = pageIndex === displayedLesson.pages.length - 1;
  const progress = ((pageIndex + 1) / displayedLesson.pages.length) * 100;

  const handleNext = useCallback(() => {
    if (isLastPage) {
      if (page.type === 'quiz') {
        const score = calculateQuizScore(page.quiz!, quizAnswers);
        play(score >= 70 ? 'success' : 'failure');
        onComplete(score);
      } else {
        play('click');
        onComplete(100);
      }
    } else {
      play('click');
      onSaveProgress(pageIndex + 1);
      setPageIndex(pageIndex + 1);
      setQuizSubmitted(false);
      setShowHint(false);
    }
  }, [isLastPage, page, pageIndex, quizAnswers, play, onComplete, onSaveProgress]);

  const handlePrev = useCallback(() => {
    if (pageIndex > 0) {
      play('click');
      setPageIndex(pageIndex - 1);
      setQuizSubmitted(false);
      setShowHint(false);
    }
  }, [pageIndex, play]);

  const handleAnswer = useCallback((qIndex: number, answerIndex: number) => {
    play('click');
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: answerIndex }));
  }, [play]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <button
          onClick={() => { play('click'); onBack(); }}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-cyan-400 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap size={12} /> {t('academy.title')} {displayedLesson.order}
          </div>
          <h1 className="text-base font-semibold truncate">{displayedLesson.title}</h1>
        </div>
        <button
          onClick={() => { play('click'); onHome(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-medium transition-colors shrink-0"
          title={localize('Return to Workshop Home')}
        >
          <Home size={16} />
          <span className="hidden sm:inline">{t('common.home')}</span>
        </button>
        <div className="text-xs text-zinc-500 shrink-0">
          {pageIndex + 1} / {lesson.pages.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-800 shrink-0">
        <div
          className="h-full bg-cyan-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            {page.type === 'theory' && <BookOpen size={20} className="text-cyan-400" />}
            {page.type === 'interactive' && <HelpCircle size={20} className="text-yellow-400" />}
            {page.type === 'quiz' && <Award size={20} className="text-green-400" />}
            {page.title}
          </h2>

          {/* Theory page */}
          {page.type === 'theory' && (
            <div className="space-y-4">
              <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                {page.content}
              </div>
              {page.urduHint && lang === 'en' && (
                <div className="mt-4">
                  <button
                    onClick={() => { play('click'); setShowHint(!showHint); }}
                    className="flex items-center gap-2 text-xs text-yellow-500 hover:text-yellow-400 transition-colors"
                  >
                    <HelpCircle size={14} />
                    {localize(showHint ? 'Hide Roman Urdu' : 'Show Roman Urdu')}
                  </button>
                  {showHint && (
                    <div className="mt-2 bg-yellow-950/30 border border-yellow-800/30 rounded-lg p-3 text-yellow-200/90 text-sm leading-relaxed">
                      {page.urduHint}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Interactive page */}
          {page.type === 'interactive' && page.interaction && (
            <div className="space-y-4">
              <p className="text-zinc-300 text-sm leading-relaxed">{page.content}</p>
                <InteractiveDemo interaction={page.interaction} />
            </div>
          )}

          {/* Quiz page */}
          {page.type === 'quiz' && page.quiz && (
            <div className="space-y-4">
              {page.content && <p className="text-zinc-400 text-sm">{page.content}</p>}
              {page.quiz.map((q, qi) => (
                <QuizCard
                  key={qi}
                  question={q}
                  index={qi}
                  selectedAnswer={quizAnswers[qi]}
                  onAnswer={(ai) => handleAnswer(qi, ai)}
                  submitted={quizSubmitted}
                />
              ))}
              {isLastPage && !quizSubmitted && (
                <button
                  onClick={() => { play('click'); setQuizSubmitted(true); }}
                  disabled={Object.keys(quizAnswers).length < page.quiz.length}
                  className="w-full py-3 bg-green-700 hover:bg-green-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl font-semibold transition-colors"
                >
                  {localize('Submit Answers')}
                </button>
              )}
              {quizSubmitted && (
                <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {calculateQuizScore(page.quiz, quizAnswers)}%
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">{t('lesson.finish')} {t('lesson.complete')}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation footer */}
      <div className="px-4 py-3 bg-zinc-900 border-t border-zinc-800 shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={pageIndex === 0}
            className="flex items-center gap-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ChevronLeft size={18} /> {t('lesson.previous')}
          </button>
          <div className="flex gap-1">
            {displayedLesson.pages.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === pageIndex ? 'bg-cyan-400' : i < pageIndex ? 'bg-cyan-700' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {isLastPage ? t('lesson.complete') : t('lesson.next')}
            {isLastPage ? <CheckCircle2 size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function calculateQuizScore(quiz: QuizQuestion[], answers: Record<number, number>): number {
  let correct = 0;
  quiz.forEach((q, i) => {
    if (answers[i] === q.correctIndex) correct++;
  });
  return Math.round((correct / quiz.length) * 100);
}

function QuizCard({
  question, index, selectedAnswer, onAnswer, submitted,
}: {
  question: QuizQuestion;
  index: number;
  selectedAnswer?: number;
  onAnswer: (answerIndex: number) => void;
  submitted: boolean;
}) {
  const { play } = useAudio();
  const { t } = useTranslation();
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
      <div className="text-sm text-zinc-200 font-medium mb-3">
        <span className="text-cyan-400 mr-1">Q{index + 1}.</span> {question.question}
      </div>
      <div className="space-y-2">
        {question.options.map((opt, oi) => {
          const isSelected = selectedAnswer === oi;
          const isCorrect = oi === question.correctIndex;
          let bg = 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300';
          if (submitted) {
            if (isCorrect) bg = 'bg-green-900/50 text-green-300 border-green-700';
            else if (isSelected) bg = 'bg-red-900/50 text-red-300 border-red-700';
            else bg = 'bg-zinc-800/50 text-zinc-500';
          } else if (isSelected) {
            bg = 'bg-cyan-900/50 text-cyan-200 border-cyan-600';
          }

          return (
            <button
              key={oi}
              onClick={() => { if (!submitted) { play('click'); onAnswer(oi); } }}
              disabled={submitted}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm border border-transparent transition-all ${bg}`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {submitted && isCorrect && <CheckCircle2 size={16} className="text-green-400" />}
                {submitted && isSelected && !isCorrect && <XCircle size={16} className="text-red-400" />}
              </div>
            </button>
          );
        })}
      </div>
      {submitted && (
        <div className="mt-3 text-xs text-zinc-400 bg-zinc-800/50 rounded p-2.5">
          <span className="text-cyan-400 font-medium">{t('lesson.explanation')}: </span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}

// Interactive demos
function InteractiveDemo({ interaction }: { interaction: NonNullable<LessonPage['interaction']> }) {
  const { localize } = useTranslation();
  switch (interaction.kind) {
    case 'ohms_law':
      return <OhmsLawDemo data={interaction.data as { initialVoltage: number; initialResistance: number }} />;
    case 'component_match':
      return <ComponentMatchDemo data={interaction.data as { pairs: { symbol: string; name: string }[] }} />;
    case 'series_parallel':
      return <SeriesParallelDemo />;
    case 'multimeter_mode':
      return <MultimeterModeDemo data={interaction.data as { scenarios: { task: string; mode: string }[] }} />;
    case 'fault_identify':
      return <FaultIdentifyDemo data={interaction.data as { cases: { symptom: string; fault: string; component: string }[] }} />;
    case 'circuit_path':
      return <CircuitPathDemo data={interaction.data as { labels: string[] }} />;
    default:
      return <div className="text-zinc-500 text-sm">{localize('Interactive demo not available.')}</div>;
  }
}

function OhmsLawDemo({ data }: { data: { initialVoltage: number; initialResistance: number } }) {
  const { localize } = useTranslation();
  const [voltage, setVoltage] = useState(data.initialVoltage);
  const [resistance, setResistance] = useState(data.initialResistance);
  const current = resistance > 0 ? voltage / resistance : 0;
  const power = voltage * current;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-zinc-400 block mb-2">{localize('Voltage:')} <span className="text-cyan-400 font-bold">{voltage}V</span></label>
          <input
            type="range" min="1" max="48" step="1" value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 block mb-2">{localize('Resistance:')} <span className="text-green-400 font-bold">{resistance}Ω</span></label>
          <input
            type="range" min="1" max="1000" step="1" value={resistance}
            onChange={(e) => setResistance(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>
      </div>
      <div className="bg-black rounded-lg p-4 border border-zinc-700">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-xs text-zinc-500">{localize('Current (I = V÷R)')}</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {current < 0.001 ? '0.00' : current < 1 ? `${(current * 1000).toFixed(1)}mA` : `${current.toFixed(3)}A`}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">{localize('Power (P = V×I)')}</div>
            <div className="text-2xl font-bold text-yellow-400 font-mono">
              {power < 0.001 ? '0.00' : power < 1 ? `${(power * 1000).toFixed(1)}mW` : `${power.toFixed(2)}W`}
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-zinc-500 mt-3">
        {localize('Try: Set V=12, R=100 → I should be 0.12A (120mA). Now increase R and watch I decrease!')}
      </p>
    </div>
  );
}

function ComponentMatchDemo({ data }: { data: { pairs: { symbol: string; name: string }[] } }) {
  const { play } = useAudio();
  const { localize } = useTranslation();
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [shuffledNames] = useState(() => shuffle(data.pairs.map((p) => p.name)));
  const [usedNames, setUsedNames] = useState<Set<string>>(new Set());

  const handleNameClick = (name: string) => {
    if (!selectedSymbol || usedNames.has(name)) return;
    const correctName = data.pairs.find((p) => p.symbol === selectedSymbol)?.name;
    if (name === correctName) {
      play('success');
      setMatched((prev) => ({ ...prev, [selectedSymbol]: name }));
      setUsedNames((prev) => new Set(prev).add(name));
    } else {
      play('error');
    }
    setSelectedSymbol(null);
  };

  const allMatched = Object.keys(matched).length === data.pairs.length;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
      <p className="text-xs text-zinc-400 mb-4">
        {localize('Click a component symbol, then click its correct name. Green = correct!')}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {/* Symbols */}
        <div className="space-y-2">
          <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">{localize('Components')}</div>
          {data.pairs.map((p) => {
            const isMatched = matched[p.symbol];
            const isSelected = selectedSymbol === p.symbol;
            return (
              <button
                key={p.symbol}
                onClick={() => { if (!isMatched) { play('click'); setSelectedSymbol(p.symbol); } }}
                disabled={!!isMatched}
                className={`w-full flex items-center gap-2 p-3 rounded-lg border transition-all ${
                  isMatched
                    ? 'bg-green-950/40 border-green-700/50 text-green-300'
                    : isSelected
                    ? 'bg-cyan-900/50 border-cyan-500'
                    : 'bg-zinc-800 border-zinc-700 hover:border-cyan-600'
                }`}
              >
                <ComponentIcon type={p.symbol} />
                <span className="text-sm capitalize">{p.symbol}</span>
                {isMatched && <CheckCircle2 size={16} className="ml-auto text-green-400" />}
              </button>
            );
          })}
        </div>
        {/* Names */}
        <div className="space-y-2">
          <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">{localize('Names')}</div>
          {shuffledNames.map((name) => {
            const isUsed = usedNames.has(name);
            return (
              <button
                key={name}
                onClick={() => handleNameClick(name)}
                disabled={isUsed}
                className={`w-full p-3 rounded-lg border text-sm text-left transition-all ${
                  isUsed
                    ? 'bg-green-950/30 border-green-800/30 text-green-300/60'
                    : selectedSymbol
                    ? 'bg-zinc-800 border-zinc-700 hover:border-yellow-500 hover:bg-zinc-700 cursor-pointer'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
      {allMatched && (
        <div className="mt-4 text-center text-green-400 text-sm font-medium flex items-center justify-center gap-2">
          <CheckCircle2 size={18} /> {localize('All matched! Great job!')}
        </div>
      )}
    </div>
  );
}

function SeriesParallelDemo() {
  const { localize } = useTranslation();
  const [mode, setMode] = useState<'series' | 'parallel'>('series');
  const [broken, setBroken] = useState<number | null>(null);
  const voltage = 12;
  const r1 = 100, r2 = 100;
  const totalR = mode === 'series' ? r1 + r2 : (r1 * r2) / (r1 + r2);
  const working = broken === null ? 2 : mode === 'series' ? 0 : 1;
  const current = working > 0 ? voltage / (mode === 'series' ? (r1 + r2) : r1) : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode('series'); setBroken(null); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'series' ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {localize('Series')}
        </button>
        <button
          onClick={() => { setMode('parallel'); setBroken(null); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'parallel' ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {localize('Parallel')}
        </button>
      </div>
      <div className="bg-black rounded-lg p-4 border border-zinc-700 mb-3">
        <svg viewBox="0 0 200 100" className="w-full max-w-sm mx-auto">
          {/* Battery */}
          <line x1="20" y1="30" x2="20" y2="70" stroke="#c0392b" strokeWidth="3" />
          <text x="20" y="22" fontSize="10" fill="#c0392b" textAnchor="middle">12V</text>
          {mode === 'series' ? (
            <>
              <line x1="20" y1="30" x2="70" y2="30" stroke="#888" strokeWidth="2" />
              <rect x="70" y="22" width="30" height="16" rx="2" fill={broken === 0 ? '#333' : '#d4a574'} stroke="#888" />
              <text x="85" y="34" fontSize="8" fill={broken === 0 ? '#f55' : '#fff'} textAnchor="middle">R1</text>
              <line x1="100" y1="30" x2="130" y2="30" stroke="#888" strokeWidth="2" />
              <rect x="130" y="22" width="30" height="16" rx="2" fill={broken === 1 ? '#333' : '#d4a574'} stroke="#888" />
              <text x="145" y="34" fontSize="8" fill={broken === 1 ? '#f55' : '#fff'} textAnchor="middle">R2</text>
              <line x1="160" y1="30" x2="180" y2="30" stroke="#888" strokeWidth="2" />
              <line x1="180" y1="30" x2="180" y2="70" stroke="#888" strokeWidth="2" />
              <line x1="180" y1="70" x2="20" y2="70" stroke="#888" strokeWidth="2" />
            </>
          ) : (
            <>
              <line x1="20" y1="30" x2="100" y2="30" stroke="#888" strokeWidth="2" />
              <line x1="100" y1="30" x2="100" y2="20" stroke="#888" strokeWidth="2" />
              <line x1="100" y1="20" x2="70" y2="20" stroke="#888" strokeWidth="2" />
              <rect x="70" y="12" width="30" height="16" rx="2" fill={broken === 0 ? '#333' : '#d4a574'} stroke="#888" />
              <text x="85" y="24" fontSize="8" fill={broken === 0 ? '#f55' : '#fff'} textAnchor="middle">R1</text>
              <line x1="70" y1="20" x2="20" y2="20" stroke="#888" strokeWidth="2" />
              <line x1="20" y1="20" x2="20" y2="50" stroke="#888" strokeWidth="2" />
              <line x1="100" y1="30" x2="130" y2="30" stroke="#888" strokeWidth="2" />
              <rect x="130" y="22" width="30" height="16" rx="2" fill={broken === 1 ? '#333' : '#d4a574'} stroke="#888" />
              <text x="145" y="34" fontSize="8" fill={broken === 1 ? '#f55' : '#fff'} textAnchor="middle">R2</text>
              <line x1="160" y1="30" x2="180" y2="30" stroke="#888" strokeWidth="2" />
              <line x1="180" y1="30" x2="180" y2="70" stroke="#888" strokeWidth="2" />
              <line x1="180" y1="70" x2="20" y2="70" stroke="#888" strokeWidth="2" />
              <line x1="20" y1="50" x2="20" y2="70" stroke="#888" strokeWidth="2" />
            </>
          )}
          {/* Break indicators */}
          {broken !== null && (
            <g>
              <line x1={broken === 0 ? 85 : 145} y1="18" x2={broken === 0 ? 85 : 145} y2="22" stroke="#f00" strokeWidth="3" />
              <text x={broken === 0 ? 85 : 145} y="14" fontSize="8" fill="#f00" textAnchor="middle">{localize('BROKEN')}</text>
            </g>
          )}
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
        <div className="bg-zinc-800 rounded p-2">
          <div className="text-zinc-500">{localize('Total resistance')}</div>
          <div className="text-cyan-400 font-bold">{totalR}Ω</div>
        </div>
        <div className="bg-zinc-800 rounded p-2">
          <div className="text-zinc-500">{localize('Current')}</div>
          <div className="text-emerald-400 font-bold">{(current * 1000).toFixed(0)}mA</div>
        </div>
        <div className="bg-zinc-800 rounded p-2">
          <div className="text-zinc-500">{localize('Working')}</div>
          <div className={`font-bold ${working > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {working > 0 ? `${working}/2` : localize('NONE')}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setBroken(broken === 0 ? null : 0)} className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${broken === 0 ? 'bg-red-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
          {localize('Break R1')}
        </button>
        <button onClick={() => setBroken(broken === 1 ? null : 1)} className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${broken === 1 ? 'bg-red-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
          {localize('Break R2')}
        </button>
        <button onClick={() => setBroken(null)} className="flex-1 py-2 bg-zinc-800 text-zinc-400 rounded text-xs font-medium">
          {localize('Reset')}
        </button>
      </div>
      <p className="text-xs text-zinc-500 mt-3">
        {mode === 'series' && broken !== null
          ? localize('In series, breaking one component stops ALL current!')
          : mode === 'parallel' && broken !== null
          ? localize('In parallel, the other branch still works!')
          : localize('Click "Break" to see what happens when a component fails.')}
      </p>
    </div>
  );
}

function MultimeterModeDemo({ data }: { data: { scenarios: { task: string; mode: string }[] } }) {
  const { play } = useAudio();
  const { localize } = useTranslation();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const modes = [
    { id: 'dc_voltage', label: localize('DC Voltage') },
    { id: 'resistance', label: localize('Resistance') },
    { id: 'continuity', label: localize('Continuity') },
    { id: 'diode_test', label: localize('Diode Test') },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
      <p className="text-xs text-zinc-400 mb-4">{localize('Select the correct multimeter mode for each task:')}</p>
      <div className="space-y-3">
        {data.scenarios.map((s, i) => {
          const answered = answers[i];
          const isCorrect = answered === s.mode;
          return (
            <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-sm text-zinc-200 mb-2">{i + 1}. {s.task}</div>
              <div className="grid grid-cols-2 gap-1.5">
                {modes.map((m) => {
                  const selected = answered === m.id;
                  const correctAnswer = m.id === s.mode;
                  let bg = 'bg-zinc-800 text-zinc-400';
                  if (answered) {
                    if (selected && correctAnswer) bg = 'bg-green-900/50 text-green-300 border border-green-700';
                    else if (selected && !correctAnswer) bg = 'bg-red-900/50 text-red-300 border border-red-700';
                    else if (correctAnswer) bg = 'bg-green-900/30 text-green-400/60 border border-green-800/30';
                  } else {
                    bg = 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700';
                  }
                  return (
                    <button
                      key={m.id}
                      onClick={() => { if (!answered) { play('click'); setAnswers({ ...answers, [i]: m.id }); } }}
                      disabled={!!answered}
                      className={`py-2 px-3 rounded text-xs font-medium transition-colors ${bg}`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className={`text-xs mt-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect
                    ? localize('Correct!')
                    : `${localize('Wrong. Correct answer:')} ${modes.find(m => m.id === s.mode)?.label}.`}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FaultIdentifyDemo({ data }: { data: { cases: { symptom: string; fault: string; component: string }[] } }) {
  const { play } = useAudio();
  const { localize } = useTranslation();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const faultTypes = [
    { id: 'open', label: localize('Open') },
    { id: 'short', label: localize('Short') },
    { id: 'none', label: localize('Normal') },
    { id: 'drift', label: localize('Value Drift') },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
      <p className="text-xs text-zinc-400 mb-4">{localize('Based on the symptom, identify the fault type:')}</p>
      <div className="space-y-3">
        {data.cases.map((c, i) => {
          const answered = answers[i];
          const isCorrect = answered === c.fault;
          return (
            <div key={i} className="bg-zinc-800/50 rounded-lg p-3">
              <div className="text-sm text-zinc-200 mb-2">
                <span className="text-yellow-400">{localize('Symptom:')}</span> {c.symptom}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {faultTypes.map((f) => {
                  const selected = answered === f.id;
                  const correctAnswer = f.id === c.fault;
                  let bg = 'bg-zinc-800 text-zinc-400';
                  if (answered) {
                    if (selected && correctAnswer) bg = 'bg-green-900/50 text-green-300 border border-green-700';
                    else if (selected && !correctAnswer) bg = 'bg-red-900/50 text-red-300 border border-red-700';
                    else if (correctAnswer) bg = 'bg-green-900/30 text-green-400/60 border border-green-800/30';
                  } else {
                    bg = 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700';
                  }
                  return (
                    <button
                      key={f.id}
                      onClick={() => { if (!answered) { play('click'); setAnswers({ ...answers, [i]: f.id }); } }}
                      disabled={!!answered}
                      className={`py-2 px-3 rounded text-xs font-medium transition-colors ${bg}`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className={`text-xs mt-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect
                    ? localize('Correct!')
                    : `${localize('Wrong — the answer is:')} ${faultTypes.find((fault) => fault.id === c.fault)?.label ?? c.fault}.`}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CircuitPathDemo({ data }: { data: { labels: string[] } }) {
  const { play } = useAudio();
  const { localize } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const typeMap: Record<string, string> = {
    R: 'Resistor', C: 'Capacitor', D: 'Diode', Q: 'MOSFET/Transistor',
    U: 'IC / Regulator', F: 'Fuse', J: 'Connector', L: 'Inductor',
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
      <p className="text-xs text-zinc-400 mb-4">{localize('Click each reference label to learn what type of component it represents:')}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {data.labels.map((label) => {
          const isSelected = selected === label;
          return (
            <button
              key={label}
              onClick={() => { play('click'); setSelected(label); }}
              className={`px-4 py-2.5 rounded-lg text-sm font-mono font-bold transition-all ${
                isSelected
                  ? 'bg-cyan-600 text-white scale-105'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="bg-black rounded-lg p-4 border border-cyan-700/50">
          <div className="text-cyan-400 text-sm font-mono mb-1">{selected}</div>
          <div className="text-white text-lg font-semibold">
            {localize(typeMap[selected[0]] ?? 'Unknown')}
          </div>
          <div className="text-zinc-400 text-xs mt-1">
            {localize('The first letter tells the type:')} {selected[0]} = {localize(typeMap[selected[0]] ?? 'Unknown')}.
            {' '}{localize('The number')} ({selected.slice(1)}) {localize('is just an identifier — it tells you which specific one on the board.')}
          </div>
        </div>
      )}
    </div>
  );
}

function ComponentIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    resistor: '▭',
    capacitor: '⊩',
    diode: '▷',
    fuse: '⌷',
    mosfet: 'Q',
    regulator: 'U',
    inductor: '◯',
    connector: '⌆',
    led: '◉',
  };
  return <span className="text-lg text-cyan-400 w-6 text-center">{icons[type] ?? '?'}</span>;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
