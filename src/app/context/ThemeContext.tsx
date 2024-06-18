import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "nativewind";

interface ThemeContextType {
  colorScheme: "light" | "dark";
  toggleColorScheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const {
    colorScheme: systemColorScheme,
    setColorScheme: nativewindSetColorScheme,
  } = useColorScheme();
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    systemColorScheme
  );

  useEffect(() => {
    setColorScheme(systemColorScheme);
  }, [systemColorScheme]);

  const toggleColorScheme = (theme: "light" | "dark") => {
    setColorScheme(theme);
    nativewindSetColorScheme(theme);
  };

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
