/**
 * Standard WhatsApp Caption Generator
 */
const generateWACaption = (type, data, customTitle, customLink) => {
    const base = "Get live updates on telangana.live";

    switch (type) {
        case 'gold':
            return `Current Gold Rate (${data.label}) in Hyderabad today: ₹${data.price.toLocaleString()}${data.unit}. ${base}`;
        case 'fuel':
            return `${data.type} Price in Hyderabad: ₹${data.price}${data.unit || '/L'}. Steady as of March 2026. ${base}`;
        case 'metro':
            return `Metro Status: ${data.line} is ${data.status} (${data.crowdLabel}). Next train in 3 mins. ${base}`;
        case 'weather':
            return `Weather Alert for ${data.district}: ${data.temp}°C, ${data.condition}. ${base}`;
        case 'custom':
            const title = customTitle || (data && data.title) || "Check this out";
            const link = customLink || (data && data.link) || "https://telangana.live";
            return `${title} - ${link}`;
        default:
            return base;
    }
};

/**
 * Common WhatsApp Share Component
 */
export default function ShareWhatsApp({ type, data, customTitle, customLink, className = "" }) {
    const caption = generateWACaption(type, data, customTitle, customLink);
    const url = `https://wa.me/?text=${encodeURIComponent(caption)}`;

    return (
        <a href={url} target="_blank" rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-xs text-green-400/80 hover:text-green-300 transition-all duration-300 px-2.5 py-1.5 rounded-lg hover:bg-green-400/10 ${className}`}
            title="Share to WhatsApp">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.113 1.519 5.845L.034 24l6.325-1.655A11.927 11.927 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82a9.796 9.796 0 01-5.285-1.539l-.38-.225-3.94 1.033 1.052-3.844-.248-.394A9.795 9.795 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82S21.82 6.578 21.82 12 17.422 21.82 12 21.82z" />
            </svg>
            Share
        </a>
    );
}
