import { useState, useCallback } from 'react';
import { EmergencyContext } from './EmergencyContext';

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
