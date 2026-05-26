import { CheckCircle, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const statusConfig = {
    Verified: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      icon: CheckCircle,
      label: '✅ Verified',
    },
    Inaccurate: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-300',
      icon: AlertCircle,
      label: '⚠️ Inaccurate',
    },
    False: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      icon: XCircle,
      label: '❌ False',
    },
    Unverifiable: {
      bg: 'bg-slate-200',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: HelpCircle,
      label: '❓ Unverifiable',
    },
  };

  const config = statusConfig[status] || statusConfig.Unverifiable;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon size={16} />
      {config.label}
    </span>
  );
}
