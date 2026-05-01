import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

interface SettingsContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('voyage-font-size') as FontSize) || 'medium';
  });

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
    <SettingsContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
