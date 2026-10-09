import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fuelPrices as staticFuelPrices } from '../data/fuelPrices';
import mandi from '../data/mandiPrices.json';
import { mandiIsCurrent } from './MandiTables';
import { fetchFuelPrices } from '../services/pricesService';
import { Card, CardHeader, StatChip } from './LocalPulse';

const ESSENTIALS = ['Onion', 'Tomato', 'Potato', 'Tur (red gram)'];

// Gold and silver were removed (TL-46): they were read from retail-rate pages
// whose terms may not allow it. The card links to the gold page instead.

export default function DailyRatesDashboard({ variant = 'default' }) {
    const [fuelPrices, setFuelPrices] = useState(staticFuelPrices);

    useEffect(() => {
        fetchFuelPrices().then((data) => data?.petrol && setFuelPrices((previous) => ({
            ...previous,
            petrol: { ...previous.petrol, price: data.petrol.price },
            diesel: { ...previous.diesel, price: data.diesel.price },
            ...(data.lpg ? { lpgHousehold: { ...previous.lpgHousehold, price: data.lpg.price } } : {}),
        })));
    }, []);

    const { petrol, diesel, lpgHousehold, city, date } = fuelPrices;
    const basketItems = mandiIsCurrent() ? (mandi.basket || []).filter((c) => ESSENTIALS.includes(c.name)) : [];

    return <Card accent="amber" className="animate-fade-in h-full">
        <CardHeader icon="✦" title={variant === 'district' ? 'Fuel & Commodities' : 'Daily Rates'} subtitle={`${city} prices`} status={date} />
        <div className="local-pulse-stat-grid">
            {petrol?.price != null && <StatChip label="Petrol" value={`₹${petrol.price}`} accent />}
            {diesel?.price != null && <StatChip label="Diesel" value={`₹${diesel.price}`} />}
            {lpgHousehold?.price != null && <StatChip label="LPG (14.2 kg)" value={`₹${lpgHousehold.price}`} />}
        </div>
        <div className="local-pulse-commodities">
            <div className="local-pulse-section-label"><span>Essential commodities</span><span>Mandi avg.</span></div>
            {basketItems.length > 0
                ? <div className="local-pulse-commodity-grid">{basketItems.map((item) => <div className="local-pulse-commodity" key={item.name}><span>{item.name}</span><strong>₹{Math.round(item.price).toLocaleString('en-IN')}/q</strong></div>)}</div>
                : <p className="text-[11px] text-text-muted">Mandi prices are not available right now. See <a href="https://agmarknet.gov.in/" target="_blank" rel="noopener noreferrer" className="underline">Agmarknet</a>.</p>}
            <p className="text-[10px] text-text-muted mt-1">Wholesale, per quintal · <Link to="/mandi-prices" className="underline">all mandi prices</Link></p>
        </div>
        <p className="text-[11px] text-text-muted mt-3">Gold and silver: <Link to="/rates/gold" className="underline">where to check today&apos;s rate</Link>.</p>
    </Card>;
}
