export const config = { runtime: 'edge' };

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const payload = await req.json();
        const query = payload.query || "";

        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
        if (!GOOGLE_API_KEY) {
            return new Response(JSON.stringify({ 
                decision: "Consult Pandit", 
                explanation: "Unable to reach the celestial advisor (API Key missing). Please proceed with caution.", 
                raw_panchang: {} 
            }), { 
                status: 200, 
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
            });
        }

        const prompt = `You are a Vedic Astrologer. A user asks: "${query}". Based on general astrological principles for today, evaluate if this is auspicious. Respond STRICTLY in JSON: {"decision": "Yes" | "No" | "Wait", "explanation": "Short 2-sentence explanation."}`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7 }
            })
        });

        if (!geminiRes.ok) {
            throw new Error('Failed to fetch from Gemini');
        }

        const geminiData = await geminiRes.json();
        const text = geminiData.candidates[0].content.parts[0].text;
        
        // Clean up markdown JSON block if present
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(cleanText);

        return new Response(JSON.stringify(result), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
        });

    } catch (e) {
        console.error("Panchang Query Error:", e);
        return new Response(JSON.stringify({ 
            decision: "Consult Pandit", 
            explanation: "Unable to reach the celestial advisor due to a network error. Please proceed with caution.", 
            raw_panchang: {} 
        }), { 
            status: 200, 
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
        });
    }
}
