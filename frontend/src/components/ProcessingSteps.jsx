import { motion } from 'framer-motion'; 
import { CheckCircle, Circle } from 'lucide-react'; 

export default function ProcessingSteps({ currentStep = 1 }) { 
  const steps = [
    { num: 1, label: 'Parsing PDF' }, 
    { num: 2, label: 'Extracting Claims' }, 
    { num: 3, label: 'Web Search' }, 
    { num: 4, label: 'Verification' }, 
    { num: 5, label: 'Report Generation' }, 
]; 

  return (
 < div className ="w-full max-w-2xl mx-auto">
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="flex-shrink-0 relative">
              {step.num < currentStep ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </motion.div>
              ) : step.num === currentStep ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-10 h-10 bg-brand-primary/20 rounded-full flex items-center justify-center border-2 border-brand-primary"
                >
                  <span className="text-sm font-bold text-brand-primary">{step.num}</span>
                </motion.div>
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Circle className="w-6 h-6 text-text-light" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${
                step.num <= currentStep ? 'text-text-primary' : 'text-text-light'
              }`}>
                {step.label}
              </p>
              {step.num === currentStep && (
                <motion.div
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
                  className="h-1 bg-gradient-to-r from-brand-primary to-brand-light rounded mt-1"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
