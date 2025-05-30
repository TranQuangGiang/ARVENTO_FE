import { createContext, useEffect, useState, type ReactNode } from "react";

type DarkModeContextType = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DarkModeContext = createContext<DarkModeContextType>({
    darkMode: false,
    setDarkMode: () => {},
});

export const DarkModelProvider = ({ children }: {children: ReactNode }) => {
    const [ darkMode, setDarkMode ] = useState(false);
    useEffect(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) setDarkMode(JSON.parse(saved))
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if(darkMode) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <DarkModeContext.Provider value={{darkMode, setDarkMode}}>
            {children}
        </DarkModeContext.Provider>
    )
}
