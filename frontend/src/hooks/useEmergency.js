import { useContext } from 'react';
import { EmergencyContext } from '../context/EmergencyContext';

export function useEmergency() {
    const ctx = useContext(EmergencyContext);
    if (!ctx) throw new Error('useEmergency must be inside EmergencyProvider');
    return ctx;
}
