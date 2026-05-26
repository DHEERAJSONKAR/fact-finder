import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, AlertCircle, XCircle, HelpCircle, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';

export default function ClaimRow({
  index,
  claim,
  status,
  explanation,
  correct_fact,
  source,
}) {
  const [isStarred, setIsStarred] = useState(false);

  // Check if claim is starred on mount
  useEffect(() => {
    const claimId = `${index}-${claim.substring(0, 20)}`;
    const saved = localStorage.getItem('starredClaims');
    if (saved) {
      try {
        const starred = JSON.parse(saved);
        setIsStarred(starred.some((s) => s.id === claimId));
      } catch (e) {
        console.error('Failed to load starred claims:', e);
      }
    }
  }, []);

  const toggleStar = () => {
    const claimId = `${index}-${claim.substring(0, 20)}`;
    const saved = localStorage.getItem('starredClaims');
    let starred = saved ? JSON.parse(saved) : [];

    if (isStarred) {
      starred = starred.filter((s) => s.id !== claimId);
    } else {
      starred.push({
        id: claimId,
        claim: { claim, status, explanation, correct_fact, source },
        timestamp: new Date().toISOString(),
        index,
      });
    }

    localStorage.setItem('starredClaims', JSON.stringify(starred));
    setIsStarred(!isStarred);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Verified':
        return 'from-emerald-50/80 to-teal-50/60 border-emerald-200 hover:border-emerald-300 shadow-sm hover:shadow-md';
      case 'Inaccurate':
        return 'from-amber-50/80 to-orange-50/60 border-amber-200 hover:border-amber-300 shadow-sm hover:shadow-md';
      case 'False': flex - 1">
        < motion.div
        animate = {{ scale: [1, 1.05, 1] }
    }
    transition = {{ duration: 2, repeat: Infinity, delay: index * 0.1 }
  }
  className = "flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center"
    >
    <span className="text-sm font-bold text-text-secondary">#{index + 1}</span>
            </motion.div >

    <div className="flex-1 min-w-0">
      <p className="text-xs text-text-light font-semibold uppercase tracking-wider mb-1">
        Claim
      </p>
      <p className="text-base font-semibold text-text-primary line-clamp-2 hover:line-clamp-none cursor-default" title={claim}>
        {claim}
      </p>
    </div>
          </div >

    <div className="flex items-center gap-2 flex-shrink-0">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleStar}
        className={`p-2 rounded-lg transition-all duration-300 ${isStarred
            ? 'bg-amber-100 text-amber-600'
            : 'bg-blue-50 text-text-light hover:bg-blue-100'
          }`}
        title={isStarred ? 'Remove bookmark' : 'Bookmark claim'}
      >
        <Star size={18} fill={isStarred ? 'currentColor' : 'none'} />
      </motion.button>

      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
        className="flex-shrink-0"
      >
        {getStatusIcon()}
      </motion.div>
    </accent line at top */
}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        status === 'Verified' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
        status === 'Inaccurate' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
        status === 'False' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
        'bg-gradient-to-r from-slate-400 to-gray-400'
      }`}></div>

      <div className="relative p-6">
        {/* Header with index and status */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
              className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center"
            >
              <span className="text-sm font-bold text-text-secondary">#{index + 1}</span>
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-light font-semibold uppercase tracking-wider mb-1">
                Claim
              </p>
              <p className="text-base font-semibold text-text-primary line-clamp-2 hover:line-clamp-none cursor-default" title={claim}>
                {claim}
              </p>
            </div>
          </div>

          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
            className="flex-shrink-0"
          >
            {getStatusIcon()}
          </motion.div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <StatusBadge status={status} />
        </div>

        {/* Explanation section */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-xs text-text-light font-semibold uppercase tracking-wider mb-2">
            Analysis
          </p>
          <p className="text-sm text-text-primary leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Correct fact section (if available) */}
        {correct_fact && correct_fact.trim() && (
          <div className="mb-4 pb-4 border-b border-gray-200 bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-text-light font-semibold uppercase tracking-wider mb-2">
              Correct Information
            </p>
            <p className="text-sm text-text-primary italic">
              {correct_fact}
            </p>
          </div>
        )}

        {/* Source Link */}
        {source && source.trim() && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-light">Source Reference</span>
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 hover:border-brand-primary/50 text-brand-primary hover:text-brand-dark transition-all duration-300 text-xs font-semibold group/link"
            >
              <span>View Source</span>
              <ExternalLink size={14} className="group-hover/link:translate-x-1 group-hover/link:translate-y-1 transition-transform" />
            </a>
          </div>
        )}

        {!source || !source.trim() && (
          <div className="text-xs text-text-light">
            No source available
          </div>
        )}
      </div>
    </motion.div >
  );
}
