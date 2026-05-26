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
      className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-1">📄 Extracted Document Text</h3>
          <p className="text-sm text-text-secondary">{filename} • {fullLength} characters</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-2 bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary rounded-lg transition duration-200"
        >
          <Copy size={16} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Preview Text */}
      <div className="mb-4 p-4 bg-white rounded-lg border border-blue-100">
        <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
          {previewText}
          {fullLength > 300 && <span className="text-text-light">...</span>}
        </p>
      </div>

      {/* Expand/Collapse */}
      {fullLength > 300 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-blue-50 text-text-primary border border-blue-100 rounded-lg transition duration-200"
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
          className="mt-4 p-4 bg-white rounded-lg border border-blue-100 max-h-96 overflow-y-auto"
        >
          <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
            {extractedText}
          </p>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-blue-100">
        <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
          <p className="text-2xl font-bold text-brand-primary">{(fullLength / 1000).toFixed(1)}</p>
          <p className="text-xs text-text-light">KB</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
          <p className="text-2xl font-bold text-brand-primary">{Math.round(fullLength / 5)}</p>
          <p className="text-xs text-text-light">Estimated Words</p>
        </div>
      </div>
    </motion.div>
  );
}
