import waterLevels from '../data/water_levels.json';

export async function fetchWaterLevels() {
    // In a real app, this might fetch from an API if hybrid JSON is not present.
    // For now, we return the hybrid synced JSON.
    return waterLevels;
}
