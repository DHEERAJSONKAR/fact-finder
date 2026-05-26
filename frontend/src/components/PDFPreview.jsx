import { motion } from 'framer-motion';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function PDFPreview({ extractedText, filename }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Preview text (first 300 chars)
  const previewText = extractedText?.substring(0, 300) || '';
  const fullLength = extractedText?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-cyan-950/30 border border-slate-700/70 rounded-xl p-6 shadow-lg shadow-black/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Extracted Document Text</h3>
          <p className="text-sm text-slate-400">{filename} • {fullLength} characters</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 bg-brand-primary/15 hover:bg-brand-primary/25 text-sky-200 border border-brand-primary/30 rounded-lg transition duration-200"
        >
          <Copy size={16} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Preview Text */}
      <div className="mb-4 p-4 bg-slate-950/70 rounded-lg border border-slate-700">
        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
          {previewText}
          {fullLength > 300 && <span className="text-slate-500">...</span>}
        </p>
      </div>

      {/* Expand/Collapse */}
      {fullLength > 300 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg transition duration-200"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={18} /> Show Less
            </>
          ) : (
            <>
              <ChevronDown size={18} /> Show Full Text ({fullLength} chars)
            </>
          )}
        </button>
      )}

      {/* Full Text (expanded) */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 bg-slate-950/80 rounded-lg border border-slate-700 max-h-96 overflow-y-auto"
        >
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
            {extractedText}
          </p>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700">
        <div className="bg-slate-950/60 rounded-lg p-3 text-center border border-slate-700">
          <p className="text-2xl font-bold text-sky-300">{(fullLength / 1000).toFixed(1)}</p>
          <p className="text-xs text-slate-500">KB</p>
        </div>
        <div className="bg-slate-950/60 rounded-lg p-3 text-center border border-slate-700">
          <p className="text-2xl font-bold text-sky-300">{Math.round(fullLength / 5)}</p>
          <p className="text-xs text-slate-500">Estimated Words</p>
        </div>
      </div>
    </motion.div>
  );
}
