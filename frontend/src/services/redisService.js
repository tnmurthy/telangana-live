/**
 * Lightweight REST-based Redis client for Upstash.
 * avoiding heavy dependencies and keeping the 2026 civic portal fast.
 */
const REDIS_URL = import.meta.env.VITE_UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN;

export const redisService = {
    async get(key) {
        if (!REDIS_URL || !REDIS_TOKEN) return null;
        try {
            const response = await fetch(`${REDIS_URL}/get/${key}`, {
                headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
            });
            const data = await response.json();
            return data.result ? JSON.parse(data.result) : null;
        } catch (error) {
            console.error('Redis GET error:', error);
            return null;
        }
    },

    async set(key, value, ex = null) {
        if (!REDIS_URL || !REDIS_TOKEN) return false;
        try {
            const url = ex 
                ? `${REDIS_URL}/set/${key}?EX=${ex}` 
                : `${REDIS_URL}/set/${key}`;
                
            const response = await fetch(url, {
                method: 'POST',
                headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
                body: JSON.stringify(value)
            });
            const data = await response.json();
            return data.result === 'OK';
        } catch (error) {
            console.error('Redis SET error:', error);
            return false;
        }
    }
};
