import './LocalPulse.css';

export function Card({ accent, className = '', children }) {
    return <section className={`local-pulse-card local-pulse-card--${accent} ${className}`}>{children}</section>;
}

export function CardHeader({ icon, title, subtitle, status }) {
    return (
        <header className="local-pulse-header">
            <div className="local-pulse-heading">
                <span className="local-pulse-icon" aria-hidden="true">{icon}</span>
                <div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
            </div>
            {status && <span className="local-pulse-status">{status}</span>}
        </header>
    );
}

export function StatChip({ label, value, accent = false, children }) {
    return <div className={`local-pulse-stat ${accent ? 'local-pulse-stat--accent' : ''}`}>
        <span>{label}</span><strong>{value}</strong>{children}
    </div>;
}

export function DataTable({ columns, rows, visibleRows = 4, expanded, onToggle, toggleLabel = 'View all' }) {
    const shownRows = expanded ? rows : rows.slice(0, visibleRows);
    return (
        <div className="local-pulse-data-section">
            <div className="local-pulse-section-label"><span>7-day trend</span>{rows.length > visibleRows && <button onClick={onToggle}>{expanded ? 'Show less' : `${toggleLabel} →`}</button>}</div>
            <div className={`local-pulse-table-wrap ${expanded ? 'is-expanded' : ''}`}>
                <table className="local-pulse-table"><thead><tr>{columns.map((column) => <th key={column.key} className={column.align === 'right' ? 'is-right' : ''}>{column.label}</th>)}</tr></thead>
                    <tbody>{shownRows.map((row, index) => <tr key={row.id || index}>{columns.map((column) => <td key={column.key} className={column.align === 'right' ? 'is-right' : ''}>{column.render ? column.render(row, index) : row[column.key]}</td>)}</tr>)}</tbody>
                </table>
                {!expanded && rows.length > visibleRows && <span className="local-pulse-fade" aria-hidden="true" />}
            </div>
        </div>
    );
}

export function CategoryList({ items, visibleRows = 5, expanded, onToggle }) {
    const shownItems = expanded ? items : items.slice(0, visibleRows);
    return <div className="local-pulse-list-wrap">
        <div className={`local-pulse-list ${expanded ? 'is-expanded' : ''}`}>{shownItems.map((item, index) => <div className={`local-pulse-list-row ${item.hot ? 'is-hot' : ''}`} key={item.name || index}><div><strong>{item.name}</strong><span>{item.slab}</span></div><div className="local-pulse-list-rate">{item.rate === 0 ? 'Free' : `₹${item.rate.toFixed(2)}`} <span>›</span></div></div>)}</div>
        {!expanded && items.length > visibleRows && <span className="local-pulse-fade" aria-hidden="true" />}
        {items.length > visibleRows && <button className="local-pulse-show-all" onClick={onToggle}>{expanded ? 'Show fewer categories' : `Show all ${items.length} categories`} →</button>}
    </div>;
}

export function AlertBox({ icon, lead, children, href, linkLabel }) {
    return <aside className="local-pulse-alert"><span aria-hidden="true">{icon}</span><div><p><strong>{lead}</strong> {children}</p>{href && <a href={href}>{linkLabel} →</a>}</div></aside>;
}

export function AqiGauge({ value, label, color }) {
    const percentile = Math.min(Math.max((value / 500) * 100, 2), 98);
    return <div className="local-pulse-aqi"><div className="local-pulse-aqi-top"><div><span>Air quality index</span><strong>{value}</strong></div><b style={{ color, borderColor: `${color}66`, backgroundColor: `${color}1c` }}>{label}</b></div><div className="local-pulse-aqi-scale"><i style={{ left: `${percentile}%`, backgroundColor: color }} /></div><div className="local-pulse-scale-labels"><span>Good</span><span>Moderate</span><span>Poor</span><span>Severe</span></div></div>;
}
