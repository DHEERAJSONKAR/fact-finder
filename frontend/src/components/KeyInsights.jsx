import { motion } from 'framer-motion'; 
import { Lightbulb, TrendingUp, AlertTriangle, Shield } from 'lucide-react'; 

export default function KeyInsights({ claims, accuracy_score }) { 
  // Calculate insights
  const verified = claims.filter((c) => c.status === 'Verified').length;
  const false_claims = claims.filter((c) => c.status === 'False').length;
  const inaccurate = claims.filter((c) => c.status === 'Inaccurate').length;
  const avg_explanation_length =
    claims.reduce((sum, c) => sum + (c.explanation?.length || 0), 0) / claims.length;
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
      bg: 'from-blue-50 to-cyan-50',
      color: 'text-brand-primary',
      stat: accuracy_score > 80 ? '✓ Excellent' : accuracy_score > 60 ? '⚠ Fair' : '✗ Poor',
    },
    {
      title: 'Verified Claims',
      value: verified,
      icon: <TrendingUp size={20} />,
      bg: 'from-emerald-50 to-teal-50',
      color: 'text-emerald-600',
      stat: `${((verified / claims.length) * 100).toFixed(0)}% of total`,
    },
    {
      title: 'Risk Level',
      value: riskLevel,
      icon: <AlertTriangle size={20} />,
      bg: `from-${riskColor}-50 to-${riskColor}-50`,
      color: `text-${riskColor}-600`,
      stat: `${false_claims} false claims found`,
    },
    {
      title: 'Evidence Quality',
      value: `${((with_sources / claims.length) * 100).toFixed(0)}%`,
      icon: <Lightbulb size={20} />,
      bg: 'from-purple-50 to-pink-50',
      color: 'text-purple-600',
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
          className={`bg-gradient-to-br ${insight.bg} border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-300`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className={`${insight.color}`}>{insight.icon}</span>
            <span className="text-xs font-semibold text-text-light uppercase tracking-wide">
              {insight.title}
            </span>
          </div>
          <div className="mb-2">
            <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
          </div>
          <p className="text-xs text-text-secondary">{insight.stat}</p>
        </motion.div>
      ))}
    </div>
  );
}
