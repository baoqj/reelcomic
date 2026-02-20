import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './Icon';
import { LANGUAGE_OPTIONS, useI18n } from '../i18n';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
  const { language, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selected = useMemo(() => {
    return LANGUAGE_OPTIONS.find((item) => item.code === language) || LANGUAGE_OPTIONS[0];
  }, [language]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white/90 px-3 text-xs font-bold text-gray-700 shadow-sm transition-colors hover:border-primary/40 hover:text-primary dark:border-white/15 dark:bg-white/5 dark:text-gray-200"
        title={t('language.switch')}
        aria-label={t('language.switch')}
      >
        <Icon name="translate" className="text-[16px]" />
        <span>{compact ? selected.shortLabel : selected.nativeLabel}</span>
        <Icon name="expand_more" className={`text-[16px] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 min-w-[150px] overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-[#1f1116]">
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => {
                setLanguage(option.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                option.code === language
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-primary/10 hover:text-primary dark:text-gray-200'
              }`}
            >
              <span>{option.nativeLabel}</span>
              <span className={`text-[10px] font-black ${option.code === language ? 'text-white/90' : 'text-gray-400'}`}>
                {option.shortLabel}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
