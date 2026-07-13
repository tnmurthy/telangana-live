import waterLevels from '../data/water_levels.json';
import { redisService } from './redisService';

export async function fetchWaterLevels() {
    try {
        const cached = await redisService.get('tg:water:levels');
        if (cached && cached.reservoirs) {
            return cached;
        }
    } catch (err) {
        console.warn('Failed to fetch water levels from Redis:', err);
    }
    return waterLevels;
}

