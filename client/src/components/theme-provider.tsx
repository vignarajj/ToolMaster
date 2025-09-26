import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "toolmaster-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => {
      if (typeof window !== 'undefined') {
        return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
      }
      return defaultTheme;
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    const applyTheme = (themeToApply: "dark" | "light") => {
      // Remove all theme classes first
      root.classList.remove("light", "dark");
      
      // Add the new theme class
      root.classList.add(themeToApply);
      
      // Force apply styles immediately
      if (themeToApply === "dark") {
        root.style.colorScheme = "dark";
        body.style.backgroundColor = "hsl(222, 15%, 7%)";
        body.style.color = "hsl(210, 40%, 98%)";
      } else {
        root.style.colorScheme = "light";
        body.style.backgroundColor = "hsl(0, 0%, 98%)";
        body.style.color = "hsl(222, 15%, 20%)";
      }
    };

    let effectiveTheme: "dark" | "light";
    
    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const newSystemTheme = mediaQuery.matches ? "dark" : "light";
        applyTheme(newSystemTheme);
      };
      
      mediaQuery.addEventListener("change", handleChange);
      applyTheme(effectiveTheme);
      
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      effectiveTheme = theme as "dark" | "light";
      applyTheme(effectiveTheme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
