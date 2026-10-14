import type { RepairReport } from '@/types';
import { CheckCircle2, XCircle, DollarSign, Star, Clock, Award, AlertTriangle, ChevronLeft, Home } from '@/lucide-icons';
import { useAudio } from '@/game/audio';
import { useTranslation } from '@/i18n/useTranslation';

interface RepairReportScreenProps {
  report: RepairReport;
  onContinue: () => void;
  onHome: () => void;
}

export default function RepairReportScreen({ report, onContinue, onHome }: RepairReportScreenProps) {
  const { play } = useAudio();
  const { t } = useTranslation();
  const accuracyColor = report.accuracy >= 80 ? 'text-green-400' : report.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400';
  const grade = report.accuracy >= 90 ? 'S' : report.accuracy >= 80 ? 'A' : report.accuracy >= 70 ? 'B' : report.accuracy >= 60 ? 'C' : 'D';

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={`rounded-2xl border p-6 ${report.success ? 'bg-green-950/30 border-green-700' : 'bg-red-950/30 border-red-700'}`}>
          {/* Result icon */}
          <div className="text-center mb-4">
            {report.success ? (
              <div className="inline-flex p-4 bg-green-900/40 rounded-full">
                <CheckCircle2 size={48} className="text-green-400" />
              </div>
            ) : (
              <div className="inline-flex p-4 bg-red-900/40 rounded-full">
                <XCircle size={48} className="text-red-400" />
              </div>
            )}
          </div>

          <h2 className="text-center text-2xl font-bold mb-1">
            {report.success ? t('report.repairComplete') : t('report.repairFailed')}
          </h2>
          <p className="text-center text-zinc-400 text-sm mb-6">
            {report.success ? t('report.repairCompleteDesc') : t('report.repairFailedDesc')}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Grade */}
            <div className="bg-zinc-900/70 rounded-lg p-3 text-center border border-zinc-700">
              <Award size={20} className="mx-auto mb-1 text-cyan-400" />
              <div className={`text-3xl font-bold ${accuracyColor}`}>{grade}</div>
              <div className="text-xs text-zinc-500">{t('report.grade')}</div>
            </div>

            {/* Accuracy */}
            <div className="bg-zinc-900/70 rounded-lg p-3 text-center border border-zinc-700">
              <div className={`text-3xl font-bold ${accuracyColor}`}>{report.accuracy}%</div>
              <div className="text-xs text-zinc-500 mt-3">{t('report.accuracy')}</div>
            </div>
          </div>

          {/* Detailed stats */}
          <div className="space-y-2 mb-4">
            <StatRow icon={DollarSign} label={t('report.reward')} value={`${report.reward}`} color="text-green-400" />
            <StatRow icon={Star} label={t('report.xpEarned')} value={`+${report.xp}`} color="text-cyan-400" />
            <StatRow icon={Clock} label={t('report.time')} value={formatTime(report.timeTaken)} color="text-yellow-400" />
            <StatRow icon={AlertTriangle} label={t('report.wrongAttempts')} value={String(report.incorrectAttempts)} color="text-orange-400" />
            <StatRow icon={Star} label={t('report.hintsUsed')} value={`${report.hintsUsed}`} color="text-zinc-400" />
          </div>

          {/* Continue button */}
          <button
            onClick={() => { play('click'); onContinue(); }}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition-colors"
          >
            {report.success ? t('report.returnToWorkshop') : t('report.backToRepairBoard')}
          </button>
          <button
            onClick={() => { play('click'); onHome(); }}
            className="w-full py-2.5 mt-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Home size={16} /> {t('common.home')}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between bg-zinc-900/50 rounded-lg px-3 py-2 border border-zinc-800">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Icon size={16} className={color} />
        {label}
      </div>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
