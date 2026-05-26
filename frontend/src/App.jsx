import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import Loader from './components/Loader';
import SummaryCards from './components/SummaryCards';
import ResultsTable from './components/ResultsTable';
import PDFPreview from './components/PDFPreview';
import KeyInsights from './components/KeyInsights';
import {
  AlertCircle,
  ArrowDownAZ,
  Copy,
  Download,
  FileText,
  RotateCcw,
  Search,
} from 'lucide-react';

function asText(value, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function normalizeReport(data) {
  const claims = Array.isArray(data?.claims) ? data.claims : [];

  return {
    filename: asText(data?.filename, 'Uploaded PDF'),
    total_claims: asNumber(data?.total_claims ?? claims.length),
    verified: asNumber(data?.verified),
    inaccurate: asNumber(data?.inaccurate),
    false_count: asNumber(data?.false_count),
    unverifiable: asNumber(data?.unverifiable),
    accuracy_score: asNumber(data?.accuracy_score),
    extracted_text: asText(data?.extracted_text),
    processed_at: asText(data?.processed_at, new Date().toISOString()),
    message: asText(data?.message),
    claims: claims.map((claim) => ({
      claim: asText(claim?.claim),
      status: asText(claim?.status, 'Unverifiable'),
      explanation: asText(claim?.explanation, 'Unable to verify this claim.'),
      correct_fact: asText(claim?.correct_fact),
      source: asText(claim?.source),
    })),
  };
}

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | processing | done | error
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [claimSearch, setClaimSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortMode, setSortMode] = useState('original');
  const [viewMode, setViewMode] = useState('claims');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Startup health check
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(`${API_URL}/`, {
          timeout: 5000,
        });
        console.log('[App] Backend is online:', response.data);
      } catch (err) {
        console.warn('[App] Backend health check failed:', {
          url: API_URL,
          error: err.message,
          code: err.code,
        });
      }
    };

    checkBackend();
  }, [API_URL]);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setStatus('processing');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('[App] Starting analysis for:', file.name);
      const response = await axios.post(`${API_URL}/api/factcheck`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000, // 2 minute timeout
      });

      console.log('[App] Analysis response:', response.data);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      const normalizedReport = normalizeReport(response.data);
      setReport(normalizedReport);
      setStatus('done');
      setViewMode(normalizedReport.total_claims > 0 ? 'claims' : 'text');
    } catch (err) {
      console.error('[App] Analysis error:', err);

      let errorMessage =
        err.response?.data?.error || err.message || 'An error occurred';

      // Add helpful hints for common errors
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Try a smaller PDF or check your internet connection.';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Analysis is taking too long. Try a PDF with fewer pages or claims.';
      } else if (!errorMessage) {
        errorMessage = `${err.response?.status || 'Unknown'} error from server. Check that the backend is running.`;
      }

      setError(errorMessage);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setReport(null);
    setError(null);
    setClaimSearch('');
    setStatusFilter('all');
    setSourceFilter('all');
    setSortMode('original');
    setViewMode('claims');
  };

  const filteredClaims = useMemo(() => {
    if (!report?.claims) return [];

    const query = claimSearch.trim().toLowerCase();
    const statusPriority = {
      False: 0,
      Inaccurate: 1,
      Unverifiable: 2,
      Error: 3,
      Verified: 4,
    };

    return report.claims
      .filter((claim) => {
        const matchesSearch = !query || [
          claim.claim,
          claim.explanation,
          claim.correct_fact,
          claim.source,
        ].some((value) => value.toLowerCase().includes(query));
        const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
        const hasSource = Boolean(claim.source.trim());
        const matchesSource =
          sourceFilter === 'all' ||
          (sourceFilter === 'with' && hasSource) ||
          (sourceFilter === 'without' && !hasSource);

        return matchesSearch && matchesStatus && matchesSource;
      })
      .sort((a, b) => {
        if (sortMode === 'risk') {
          return (statusPriority[a.status] ?? 9) - (statusPriority[b.status] ?? 9);
        }
        if (sortMode === 'status') {
          return a.status.localeCompare(b.status);
        }
        if (sortMode === 'source') {
          return Number(Boolean(b.source.trim())) - Number(Boolean(a.source.trim()));
        }
        return 0;
      });
  }, [claimSearch, report?.claims, sortMode, sourceFilter, statusFilter]);

  const exportReport = (format) => {
    if (!report) return;

    const baseName = report.filename.replace(/\.pdf$/i, '').replace(/[^\w-]+/g, '-');
    const blob =
      format === 'csv'
        ? new Blob([
            [
              'Claim,Status,Explanation,Correct Fact,Source',
              ...report.claims.map((claim) =>
                [
                  claim.claim,
                  claim.status,
                  claim.explanation,
                  claim.correct_fact,
                  claim.source,
                ].map((value) => `"${value.replace(/"/g, '""')}"`).join(',')
              ),
            ].join('\n'),
          ], { type: 'text/csv' })
        : new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factfinder-${baseName || 'report'}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copySummary = async () => {
    if (!report) return;

    await navigator.clipboard.writeText(
      `FactFinder report for ${report.filename}\n` +
      `Accuracy: ${report.accuracy_score}%\n` +
      `Verified: ${report.verified}, Inaccurate: ${report.inaccurate}, False: ${report.false_count}, Unverifiable: ${report.unverifiable}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-slate-100">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
                    Evidence-first PDF analysis
                  </p>
                  <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-normal text-white sm:text-5xl">
                    Upload a document. Extract claims. Review verdicts with sources.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                    A focused workspace for checking factual statements inside PDFs without losing sight of the original text.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'PDF only', value: '10MB' },
                    { label: 'Claim cap', value: '8' },
                    { label: 'Report', value: 'CSV' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-slate-800 bg-slate-950/80 p-4"
                    >
                      <p className="text-2xl font-black text-white">{item.value}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{item.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              <UploadZone
                onFileSelect={handleFileSelect}
                onAnalyze={handleAnalyze}
                isAnalyzing={false}
              />
            </motion.div>
          )}

          {status === 'processing' && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-96"
            >
              <Loader />
            </motion.div>
          )}

          {status === 'done' && report && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <SummaryCards
                filename={report.filename}
                total_claims={report.total_claims}
                verified={report.verified}
                inaccurate={report.inaccurate}
                false_count={report.false_count}
                processed_at={report.processed_at}
              />

              {report.total_claims > 0 && (
                <KeyInsights
                  claims={report.claims}
                  accuracy_score={report.accuracy_score}
                />
              )}

              <div className="flex flex-col gap-4 rounded-xl border border-slate-700/70 bg-slate-950/70 p-4 shadow-lg shadow-black/20">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setViewMode('claims')}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        viewMode === 'claims'
                          ? 'bg-brand-primary text-white'
                          : 'border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <FileText size={16} />
                      Claims
                    </button>
                    <button
                      onClick={() => setViewMode('text')}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        viewMode === 'text'
                          ? 'bg-brand-primary text-white'
                          : 'border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Search size={16} />
                      Extracted Text
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={copySummary}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      <Copy size={16} />
                      Copy Summary
                    </button>
                    <button
                      onClick={() => exportReport('csv')}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      <Download size={16} />
                      CSV
                    </button>
                    <button
                      onClick={() => exportReport('json')}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      <Download size={16} />
                      JSON
                    </button>
                  </div>
                </div>

                {viewMode === 'claims' && report.total_claims > 0 && (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <label className="relative md:col-span-2">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        value={claimSearch}
                        onChange={(event) => setClaimSearch(event.target.value)}
                        placeholder="Search claims, explanations, or sources"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-10 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-brand-primary"
                      />
                    </label>

                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-brand-primary"
                    >
                      <option value="all">All verdicts</option>
                      <option value="Verified">Verified</option>
                      <option value="Inaccurate">Inaccurate</option>
                      <option value="False">False</option>
                      <option value="Unverifiable">Unverifiable</option>
                    </select>

                    <select
                      value={sourceFilter}
                      onChange={(event) => setSourceFilter(event.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-brand-primary"
                    >
                      <option value="all">All sources</option>
                      <option value="with">With source</option>
                      <option value="without">No source</option>
                    </select>

                    <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-400 md:col-span-4 lg:col-span-1">
                      <ArrowDownAZ size={16} />
                      <select
                        value={sortMode}
                        onChange={(event) => setSortMode(event.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-slate-100 outline-none"
                      >
                        <option value="original">Original order</option>
                        <option value="risk">Highest risk first</option>
                        <option value="status">Status A-Z</option>
                        <option value="source">Sources first</option>
                      </select>
                    </label>
                  </div>
                )}
              </div>

              {viewMode === 'text' && report.extracted_text && (
                <PDFPreview
                  filename={report.filename}
                  extractedText={report.extracted_text}
                />
              )}

              {viewMode === 'claims' && report.total_claims > 0 && filteredClaims.length === 0 && (
                <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-6 text-center">
                  <p className="text-slate-300">No claims match the current filters.</p>
                </div>
              )}

              {viewMode === 'claims' && report.total_claims > 0 && !report.claims?.every(c => c.status === 'Unverifiable' || c.status === 'Error') && filteredClaims.length > 0 && (
                <ResultsTable claims={filteredClaims} />
              )}

              {report.total_claims === 0 && report.message && (
                <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-6 text-center">
                  <p className="text-slate-300 text-lg">{report.message}</p>
                </div>
              )}

              {viewMode === 'claims' && report.total_claims > 0 && report.claims?.every(c => c.status === 'Unverifiable' || c.status === 'Error') && filteredClaims.length > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
                  <h3 className="text-yellow-400 font-semibold mb-2">Verification Temporarily Unavailable</h3>
                  <p className="text-yellow-300 text-sm mb-3">
                    {report.total_claims} claims were extracted but verification failed (likely API rate limit).
                  </p>
                  <p className="text-yellow-300/70 text-xs mb-3">
                    Try again in a few minutes, or upgrade your API plan for unlimited verification.
                  </p>
                  <ResultsTable claims={filteredClaims} />
                </div>
              )}

              {report.message && !report.message.includes('No specific') && (
                <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-6 text-center">
                  <p className="text-slate-300 text-lg">{report.message}</p>
                </div>
              )}

              <button
                onClick={handleReset}
                className="w-full bg-gradient-to-r from-brand-primary to-brand-hover text-white font-semibold py-3 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Analyze Another Document
              </button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-96 gap-6"
            >
              <div className="w-full max-w-2xl bg-red-900/20 border border-red-700 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">
                      Analysis Failed
                    </h3>
                    <p className="text-red-300 text-sm mb-3">{error}</p>
                    <div className="text-xs text-red-400/70 space-y-1 bg-red-950/30 p-3 rounded mt-3">
                      <p><strong>Troubleshooting tips:</strong></p>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Make sure the PDF contains readable text (not scanned images)</li>
                        <li>Ensure the backend server is running: <code className="bg-red-950 px-1 rounded">npm run dev</code> in the backend folder</li>
                        <li>Check that API keys are set in backend/.env (GROQ_API_KEY, TAVILY_API_KEY)</li>
                        <li>Try with a PDF that has statistics, dates, or specific facts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-2xl">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gradient-to-r from-brand-primary to-brand-hover text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setStatus('idle');
                  }}
                  className="flex-1 border border-slate-600 text-slate-300 font-medium py-3 rounded-lg hover:bg-slate-800/30 transition"
                >
                  Upload New File
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full border-t border-slate-700 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-slate-400 text-sm">
            FactFinder © 2024 - AI-Powered Fact-Checking
          </p>
        </div>
      </footer>
    </div>
  );
}
