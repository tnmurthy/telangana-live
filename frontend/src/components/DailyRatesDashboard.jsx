import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fuelPrices as staticFuelPrices } from '../data/fuelPrices';
import { pulses as pulsesData } from '../data/pulses';
import { fetchFuelPrices } from '../services/pricesService';
import { Card, CardHeader, StatChip } from './LocalPulse';

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

    return <Card accent="amber" className="animate-fade-in h-full">
        <CardHeader icon="✦" title={variant === 'district' ? 'Fuel & Commodities' : 'Daily Rates'} subtitle={`${city} prices`} status={date} />
        <div className="local-pulse-stat-grid">
            {petrol?.price != null && <StatChip label="Petrol" value={`₹${petrol.price}`} accent />}
            {diesel?.price != null && <StatChip label="Diesel" value={`₹${diesel.price}`} />}
            {lpgHousehold?.price != null && <StatChip label="LPG (14.2 kg)" value={`₹${lpgHousehold.price}`} />}
        </div>
        <div className="local-pulse-commodities">
            <div className="local-pulse-section-label"><span>Essential commodities</span><span>Market avg.</span></div>
            {pulsesData.commodities.length > 0
                ? <div className="local-pulse-commodity-grid">{pulsesData.commodities.slice(0, 4).map((item) => <div className="local-pulse-commodity" key={item.name}><span>{item.name}</span><strong>₹{item.price}/{item.unit}</strong></div>)}</div>
                : <p className="text-[11px] text-text-muted">Mandi prices are not available here yet. See <a href={pulsesData.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">Agmarknet</a>.</p>}
        </div>
        <p className="text-[11px] text-text-muted mt-3">Gold and silver: <Link to="/rates/gold" className="underline">where to check today&apos;s rate</Link>.</p>
    </Card>;
}
