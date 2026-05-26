import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  FileText,
  Gauge,
  Lock,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';

export default function UploadZone({ onFileSelect, onAnalyze, isAnalyzing }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('balanced');

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        onFileSelect(acceptedFiles[0]);
      }
    },
  });

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  const fileSize = selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : '0.00';
  const fileName = selectedFile?.name || 'No PDF selected';

  const modes = [
    {
      id: 'fast',
      label: 'Fast',
      description: 'Shorter pass for quick triage',
      icon: Gauge,
    },
    {
      id: 'balanced',
      label: 'Balanced',
      description: 'Best default for most PDFs',
      icon: SearchCheck,
    },
    {
      id: 'strict',
      label: 'Strict',
      description: 'More cautious verdict review',
      icon: ShieldCheck,
    },
  ];

  const checks = [
    { label: 'Text extraction', active: Boolean(selectedFile) },
    { label: 'Claim discovery', active: Boolean(selectedFile) },
    { label: 'Evidence matching', active: analysisMode !== 'fast' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <section
          {...getRootProps()}
          className={`relative min-h-[430px] overflow-hidden rounded-xl border transition ${
            isDragActive
              ? 'border-brand-primary bg-sky-950/40 shadow-lg shadow-brand-primary/20'
              : 'border-slate-700 bg-slate-950/80'
          }`}
        >
          <input {...getInputProps()} />

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/70 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_38%)]" />

          <div className="relative flex min-h-[430px] flex-col justify-between p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
                  Document Intake
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-normal text-white sm:text-4xl">
                  Add a PDF and run a structured fact-check.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Drop the file into the intake area, review the basic checks, then start analysis when the document is ready.
                </p>
              </div>

              <div className="hidden rounded-lg border border-slate-700 bg-slate-900/80 p-3 sm:block">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
            </div>

            <button
              type="button"
              onClick={open}
              className={`mt-8 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center transition ${
                isDragActive
                  ? 'border-brand-primary bg-brand-primary/10'
                  : 'border-slate-600 bg-slate-900/55 hover:border-brand-primary/70 hover:bg-slate-900'
              }`}
            >
              <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 shadow-lg shadow-black/30">
                {selectedFile ? (
                  <FileText className="h-10 w-10 text-sky-300" />
                ) : (
                  <Upload className="h-10 w-10 text-sky-300" />
                )}
              </div>

              <div className="mt-5 max-w-md">
                <p className="text-lg font-semibold text-white">
                  {selectedFile ? fileName : isDragActive ? 'Release to attach PDF' : 'Drop PDF here or browse'}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {selectedFile
                    ? `${fileSize} MB attached and ready for review`
                    : 'PDF only, up to 10 MB. The document stays in memory during analysis.'}
                </p>
              </div>
            </button>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {checks.map((check) => (
                <div
                  key={check.label}
                  className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-3"
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    check.active
                      ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300'
                      : 'border-slate-600 text-slate-500'
                  }`}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-medium text-slate-300">{check.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="rounded-xl border border-slate-700 bg-slate-950/85 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Review
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">Analysis setup</h3>
            </div>
            {selectedFile && (
              <button
                type="button"
                onClick={clearFile}
                className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-red-500/50 hover:text-red-300"
                aria-label="Remove selected PDF"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 text-sky-300" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{fileName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedFile ? `${fileSize} MB PDF` : 'Choose a document to begin'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-sm font-semibold text-slate-300">Analysis mode</p>
            {modes.map((mode) => {
              const Icon = mode.icon;
              const selected = analysisMode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setAnalysisMode(mode.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    selected
                      ? 'border-brand-primary bg-brand-primary/10'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${selected ? 'text-sky-300' : 'text-slate-500'}`} />
                    <div>
                      <p className="text-sm font-semibold text-white">{mode.label}</p>
                      <p className="text-xs text-slate-500">{mode.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-sm font-semibold text-slate-300">What happens next</p>
            <div className="mt-3 space-y-3 text-sm text-slate-400">
              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                <p>Extract readable PDF text and prepare a document preview.</p>
              </div>
              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                <p>Identify concrete factual claims from the document.</p>
              </div>
              <div className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <p>Compare claims with evidence and generate verdicts.</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={onAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-950/30 transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running analysis
                </>
              ) : (
                <>
                  Run fact-check
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={open}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white"
            >
              Browse files
            </button>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
