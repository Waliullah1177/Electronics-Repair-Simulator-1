import { useGame } from '@/state/GameContext';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';
import { lessons } from '@/game/lessons';
import { missions } from '@/game/missions';
import { upgrades } from '@/game/upgrades';
import {
  ChevronLeft, Trophy, Award, TrendingUp, Zap, Wrench,
  GraduationCap, CheckCircle2, Lock, Star, Home,
} from '@/lucide-icons';

interface ProgressScreenProps {
  onBack: () => void;
  onHome: () => void;
}

export default function ProgressScreen({ onBack, onHome }: ProgressScreenProps) {
  const { state } = useGame();
  const { play } = useAudio();
  const { t } = useTranslation();

  const completedLessons = state.academy.completedLessons;
  const completedMissions = state.completedMissions;
  const purchasedUpgrades = state.purchasedUpgrades;
  const lessonScores = state.academy.lessonScores;

  const avgScore = Object.values(lessonScores).length > 0
    ? Math.round(Object.values(lessonScores).reduce((a, b) => a + b, 0) / Object.values(lessonScores).length)
    : 0;

  const achievements: { name: string; desc: string; unlocked: boolean; icon: any }[] = [
    { name: 'First Lesson', desc: 'Complete your first lesson', unlocked: completedLessons.length >= 1, icon: BookOpenIcon },
    { name: 'Halfway There', desc: 'Complete 4 lessons', unlocked: completedLessons.length >= 4, icon: GraduationCap },
    { name: 'Academy Graduate', desc: 'Complete all 8 lessons', unlocked: completedLessons.length >= 8, icon: Award },
    { name: 'First Repair', desc: 'Complete your first repair mission', unlocked: completedMissions.length >= 1, icon: Wrench },
    { name: 'Experienced', desc: 'Complete 3 repair missions', unlocked: completedMissions.length >= 3, icon: Trophy },
    { name: 'Master Tech', desc: 'Complete all 4 repair missions', unlocked: completedMissions.length >= 4, icon: Star },
    { name: 'Guided Repair', desc: 'Complete the guided repair tutorial', unlocked: state.guidedRepairCompleted, icon: CheckCircle2 },
    { name: 'Level 5', desc: 'Reach technician level 5', unlocked: state.level >= 5, icon: TrendingUp },
  ];

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
          <div className="flex items-center gap-2">
            <Trophy size={28} className="text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold">{t('progress.title')}</h1>
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

        {/* Stats overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatBox icon={TrendingUp} label={t('progress.level')} value={state.level} color="cyan" />
          <StatBox icon={Zap} label={t('progress.money')} value={`${state.money}`} color="yellow" />
          <StatBox icon={Award} label={t('progress.xp')} value={state.xp} color="green" />
          <StatBox icon={Wrench} label={t('progress.repairsCompleted')} value={completedMissions.length} color="orange" />
        </div>

        {/* Lesson progress */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap size={16} /> Academy Progress
            </h2>
            <span className="text-xs text-zinc-500">{completedLessons.length}/{lessons.length}</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-500"
              style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
            />
          </div>
          {Object.keys(lessonScores).length > 0 && (
            <div className="text-xs text-zinc-400">
              Average quiz score: <span className="text-cyan-400 font-bold">{avgScore}%</span>
            </div>
          )}
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            {lessons.map((l, i) => (
              <div
                key={l.id}
                className={`aspect-square rounded flex items-center justify-center text-xs font-bold ${
                  completedLessons.includes(l.id)
                    ? 'bg-green-900/50 text-green-300'
                    : 'bg-zinc-800 text-zinc-600'
                }`}
                title={l.title}
              >
                {completedLessons.includes(l.id) ? <CheckCircle2 size={16} /> : i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Mission progress */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4">
          <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Wrench size={16} /> Repair Missions
          </h2>
          <div className="space-y-2">
            {missions.map((m) => {
              const done = completedMissions.includes(m.id);
              const unlocked = state.unlockedMissions.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 p-2.5 rounded-lg ${
                    done ? 'bg-green-950/30' : unlocked ? 'bg-zinc-800/50' : 'bg-zinc-800/20'
                  }`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    done ? 'bg-green-800 text-green-300' : unlocked ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-800 text-zinc-600'
                  }`}>
                    {done ? <CheckCircle2 size={16} /> : !unlocked ? <Lock size={14} /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${done ? 'text-green-300' : unlocked ? 'text-white' : 'text-zinc-500'}`}>
                      {m.title}
                    </div>
                    <div className="text-xs text-zinc-500 capitalize">{m.difficulty} · ${m.reward} · {m.xp} XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upgrades purchased */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4">
          <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-3">
            Equipment Upgrades ({purchasedUpgrades.length}/{upgrades.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {upgrades.map((u) => {
              const owned = purchasedUpgrades.includes(u.id);
              return (
                <div
                  key={u.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                    owned ? 'bg-green-950/30 text-green-300 border border-green-800/50' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                  }`}
                >
                  {owned ? <CheckCircle2 size={12} /> : <Lock size={12} />}
                  {u.name}
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-4">
          <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Trophy size={16} /> Achievements
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map((a) => (
              <div
                key={a.name}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  a.unlocked
                    ? 'bg-yellow-950/20 border-yellow-800/50'
                    : 'bg-zinc-800/30 border-zinc-800 opacity-50'
                }`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  a.unlocked ? 'bg-yellow-800 text-yellow-300' : 'bg-zinc-700 text-zinc-600'
                }`}>
                  {a.unlocked ? <a.icon size={16} /> : <Lock size={14} />}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-semibold ${a.unlocked ? 'text-yellow-300' : 'text-zinc-500'}`}>
                    {a.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => { play('click'); onBack(); }}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl text-sm font-medium transition-colors border border-zinc-800"
        >
          Back to {t('common.home')}
        </button>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    cyan: 'text-cyan-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
  };
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-center">
      <Icon size={20} className={`${colors[color]} mx-auto mb-1.5`} />
      <div className="text-white font-bold text-lg">{value}</div>
      <div className="text-zinc-500 text-xs">{label}</div>
    </div>
  );
}

function BookOpenIcon() {
  return <GraduationCap size={16} />;
}
