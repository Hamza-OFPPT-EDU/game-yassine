import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type DisplayMode = 'light' | 'dark' | 'system';
export type Language = 'fr' | 'ar';

interface SettingsContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  freeExploration: boolean;
  setFreeExploration: (enabled: boolean) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('voyage-font-size') as FontSize) || 'medium';
  });

  const [freeExploration, setFreeExploration] = useState<boolean>(() => {
    return localStorage.getItem('voyage-free-exploration') === 'true';
  });

  const [displayMode, setDisplayMode] = useState<DisplayMode>(() => {
    return (localStorage.getItem('voyage-display-mode') as DisplayMode) || 'light';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('voyage-language') as Language) || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('voyage-free-exploration', String(freeExploration));
  }, [freeExploration]);

  useEffect(() => {
    localStorage.setItem('voyage-display-mode', displayMode);
    // Apply theme to document
    if (displayMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (displayMode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [displayMode]);

  useEffect(() => {
    localStorage.setItem('voyage-language', language);
    // Update document direction and lang
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('voyage-font-size', fontSize);
    
    // Apply to document root font-size
    const root = document.documentElement;
    switch (fontSize) {
      case 'small': root.style.fontSize = '13.3px'; break;
      case 'medium': root.style.fontSize = '15.2px'; break;
      case 'large': root.style.fontSize = '17.1px'; break;
      case 'extra-large': root.style.fontSize = '19px'; break;
    }
  }, [fontSize]);

  return (
    <SettingsContext.Provider value={{ 
      fontSize, setFontSize, 
      freeExploration, setFreeExploration,
      displayMode, setDisplayMode,
      language, setLanguage
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
