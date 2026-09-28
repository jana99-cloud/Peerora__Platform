import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../LanguageContext'; // 🌟 مسار الاستيراد الصحيح من مجلد src
import { Language } from '../translations';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string }[] = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ur', label: 'اردو' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center gap-2 px-3.5 py-2 bg-white border-2 border-cream-300 rounded-btn shadow-soft hover:border-navy-400 transition-all text-xs font-bold text-navy-600 focus:outline-none"
      >
        <Globe size={15} className="text-navy-400" />
        <span>{currentLang.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white border-2 border-cream-300 rounded-card shadow-card py-1 z-[9999] animate-fade-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-right px-4 py-2 text-xs font-semibold transition-colors hover:bg-lavender-100 ${
                language === lang.code ? 'bg-lavender-100 text-fuchsia-600 font-bold' : 'text-navy-600'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
