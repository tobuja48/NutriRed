import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
    lotes as initialLotes,
    despachos as initialDespachos,
    donantes as initialDonantes,
    type Lote,
    type Despacho,
    type Donante,
} from '@/data/mockData';

interface AppContextType {
    lotes: Lote[];
    despachos: Despacho[];
    allDonantes: Donante[];
    addLote: (lote: Lote) => void;
    updateLote: (id: number, updates: Partial<Lote>) => void;
    addDespacho: (despacho: Despacho) => void;
    addDonante: (donante: Donante) => void;
    setLotes: React.Dispatch<React.SetStateAction<Lote[]>>;
    setDespachos: React.Dispatch<React.SetStateAction<Despacho[]>>;
    setDonantes: React.Dispatch<React.SetStateAction<Donante[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [lotes, setLotes] = useState<Lote[]>(() => {
        const saved = localStorage.getItem('nutrired_lotes');
        return saved ? JSON.parse(saved) : initialLotes;
    });
    const [despachos, setDespachos] = useState<Despacho[]>(() => {
        const saved = localStorage.getItem('nutrired_despachos');
        return saved ? JSON.parse(saved) : initialDespachos;
    });
    const [allDonantes, setAllDonantes] = useState<Donante[]>(() => {
        const saved = localStorage.getItem('nutrired_donantes');
        return saved ? JSON.parse(saved) : initialDonantes;
    });

    useEffect(() => {
        localStorage.setItem('nutrired_lotes', JSON.stringify(lotes));
    }, [lotes]);

    useEffect(() => {
        localStorage.setItem('nutrired_despachos', JSON.stringify(despachos));
    }, [despachos]);

    useEffect(() => {
        localStorage.setItem('nutrired_donantes', JSON.stringify(allDonantes));
    }, [allDonantes]);

    const addLote = useCallback((lote: Lote) => {
        setLotes(prev => [...prev, lote]);
    }, []);

    const updateLote = useCallback((id: number, updates: Partial<Lote>) => {
        setLotes(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    }, []);

    const addDespacho = useCallback((despacho: Despacho) => {
        setDespachos(prev => [...prev, despacho]);
    }, []);

    const addDonante = useCallback((donante: Donante) => {
        setAllDonantes(prev => [...prev, donante]);
    }, []);

    return (
        <AppContext.Provider value={{ lotes, despachos, allDonantes, addLote, updateLote, addDespacho, addDonante, setLotes, setDespachos, setDonantes: setAllDonantes }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
}
