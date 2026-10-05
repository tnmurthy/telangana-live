import { freshness } from '../utils/freshness';

/**
 * "Updated 3 h ago", or an amber "may be out of date" once the data is past
 * its limit. Used on every module that shows refreshed data.
 */
export default function UpdatedAt({ timestamp, maxAgeHours, className = '' }) {
    const { stale, text } = freshness(timestamp, maxAgeHours);
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-semibold ${stale ? 'text-amber-300' : 'text-text-muted'} ${className}`}
            title={timestamp || undefined}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${stale ? 'bg-amber-400' : 'bg-telangana-green'}`} aria-hidden="true" />
            {text}
        </span>
    );
}
