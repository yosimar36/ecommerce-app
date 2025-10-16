import React,{
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

const ThemeContext = createContext (null);
const THEME_STORAGE_KEY = 'app:theme';

function getInitialTheme () {
    if (typeof window === 'undefined') return 'light';

    try {
        const fromStorage = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (fromStorage === 'light' || fromStorage ==='dark') return fromStorage;
    } catch (err) {
        console.error(err);
    }

    const prefersDark = 
    window.matchMedia && 
    window.matchMedia("(prefers-color-scheme:dark)").matches;
    return prefersDark ? "dark" : "light";
}

export function ThemeProvider ({children}){
    const [theme,setTheme] = useState(getInitialTheme);

    useEffect(()=>{
        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (error){
            if(typeof document !== "undefined"){
                document.documentElement.setAttribute("data-theme", theme);
            }
        }
    },[theme]);

    const value = useMemo(()=>{
        const isDarkMode= theme === 'dark';
        const toggleTheme = () => setTheme ((prev)=> prev === "dark");

        return {theme, isDarkMode, toggleTheme, setTheme};
    },[theme]);

    return(
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useTheme(){
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("use theme must be used within a themeProvider");

    return ctx;
}