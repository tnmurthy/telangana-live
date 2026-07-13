const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class CivicServicesAPI {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 15 * 60 * 1000; // 15 mins
    }

    async getServices(district = '') {
        const cacheKey = `services_${district}`;
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const url = district ? `${API_URL}/api/civic/services?district=${encodeURIComponent(district)}` : `${API_URL}/api/civic/services`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch services');
            
            const rawData = await response.json();
            const formattedData = this.formatDataForUI(rawData);

            this.cache.set(cacheKey, {
                data: formattedData,
                timestamp: Date.now()
            });

            return formattedData;
        } catch (error) {
            console.error('Error fetching civic services:', error);
            // Graceful degradation: return empty object if backend is down
            return {};
        }
    }

    /**
     * Transforms the flat API registry into the grouped structure expected by the UI.
     */
    formatDataForUI(apiData) {
        if (!apiData || !Array.isArray(apiData)) return {};

        const grouped = {};
        
        apiData.forEach(service => {
            const catKey = service.category.toLowerCase();
            if (!grouped[catKey]) {
                // Initialize group
                grouped[catKey] = {
                    icon: this.mapIcon(service.category),
                    label: service.category,
                    description: `Official ${service.category} portals and services.`,
                    count: 0,
                    items: []
                };
            }
            
            grouped[catKey].items.push({
                name: service.name,
                area: 'Online Portal',
                type: 'Government',
                url: service.url,
                rating: 5.0
            });
            grouped[catKey].count += 1;
        });

        return grouped;
    }

    mapIcon(category) {
        const map = {
            'Utility': 'Power',
            'Government': 'FileText',
            'Health': 'Hospital',
            'Education': 'School'
        };
        return map[category] || 'Briefcase';
    }
}

export const civicServicesAPI = new CivicServicesAPI();
