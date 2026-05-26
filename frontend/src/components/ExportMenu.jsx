import { motion } from 'framer-motion';
import { Download, FileText, Share2, Copy } from 'lucide-react';
import { useState } from 'react';

export default function ExportMenu({ report, filename }) {
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const exportAsJSON = () => {
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${filename.split('.')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportAsCSV = () => {
        let csv = 'Claim,Status,Explanation,Correct Fact,Source
';
        report.claims.forEach(claim => {
            const row = [
                `"${claim.claim.replace(/"/g, '""')}"`,
                claim.status,
                `"${claim.explanation.replace(/"/g, '""')}"`,
                `"${(claim.correct_fact || '').replace(/"/g, '""')}"`,
                claim.source || '',
            ].join(',');
            csv += row + '
';
        });
        const dataBlob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${filename.split('.')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const copyShareLink = () => {
        const shareData = {
            title: `Fact-Check Report: ${filename}`,
            text: `Accuracy Score: ${report.accuracy_score}% - ${report.verified} verified, ${report.inaccurate} inaccurate, ${report.false_count} false claims`,
            url: window.location.href,
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
            >
                <Download size={18} />
                Export & Share
            </motion.button>

            {showMenu && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white border border-blue-200 rounded-xl shadow-lg overflow-hidden z-50"
                >
                    <div className="p-2 space-y-1">
                        <button
                            onClick={exportAsJSON}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-left"
                        >
                            <FileText size={18} className="text-brand-primary" />
                            <div>
                                <p className="font-semibold text-text-primary text-sm">Export as JSON</p>
                                <p className="text-xs text-text-light">Full data format</p>
                            </div>
                        </button>

                        <button
                            onClick={exportAsCSV}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-left"
                        >
                            <FileText size={18} className="text-emerald-600" />
                            <div>
                                <p className="font-semibold text-text-primary text-sm">Export as CSV</p>
                                <p className="text-xs text-text-light">Spreadsheet format</p>
                            </div>
                        </button>

                        <button
                            onClick={copyShareLink}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors text-left"
                        >
                            <Share2 size={18} className="text-amber-600" />
                            <div>
                                <p className="font-semibold text-text-primary text-sm">{copied ? 'Link Copied!' : 'Share Report'}</p>
                                <p className="text-xs text-text-light">Copy or share link</p>
                            </div>
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
