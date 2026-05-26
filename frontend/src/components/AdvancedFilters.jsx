import { motion, AnimatePresence } from 'framer-motion'; 
import { Filter, X } from 'lucide-react'; 
import { useState } from 'react'; 

export default function AdvancedFilters({ onFilterChange, claims }) { 
  const [isOpen, setIsOpen] = useState(false); 
  const [filters, setFilters] = useState({ 
    status: 'all', 
    hasSource: 'all', 
    minLength: 0, 
 }); 

  const handleFilterChange = (key, value) => { 
    const newFilters = { ...filters, [key]: value }; 
    setFilters(newFilters); 
    onFilterChange(newFilters); 
 }; 

  const resetFilters = () => { 
    const defaultFilters = { status: 'all', hasSource: 'all', minLength: 0 }; 
    setFilters(defaultFilters); 
    onFilterChange(defaultFilters); 
 }; 

  const isFiltering =
    filters.status !== 'all' || filters.hasSource !== 'all' || filters.minLength > 0; 

  return (
 < div className ="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-semibold ${
          isFiltering
            ? 'bg-amber-100 text-amber-700 border border-amber-300'
            : 'bg-white border border-blue-100 text-text-secondary hover:bg-blue-50'
        }`}
      >
        <Filter size={18} />
        Filters {isFiltering && <span className="ml-1 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">Active</span>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-72 bg-white border border-blue-200 rounded-xl shadow-lg p-4 z-50"
          >
            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Verification Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-blue-100 rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Inaccurate">Inaccurate</option>
                  <option value="False">False</option>
                  <option value="Unverifiable">Unverifiable</option>
                </select>
              </div>

              {/* Has Source Filter */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Source Available</label>
                <select
                  value={filters.hasSource}
                  onChange={(e) => handleFilterChange('hasSource', e.target.value)}
                  className="w-full px-3 py-2 border border-blue-100 rounded-lg text-text-primary focus:outline-none focus:border-brand-primary"
                >
                  <option value="all">All</option>
                  <option value="with">With Source</option>
                  <option value="without">Without Source</option>
                </select>
              </div>

              {/* Minimum Claim Length */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Min. Claim Length</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.minLength}
                  onChange={(e) => handleFilterChange('minLength', parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-text-light mt-2">{filters.minLength} characters</p>
              </div>
            </div>

            {/* Reset Button */}
            {isFiltering && (
              <button
                onClick={resetFilters}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-text-primary hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
              >
                <X size={16} />
                Reset Filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
