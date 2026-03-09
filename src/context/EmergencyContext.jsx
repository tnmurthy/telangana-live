import { createContext, useContext, useState, useCallback } from 'react';

const EmergencyContext = createContext();

export function EmergencyProvider({ children }) {
    const [isEmergencyActive, setIsEmergencyActive] = useState(false);
    const [emergencyType, setEmergencyType] = useState(null); // 'heatwave' | 'flood' | 'cold'

    const activateEmergency = useCallback((type = 'heatwave') => {
        setIsEmergencyActive(true);
        setEmergencyType(type);
    }, []);

    const deactivateEmergency = useCallback(() => {
        setIsEmergencyActive(false);
        setEmergencyType(null);
    }, []);

    return (
        <EmergencyContext.Provider value={{ isEmergencyActive, emergencyType, activateEmergency, deactivateEmergency }}>
            {children}
        </EmergencyContext.Provider>
    );
}

export function useEmergency() {
    const ctx = useContext(EmergencyContext);
    if (!ctx) throw new Error('useEmergency must be inside EmergencyProvider');
    return ctx;
}
