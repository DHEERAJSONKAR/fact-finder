import { motion, AnimatePresence } from 'framer-motion'; 
import { Star, X, BookmarkIcon } from 'lucide-react'; 
import { useState, useEffect } from 'react'; 

export default function StarredClaims({ claims = [] }) { 
  const [starredClaims, setStarredClaims] = useState([]); 
  const [isOpen, setIsOpen] = useState(false); 

  // Load starred claims from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('starredClaims');
    if (saved) {
      try {
        setStarredClaims(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load starred claims:', e);
      }
    }
  }, []);

  // Save starred claims to localStorage
  const toggleStar = (claim, index) => {
    const claimId = `${index}-${claim.claim.substring(0, 20)}`;
    const isStarred = starredClaims.some((s) => s.id === claimId);

    let updated;
    if (isStarred) {
      updated = starredClaims.filter((s) => s.id !== claimId);
    } else {
      updated = [
        ...starredClaims,
        { id: claimId, claim, timestamp: new Date().toISOString(), index },
      ];
    }
    setStarredClaims(updated);
    localStorage.setItem('starredClaims', JSON.stringify(updated));
  };

  const isClaimed = (claim, index) => {
    const claimId = `${index}-${claim.claim.substring(0, 20)}`;
    return starredClaims.some((s) => s.id === claimId);
  };

  const removeStarred = (id) => {
    const updated = starredClaims.filter((s) => s.id !== id);
    setStarredClaims(updated);
    localStorage.setItem('starredClaims', JSON.stringify(updated));
  };

  return (
    <div className="relative">
      {/* Starred Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-semibold ${
          starredClaims.length > 0
            ? 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200'
            : 'bg-white border border-blue-100 text-text-secondary hover:bg-blue-50'
        }`}
      >
        <Star size={18} fill={starredClaims.length > 0 ? 'currentColor' : 'none'} />
        Saved ({starredClaims.length})
      </motion.button>

      {/* Starred Claims Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-96 max-h-96 bg-white border border-blue-200 rounded-xl shadow-lg overflow-y-auto z-50"
          >
            {starredClaims.length === 0 ? (
              <div className="p-6 text-center">
                <BookmarkIcon className="w-12 h-12 text-text-light mx-auto mb-3" />
                <p className="text-text-secondary text-sm">No saved claims yet</p>
                <p className="text-text-light text-xs mt-2">
                  Star important claims to save them here
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {starredClaims.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-start justify-between p-3 hover:bg-blue-50 rounded-lg transition-colors group"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary line-clamp-2">
                        {item.claim.claim}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            item.claim.status === 'Verified'
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.claim.status === 'Inaccurate'
                              ? 'bg-amber-100 text-amber-700'
                              : item.claim.status === 'False'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.claim.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeStarred(item.id)}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 text-red-600 rounded transition-all"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star Icon in Claims */}
      {claims && claims.length > 0 && (
        <div className="absolute -top-10 left-0 pointer-events-none">
          {claims.map((claim, idx) => {
            const isStarred = isClaimed(claim, idx);
            return (
              <button
                key={`${idx}-star`}
                onClick={() => toggleStar(claim, idx)}
                className="hidden" // This is just for tracking, actual stars are in ClaimRow
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
