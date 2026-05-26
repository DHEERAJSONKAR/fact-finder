import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setIsDark(savedTheme === 'dark');
        applyTheme(savedTheme === 'dark');
    }, []);

    const applyTheme = (dark) => {
        const html = document.documentElement;
        if (dark) {
            html.style.background = 'linear-gradient(135deg, #0F172A 0%, #1a2847 50%, #0F172A 100%)';
            html.classList.add('dark-mode');
        } else { \n      html.style.background = 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 50%, #F3F4F6 100%)'; \n      html.classList.remove('dark-mode'); \n } \n
    }; \n\n  const toggleTheme = () => { \n    const newDark = !isDark; \n    setIsDark(newDark); \n    localStorage.setItem('theme', newDark ? 'dark' : 'light'); \n    applyTheme(newDark); \n }; \n\n  return (\n < motion.button\n      whileHover = {{ scale: 1.05 }
} \n      whileTap = {{ scale: 0.95 }}\n      onClick = { toggleTheme }\n      className =\"p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-brand-primary transition-all duration-300\"\n      title=\"Toggle theme\"\n    >\n      {isDark ? <Sun size={20} /> : <Moon size={20} />}\n    </motion.button>\n  );\n}\n