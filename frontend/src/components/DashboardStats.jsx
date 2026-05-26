import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
  Target,
  Award,
} from 'lucide-react';

export default function DashboardStats({
  filename,
  total_claims,
  verified,
  inaccurate,
  false_count,
  unverifiable,
  accuracy_score,
  processing_time_seconds,
}) {
  const stats = [
    {
      icon: CheckCircle,
      label: 'Verified',
      value: verified,
      color: 'from-emerald-50 to-teal-50',
      text: 'text-emerald-600',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
    },
    {
      icon: AlertCircle,
      label: 'Inaccurate',
      value: inaccurate,
      color: 'from-amber-50 to-orange-50',
      text: 'text-amber-600',
      border: 'border-amber-200',
      bg: 'bg-amber-50',
    },
    {
      icon: XCircle,
      label: 'False',
      value: false_count,
      color: 'from-red-50 to-rose-50',
      text: 'text-red-600',
      border: 'border-red-200',
      bg: 'bg-red-50',
    },
    {
      icon: Zap,
      label: 'Unverifiable',
      value: unverifiable,
      color: 'from-slate-100 to-gray-100',
      text: 'text-slate-600',
      border: 'border-slate-200',
      bg: 'bg-slate-50',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-50 via-white to-cyan-50 border border-blue-100 rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Fact-Check Report</h1>
            <p className="text-text-secondary text-lg mb-4">{filename}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-text-secondary">
                <Clock size={18} />
                <span>
                  Processed <span className="font-semibold text-text-primary">{processing_time_seconds}s</span> ago
                </span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Target size={18} />
                <span>
                  {total_claims} <span className="font-semibold text-text-primary">Claims</span> analyzed
                </span>
              </div>
            </div>
          </div>

          {/* Accuracy Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-brand-primary to-brand-dark rounded-xl p-6 shadow-md min-w-32 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award size={24} className="text-white" />
              <span className="text-3xl font-bold text-white">{accuracy_score}%</span>
            </div>
            <p className="text-xs text-white/90 font-semibold uppercase tracking-wider">
              Accuracy Score
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ translateY: -4 }}
              className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-xl p-6 shadow-sm transition-all duration-200`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className={`${stat.text}`} size={28} />
                <span className={`text-3xl font-bold ${stat.text}`}>{stat.value}</span>
              </div>
              <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-text-light">
                  {Math.round((stat.value / total_claims) * 100)}% of total
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Breakdown Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-xl font-bold text-text-primary mb-6">Verdict Distribution</h3>
        <div className="space-y-4">
          {[
            { label: 'Verified', value: verified, color: 'from-emerald-500 to-teal-500' },
            { label: 'Inaccurate', value: inaccurate, color: 'from-amber-500 to-orange-500' },
            { label: 'False', value: false_count, color: 'from-red-500 to-rose-500' },
            { label: 'Unverifiable', value: unverifiable, color: 'from-slate-400 to-gray-400' },
          ].map((item, idx) => {
            const percentage = total_claims > 0 ? (item.value / total_claims) * 100 : 0;
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-primary font-medium">{item.label}</span>
                  <span className="text-text-secondary text-sm">
                    {item.value} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-300">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${item.color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Summary Text */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-xl font-bold text-text-primary mb-4">📊 Summary</h3>
        <div className="space-y-3 text-text-secondary">
          <p className="leading-relaxed">
            Out of <span className="text-text-primary font-semibold">{total_claims}</span> claims analyzed:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">✓</span>
              <span>
                <span className="text-text-primary font-semibold">{verified}</span> claim{verified !== 1 ? 's' : ''} were{' '}
                <span className="text-emerald-600 font-semibold">verified</span> with supporting evidence
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">⚠</span>
              <span>
                <span className="text-text-primary font-semibold">{inaccurate}</span> claim{inaccurate !== 1 ? 's' : ''} were marked as{' '}
                <span className="text-amber-600 font-semibold">inaccurate</span> or partially misleading
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold mt-0.5">✕</span>
              <span>
                <span className="text-text-primary font-semibold">{false_count}</span> claim{false_count !== 1 ? 's' : ''} were determined to be{' '}
                <span className="text-red-600 font-semibold">false</span>
              </span>
            </li>
            {unverifiable > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-slate-600 font-bold mt-0.5">?</span>
                <span>
                  <span className="text-text-primary font-semibold">{unverifiable}</span> claim{unverifiable !== 1 ? 's' : ''} could not be{' '}
                  <span className="text-slate-600 font-semibold">verified</span>
                </span>
              </li>
            )}
          </ul>
          <p className="mt-4 pt-4 border-t border-gray-200 text-sm italic">
            Overall accuracy score: <span className="text-brand-primary font-bold">{accuracy_score}%</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
