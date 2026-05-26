import { motion } from 'framer-motion'; 
import { Lightbulb, TrendingUp, AlertTriangle, Shield } from 'lucide-react'; 

export default function KeyInsights({ claims, accuracy_score }) { 
  const totalClaims = claims.length || 1;
  // Calculate insights
  const verified = claims.filter((c) => c.status === 'Verified').length;
  const false_claims = claims.filter((c) => c.status === 'False').length;
  const with_sources = claims.filter((c) => c.source && c.source.trim()).length;
  
  // Risk level
  let riskLevel = 'Low';
  let riskColor = 'emerald';
  if (accuracy_score < 50) {
    riskLevel = 'Critical';
    riskColor = 'red';
  } else if (accuracy_score < 70) {
    riskLevel = 'High';
    riskColor = 'amber';
  } else if (accuracy_score < 85) {
    riskLevel = 'Medium';
    riskColor = 'yellow';
  }

  const insights = [
    {
      title: 'Accuracy Score',
      value: `${accuracy_score}%`,
      icon: <Shield size={20} />,
      bg: 'from-sky-500/15 to-cyan-500/5',
      color: 'text-sky-300',
      stat: accuracy_score > 80 ? 'Excellent' : accuracy_score > 60 ? 'Fair' : 'Needs Review',
    },
    {
      title: 'Verified Claims',
      value: verified,
      icon: <TrendingUp size={20} />,
      bg: 'from-emerald-500/15 to-teal-500/5',
      color: 'text-emerald-300',
      stat: `${((verified / totalClaims) * 100).toFixed(0)}% of total`,
    },
    {
      title: 'Risk Level',
      value: riskLevel,
      icon: <AlertTriangle size={20} />,
      bg: riskColor === 'red'
        ? 'from-red-500/15 to-red-500/5'
        : riskColor === 'amber'
        ? 'from-amber-500/15 to-amber-500/5'
        : riskColor === 'yellow'
        ? 'from-yellow-500/15 to-yellow-500/5'
        : 'from-emerald-500/15 to-emerald-500/5',
      color: riskColor === 'red'
        ? 'text-red-300'
        : riskColor === 'amber'
        ? 'text-amber-300'
        : riskColor === 'yellow'
        ? 'text-yellow-300'
        : 'text-emerald-300',
      stat: `${false_claims} false claims found`,
    },
    {
      title: 'Evidence Quality',
      value: `${((with_sources / totalClaims) * 100).toFixed(0)}%`,
      icon: <Lightbulb size={20} />,
      bg: 'from-indigo-500/15 to-fuchsia-500/5',
      color: 'text-indigo-300',
      stat: `${with_sources} of ${claims.length} with sources`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {insights.map((insight, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`bg-gradient-to-br ${insight.bg} border border-slate-700/70 rounded-lg p-4 hover:border-slate-600 transition-all duration-300`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className={`${insight.color}`}>{insight.icon}</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {insight.title}
            </span>
          </div>
          <div className="mb-2">
            <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
          </div>
          <p className="text-xs text-slate-400">{insight.stat}</p>
        </motion.div>
      ))}
    </div>
  );
}
