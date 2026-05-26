import { motion } from 'framer-motion';
import { Activity, Shield } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full border-b border-slate-800 bg-slate-950/90"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary text-white shadow-lg shadow-sky-950/40">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-normal text-white">FactFinder</h1>
            <p className="text-xs font-medium text-slate-500">PDF fact-checking workspace</p>
          </div>
        </div>

        <div className="hidden items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 sm:flex">
          <Activity className="h-4 w-4 text-emerald-300" />
          <span className="text-xs font-semibold text-slate-300">Analyzer ready</span>
        </div>
      </div>
    </motion.header>
  );
}
