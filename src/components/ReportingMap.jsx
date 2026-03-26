import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reportCategories, mockReports, statusSteps, detectCorporation } from '../data/reportingData';
import ReportForm from './ReportForm';
import { n8nService } from '../services/n8nService';
import { citizenReportsService } from '../services/citizenReportsService';

// Fix default marker icons for leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored marker
function createIcon(color) {
    return L.divIcon({
        className: 'custom-pin',
        html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });
}

function ClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

function StatusBar({ status }) {
    const currentIdx = statusSteps.findIndex(s => s.key === status);
    return (
        <div className="flex items-center gap-1 mt-2">
            {statusSteps.map((step, i) => (
                <div key={step.key} className="flex items-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i <= currentIdx ? 'bg-success text-white' : 'bg-white/10 text-text-muted'}`}>
                        {step.icon}
                    </div>
                    {i < statusSteps.length - 1 && (
                        <div className={`w-6 h-0.5 ${i < currentIdx ? 'bg-success' : 'bg-white/10'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function ReportingMap() {
    const [reports, setReports] = useState(mockReports);
    const [clickedPos, setClickedPos] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filterCategory, setFilterCategory] = useState('all');

    // Fetch live reports from Supabase on mount
    useEffect(() => {
        const fetchLiveReports = async () => {
            const liveReports = await citizenReportsService.getApprovedReports();
            if (liveReports.length > 0) {
                // Merge with mock for demo, or replace? Let's merge for now
                setReports(prev => {
                    const existingIds = new Set(prev.map(r => r.id));
                    const newReports = liveReports.filter(r => !existingIds.has(r.id));
                    return [...newReports, ...prev];
                });
            }
        };

        fetchLiveReports();

        // Subscribe to realtime updates
        const subscription = citizenReportsService.subscribeToReports((newReport) => {
            setReports(prev => {
                // If it's an update, replace the existing one
                const idx = prev.findIndex(r => r.id === newReport.id);
                if (idx !== -1) {
                    const next = [...prev];
                    next[idx] = newReport;
                    return next;
                }
                // If it's a new report, add to front
                return [newReport, ...prev];
            });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleMapClick = useCallback((latlng) => {
        setClickedPos(latlng);
        setShowForm(true);
    }, []);

    const handleSubmit = useCallback((report) => {
        const corp = detectCorporation(report.lat, report.lng);
        const newReport = {
            ...report,
            id: Date.now(), // Local temp ID
            status: 'reported',
            corporation: corp.shortName,
            date: new Date().toISOString().split('T')[0],
        };

        // Async background send to n8n for moderation
        n8nService.sendReport(newReport);

        // We DON'T add to state immediately because it needs moderation
        // But for UX, we can show a "Pending Moderation" toast or similar
        setShowForm(false);
        setClickedPos(null);
        alert("Report submitted! It will appear on the map after AI moderation.");
    }, []);

    const filtered = filterCategory === 'all' ? reports : reports.filter(r => r.category === filterCategory);
    const catLookup = Object.fromEntries(reportCategories.map(c => [c.id, c]));

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilterCategory('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filterCategory === 'all' ? 'bg-white text-dark-bg' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
                >
                    All ({reports.length})
                </button>
                {reportCategories.map(cat => {
                    const count = reports.filter(r => r.category === cat.id).length;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setFilterCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${filterCategory === cat.id ? 'bg-white text-dark-bg' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
                        >
                            <span>{cat.icon}</span> {cat.label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Map */}
            <div className="glass-card overflow-hidden rounded-2xl border border-white/10" style={{ height: '480px' }}>
                <MapContainer
                    center={[17.385, 78.486]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <ClickHandler onMapClick={handleMapClick} />

                    {/* Existing reports */}
                    {filtered.map(report => {
                        const cat = catLookup[report.category];
                        return (
                            <Marker
                                key={report.id}
                                position={[report.lat, report.lng]}
                                icon={createIcon(cat?.color || '#fff')}
                            >
                                <Popup className="dark-popup">
                                    <div className="text-xs space-y-1.5 min-w-[200px]">
                                        <p className="font-black text-sm">{cat?.icon} {report.description}</p>
                                        <p className="text-gray-400">📍 {report.corporation} · Ward {report.ward}</p>
                                        <p className="text-gray-400">📅 {report.date}</p>
                                        <StatusBar status={report.status} />
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* Clicked position marker */}
                    {clickedPos && (
                        <Marker position={[clickedPos.lat, clickedPos.lng]}>
                            <Popup>
                                <p className="text-xs font-bold">📌 New report location</p>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>

            <p className="text-xs text-text-muted text-center">👆 Click anywhere on the map to drop a pin and report an issue</p>

            {/* Report Form Modal */}
            {showForm && clickedPos && (
                <ReportForm
                    lat={clickedPos.lat}
                    lng={clickedPos.lng}
                    onSubmit={handleSubmit}
                    onClose={() => { setShowForm(false); setClickedPos(null); }}
                />
            )}

            {/* Recent Reports List */}
            <div className="glass-card section-block">
                <h3 className="label-xs mb-4">📋 Recent Reports ({filtered.length})</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filtered.map(report => {
                        const cat = catLookup[report.category];
                        return (
                            <div key={report.id} className="detail-box flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: `${cat?.color}20` }}>
                                    {cat?.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white font-bold truncate">{report.description}</p>
                                    <p className="text-[10px] text-text-muted mt-1">📍 {report.corporation} · Ward {report.ward} · {report.date}</p>
                                    <StatusBar status={report.status} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
