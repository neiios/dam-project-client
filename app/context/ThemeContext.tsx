// context/ThemeContext.tsx
import React, { createContext, ReactNode, useContext } from "react";
import { styled, useColorScheme } from "nativewind";

interface ThemeContextType {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
