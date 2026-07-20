import { useEffect, useState } from 'react';
import { goldRates as staticGoldRates } from '../data/goldRates';
import { fuelPrices as staticFuelPrices } from '../data/fuelPrices';
import { pulses as pulsesData } from '../data/pulses';
import { fetchGoldRates, fetchFuelPrices } from '../services/pricesService';
import { Card, CardHeader, DataTable, StatChip } from './LocalPulse';

const historyTabs = [{ key: 'gold22k', label: '22K', field: 'gold22k' }, { key: 'gold24k', label: '24K', field: 'gold24k' }, { key: 'silver', label: 'Silver', field: 'silver' }];
const changeClass = (value) => value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
const changeText = (value) => value === 0 ? '—' : `${value > 0 ? '▲' : '▼'} ₹${Math.abs(value)}`;

export default function DailyRatesDashboard({ variant = 'default' }) {
    const [goldRates, setGoldRates] = useState(staticGoldRates);
    const [fuelPrices, setFuelPrices] = useState(staticFuelPrices);
    const [activeTab, setActiveTab] = useState('gold22k');
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        fetchGoldRates().then((data) => data?.gold22k && setGoldRates((previous) => ({ ...previous, gold22k: { ...previous.gold22k, price: data.gold22k.price, change: data.gold22k.change ?? previous.gold22k.change }, gold24k: { ...previous.gold24k, price: data.gold24k.price, change: data.gold24k.change ?? previous.gold24k.change }, silver: { ...previous.silver, price: data.silver.price, change: data.silver.change ?? previous.silver.change }, date: data.lastUpdated ? new Date(data.lastUpdated).toISOString().slice(0, 10) : previous.date }))).catch(() => {});
        fetchFuelPrices().then((data) => data?.petrol && setFuelPrices((previous) => ({ ...previous, petrol: { ...previous.petrol, price: data.petrol.price, change: data.petrol.change ?? 0 }, diesel: { ...previous.diesel, price: data.diesel.price, change: data.diesel.change ?? 0 }, ...(data.lpg ? { lpgHousehold: { ...previous.lpgHousehold, price: data.lpg.price, change: data.lpg.change ?? 0 } } : {}), ...(data.cng ? { cngVehicle: { ...previous.cngVehicle, price: data.cng.price, change: data.cng.change ?? 0 } } : {}) }))).catch(() => {});
    }, []);
    const { gold22k, gold24k, silver, date, history } = goldRates;
    const currentTab = historyTabs.find((tab) => tab.key === activeTab);
    const rows = history.map((row, index) => ({ ...row, id: row.date, price: row[currentTab.field], delta: index ? row[currentTab.field] - history[index - 1][currentTab.field] : null }));
    const columns = [{ key: 'date', label: 'Date' }, { key: 'price', label: 'Price', align: 'right', render: (row) => `₹${row.price.toLocaleString()}` }, { key: 'delta', label: 'Δ', align: 'right', render: (row) => row.delta === null ? '—' : <span className={`local-pulse-delta ${changeClass(row.delta)}`}>{changeText(row.delta)}</span> }];
    return <Card accent="amber" className="animate-fade-in h-full">
        <CardHeader icon="✦" title={variant === 'district' ? 'Daily Rates & Fuel' : 'Daily Rates'} subtitle={`${goldRates.city} market`} status={date} />
        <div className="local-pulse-stat-grid"><StatChip label="Gold 22K" value={`₹${gold22k.price.toLocaleString()}`} accent><span className={`local-pulse-delta ${changeClass(gold22k.change)}`}>{changeText(gold22k.change)}</span></StatChip><StatChip label="Gold 24K" value={`₹${gold24k.price.toLocaleString()}`} accent><span className={`local-pulse-delta ${changeClass(gold24k.change)}`}>{changeText(gold24k.change)}</span></StatChip><StatChip label="Silver/g" value={`₹${silver.price.toLocaleString()}`}><span className={`local-pulse-delta ${changeClass(silver.change)}`}>{changeText(silver.change)}</span></StatChip></div>
        <div className="flex gap-1 mb-2">{historyTabs.map((tab) => <button key={tab.key} className={`text-[10px] px-2 py-1 rounded-full ${activeTab === tab.key ? 'bg-amber/15 text-amber-text' : 'text-text-muted hover:text-text-secondary'}`} onClick={() => { setActiveTab(tab.key); setExpanded(false); }}>{tab.label}</button>)}</div>
        <DataTable columns={columns} rows={rows} expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
        <div className="local-pulse-commodities"><div className="local-pulse-section-label"><span>Essential commodities</span><span>Market avg.</span></div><div className="local-pulse-commodity-grid">{pulsesData.commodities.slice(0, 4).map((item) => <div className="local-pulse-commodity" key={item.name}><span>{item.name}</span><strong>₹{item.price}/{item.unit}</strong></div>)}</div><div className="local-pulse-fuel"><span>Petrol <strong>₹{fuelPrices.petrol.price}</strong></span><span>Diesel <strong>₹{fuelPrices.diesel.price}</strong></span></div></div>
    </Card>;
}
