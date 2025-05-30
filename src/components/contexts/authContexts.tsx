import { createContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
};

export const AuthContexts = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }:any ) => {
    const [ user, setUser ] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userInfo:any) => {
        setUser(userInfo);
        console.log(userInfo);
        
        localStorage.setItem("user", JSON.stringify(userInfo.data.user));
        localStorage.setItem("token", userInfo.data.access_token);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }
    return (
        <AuthContexts.Provider value={{user, login, logout}}>
            {children}
        </AuthContexts.Provider>
    )
}
