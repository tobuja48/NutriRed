import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserByEmail, initDB } from '@/lib/db';

export type Role = 'banco' | 'cliente' | null;

export interface User {
    id: number;
    nombre: string;
    email: string;
    rol: Role;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Asegurar que la BD esté inicializada
        try {
            initDB();
        } catch (e) {
            // Error silently
        }

        // Recuperar sesión persistida
        const storedUser = localStorage.getItem('nutrired_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        // Simular un pequeño delay de red
        await new Promise(resolve => setTimeout(resolve, 600));

        const foundUser = getUserByEmail(email);

        if (!foundUser) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        if (foundUser.password !== password) {
            return { success: false, message: 'Contraseña incorrecta' };
        }

        // Eliminar contraseña antes de guardar en estado
        const userObj: User = {
            id: foundUser.id,
            nombre: foundUser.nombre,
            email: foundUser.email,
            rol: foundUser.rol as Role
        };

        setUser(userObj);
        localStorage.setItem('nutrired_user', JSON.stringify(userObj));
        
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('nutrired_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
