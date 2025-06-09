import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    successLight: string;
    error: string;
    errorLight: string;
  };
}

const lightColors = {
  primary: '#0052CC',
  background: '#F5F7FA',
  card: '#FFFFFF',
  text: '#172B4D',
  textSecondary: '#5E6C84',
  border: '#DFE1E6',
  success: '#36B37E',
  successLight: '#E3FCEF',
  error: '#FF5630',
  errorLight: '#FFEBE6',
};

const darkColors = {
  primary: '#4C9AFF',
  background: '#0E1624',
  card: '#1C2B41',
  text: '#F4F5F7',
  textSecondary: '#B3BAC5',
  border: '#253858',
  success: '#36B37E',
  successLight: '#133527',
  error: '#FF5630',
  errorLight: '#3E1F1A',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceTheme = useColorScheme() as ColorSchemeName;
  const [theme, setTheme] = useState<Theme>(deviceTheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  const value = {
    theme,
    toggleTheme,
    colors,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}