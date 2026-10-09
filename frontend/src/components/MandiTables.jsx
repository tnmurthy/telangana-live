import mandi from '../data/mandiPrices.json';

// Wholesale prices and MSPs from the daily Agmarknet snapshot
// (backend/scripts/mandi_sync.py, TL-49). Prices are arrival-weighted averages
// in Rs./quintal; an MSP crop's price is shown only when enough was traded
// that day (minArrivalTonnes), since a few sales swing the average.

const MAX_AGE_DAYS = 7;
const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const fmtDate = (iso) => new Date(`${iso}T12:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export function mandiIsCurrent(now = new Date()) {
    if (!mandi?.toDate) return false;
    return now - new Date(`${mandi.toDate}T23:59:59+05:30`) <= MAX_AGE_DAYS * 24 * 3600 * 1000;
}

export function MandiSource() {
    return (
        <p className="text-[11px] text-text-muted">
            Source: <a href={mandi.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{mandi.source}</a>.
            Wholesale prices at regulated markets in {mandi.state}, per quintal (100 kg). Retail prices are higher.
        </p>
    );
}

function Unavailable() {
    return (
        <p className="text-xs text-text-muted">
            Mandi prices are not available right now. See <a href="https://agmarknet.gov.in/" target="_blank" rel="noopener noreferrer" className="underline">Agmarknet</a>.
        </p>
    );
}

export function BasketTable() {
    if (!mandiIsCurrent() || !mandi.basket?.length) return <Unavailable />;
    return (
        <div className="space-y-2">
            <p className="text-xs text-text-muted">
                Average price, {fmtDate(mandi.fromDate)} – {fmtDate(mandi.toDate)}, with the same days a year ago.
            </p>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-text-muted text-left">
                        <th className="py-2 font-semibold">Commodity</th>
                        <th className="py-2 font-semibold text-right">Price</th>
                        <th className="py-2 font-semibold text-right">A year ago</th>
                    </tr>
                </thead>
                <tbody>
                    {mandi.basket.map((c) => {
                        const change = c.yearAgo ? Math.round(((c.price - c.yearAgo) / c.yearAgo) * 100) : null;
                        return (
                            <tr key={c.name} className="border-t border-white/[0.05]">
                                <td className="py-2 text-text-secondary">{c.name}</td>
                                <td className="py-2 text-right font-bold text-white">{inr(c.price)}</td>
                                <td className="py-2 text-right text-text-muted">
                                    {c.yearAgo ? <>{inr(c.yearAgo)} <span className={change >= 0 ? 'text-orange-300' : 'text-telangana-green'}>({change >= 0 ? '+' : ''}{change}%)</span></> : '—'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export function MspTable() {
    if (!mandiIsCurrent() || !mandi.msp?.length) return <Unavailable />;
    return (
        <div className="space-y-2">
            <p className="text-xs text-text-muted">
                Minimum Support Prices{mandi.mspSeason ? ` for ${mandi.mspSeason}` : ''}, with the latest market price where at least {mandi.minArrivalTonnes} tonnes were traded.
            </p>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-text-muted text-left">
                        <th className="py-2 font-semibold">Crop</th>
                        <th className="py-2 font-semibold text-right">MSP</th>
                        <th className="py-2 font-semibold text-right">Market</th>
                    </tr>
                </thead>
                <tbody>
                    {mandi.msp.map((c) => (
                        <tr key={c.name} className="border-t border-white/[0.05]">
                            <td className="py-2 text-text-secondary">{c.name}</td>
                            <td className="py-2 text-right font-bold text-heritage-gold">{inr(c.msp)}</td>
                            <td className="py-2 text-right">
                                {c.price != null
                                    ? <span className={c.price < c.msp ? 'text-orange-300' : 'text-white'}>{inr(c.price)}</span>
                                    : <span className="text-[11px] text-text-muted">{c.arrivalTonnes != null ? 'too few sales' : 'not traded'}</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-[11px] text-text-muted">Market prices below MSP are shown in orange. Reported {mandi.msp[0]?.reportedDate?.replace(/-/g, '/')}.</p>
        </div>
    );
}
