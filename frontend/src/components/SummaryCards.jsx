import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, XCircle, Calendar } from 'lucide-react';

export default function SummaryCards({
  filename,
  total_claims,
  verified,
  inaccurate,
  false_count,
  processed_at,
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const cards = [
    {
      label: 'Total Claims',
      value: total_claims,
      icon: FileText,
      bg: 'from-slate-100 via-slate-50 to-gray-100',
      border: 'border-slate-200',
      iconBg: 'bg-slate-200',
      iconColor: 'text-slate-700',
      barColor: 'bg-gradient-to-r from-slate-400 to-slate-600',
    },
    {
      label: 'Verified',
      value: verified,
      icon: CheckCircle,
      bg: 'from-emerald-100 via-teal-50 to-green-100',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-200',
      iconColor: 'text-emerald-700',
      barColor: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    },
    {
      label: 'Inaccurate',
      value: inaccurate,
      icon: AlertCircle,
      bg: 'from-amber-100 via-orange-50 to-yellow-100',
      border: 'border-amber-200',
      iconBg: 'bg-amber-200',
      iconColor: 'text-amber-700',
      barColor: 'bg-gradient-to-r from-amber-500 to-orange-600',
    },
    {
      label: 'False',
      value: false_count,
      icon: XCircle,
      bg: 'from-red-100 via-rose-50 to-pink-100',
      border: 'border-red-200',
      iconBg: 'bg-red-200',
      iconColor: 'text-red-700',
      barColor: 'bg-gradient-to-r from-red-500 to-rose-600',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6"
    >
      {/* Header Card with file info */}
      <motion.div
        variants={headerVariants}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-6 hover:border-brand-primary/50 transition-all duration-300 shadow-sm"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-brand-primary/20 to-brand-light/20 p-3 rounded-xl border border-brand-primary/30">
              <FileText className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <p className="text-xs text-text-light font-semibold uppercase tracking-wider">Document</p>
              <p className="text-lg font-bold text-text-primary truncate max-w-xs">
                {filename}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Calendar className="w-4 h-4 text-brand-primary/60" />
            <span>{new Date(processed_at).toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              className={`group relative overflow-hidden rounded-xl border ${card.border} bg-gradient-to-br ${card.bg} backdrop-blur-sm hover:border-opacity-60 hover:shadow-lg hover:shadow-${card.label.includes('Verified') ? 'emerald' : card.label.includes('False') ? 'rose' : card.label.includes('Inaccurate') ? 'orange' : 'slate'}-500/20 transition-all duration-300`}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${card.bg}`}></div>

              {/* Top bar indicator */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${card.barColor}`}></div>

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs text-text-light font-semibold uppercase tracking-wider mb-2">
                      {card.label}
                    </p>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 + 0.2 }}
                      className="relative"
                    >
                      <p className="text-4xl font-black bg-gradient-to-r from-brand-dark to-brand-primary bg-clip-text text-transparent">
                        {card.value}
                      </p>
                    </motion.div>
                  </div>

                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0], y: [0, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: idx * 0.2 }}
                    className={`${card.iconBg} p-3 rounded-lg flex-shrink-0`}
                  >
                    <Icon className={`${card.iconColor} w-6 h-6`} />
                  </motion.div>
                </div>

                {/* Progress bar (if not total) */}
                {card.label !== 'Total Claims' && total_claims > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(card.value / total_claims) * 100}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 + 0.4 }}
                        className={card.barColor}
                      ></motion.div>
                    </div>
                    <p className="text-xs text-text-light mt-2">
                      {((card.value / total_claims) * 100).toFixed(0)}% of claims
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
