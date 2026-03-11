/**
 * n8n Service
 * Centralized handler for all outgoing webhooks to the Docker-hosted n8n instance.
 */

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook-test/';

/**
 * Generic helper to send data to an n8n webhook
 * @param {string} endpoint - The specific webhook endpoint
 * @param {object} data - The payload to send
 */
async function sendToN8N(endpoint, data) {
    if (!N8N_WEBHOOK_URL) {
        console.warn('n8n Webhook URL not configured. Skipping webhook.');
        return { success: false, error: 'Not configured' };
    }

    try {
        const response = await fetch(`${N8N_WEBHOOK_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                source: 'telangana.live',
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error(`n8n responded with status: ${response.status}`);
        }

        const result = await response.json().catch(() => ({ status: 'ok' }));
        return { success: true, result };
    } catch (error) {
        console.error('Failed to send data to n8n:', error);
        return { success: false, error: error.message };
    }
}

export const n8nService = {
    /**
     * Send a citizen report to n8n for processing
     */
    async sendReport(reportData) {
        return sendToN8N('citizen-report', reportData);
    },

    /**
     * Send a poll vote to n8n for aggregation
     */
    async sendPollVote(voteData) {
        return sendToN8N('poll-vote', voteData);
    }
};
