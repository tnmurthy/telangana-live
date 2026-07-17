import { useState, useCallback, useEffect } from 'react';
import { EmergencyContext } from './EmergencyContext';
import { emergencyService } from '../services/emergencyService';

export function EmergencyProvider({ children }) {
    const [isEmergencyActive, setIsEmergencyActive] = useState(false);
    const [emergencyType, setEmergencyType] = useState(null); // 'heatwave' | 'flood' | 'cold'
    const [emergencyData, setEmergencyData] = useState(null);

    const updateFromSupabase = useCallback((data) => {
        if (data) {
            setIsEmergencyActive(data.active);
            setEmergencyType(data.active ? data.type : null);
            setEmergencyData(data);
        }
    }, []);

    // Initial fetch and subscribe
    useEffect(() => {
        const initStatus = async () => {
            const data = await emergencyService.getStatus();
            updateFromSupabase(data);
        };

        initStatus();
        const subscription = emergencyService.subscribe(updateFromSupabase);

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [updateFromSupabase]);

    const activateEmergency = useCallback((type = 'heatwave') => {
        setIsEmergencyActive(true);
        setEmergencyType(type);
    }, []);

    const deactivateEmergency = useCallback(() => {
        setIsEmergencyActive(false);
        setEmergencyType(null);
    }, []);

    return (
        <EmergencyContext.Provider value={{ 
            isEmergencyActive, 
            emergencyType, 
            emergencyData,
            activateEmergency, 
            deactivateEmergency 
        }}>
            {children}
        </EmergencyContext.Provider>
    );
}
