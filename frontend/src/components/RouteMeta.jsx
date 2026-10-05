import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { STATIC_META, canonicalFor, isNoIndex } from '../utils/pageMeta';

// Canonical URL for every route, plus a title and description for routes
// whose page sets none (utils/pageMeta.js). index.html has no description
// or canonical of its own. react-helmet-async does not replace a description
// set by an outer Helmet, so STATIC_META only lists routes whose page sets
// none; pages with their own Helmet description are left alone.
export default function RouteMeta() {
    const { pathname } = useLocation();
    const meta = STATIC_META[pathname.replace(/\/+$/, '')];
    return (
        <Helmet>
            <link rel="canonical" href={canonicalFor(pathname)} />
            {meta && <title>{`${meta[0]} | Telangana.live`}</title>}
            {meta && <meta name="description" content={meta[1]} />}
            {isNoIndex(pathname) && <meta name="robots" content="noindex" />}
        </Helmet>
    );
}
