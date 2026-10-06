import { computePanchang } from '../../src/utils/panchang.js';

export const config = { runtime: 'edge' };

// Today's panchang for Hyderabad, computed on each request (see
// src/utils/panchang.js). This used to return one fixed reading every day.
export default async function handler() {
    return new Response(JSON.stringify(computePanchang(new Date())), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            // Short cache so the new IST day shows within minutes of midnight.
            'Cache-Control': 's-maxage=600, stale-while-revalidate=60',
            'Access-Control-Allow-Origin': '*',
        },
    });
}
