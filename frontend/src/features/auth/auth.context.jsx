import { createContext, useState,useEffect } from "react";
import {getProfile} from './services/api.service.js'

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function getUserAndSet() {
            try {
                setLoading(true);
                const data = await getProfile();
                setUser(data.user);
            } catch (err) {
                console.error("getUserAndSet:", err);
            } finally {
                setLoading(false);
            }
        }
        getUserAndSet();
    },[]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
