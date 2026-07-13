import { useState, useEffect } from 'react';
import MetroCard from '../components/MetroCard';
import { fetchTransitStatus } from '../services/transitService';

export default function TransportLandingPage() {
    const [liveData, setLiveData] = useState(null);

    useEffect(() => {
        fetchTransitStatus().then(data => setLiveData(data));
    }, []);
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="glass-card section-block relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🚇</div>
                <div className="relative z-10">
                    <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Transit Dashboard</h2>
                    <p className="text-text-secondary font-medium italic">Metro, MMTS & RTC Free Bus Crowd-Meter · Live Updates</p>
                </div>
            </div>

            <MetroCard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card section-block border-telangana-green/20">
                    <h3 className="label-xs mb-4 flex justify-between">
                        <span>🚌 RTC Free Bus Crowd-Meter</span>
                        <span className="text-success animate-pulse-live">● LIVE</span>
                    </h3>
                    <div className="space-y-4">
                        {liveData ? liveData.rtc_flow.map(item => (
                            <div key={item.route} className="detail-box">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-white font-bold">{item.route}</span>
                                    <span className={item.flow > 75 ? 'text-danger' : 'text-success'}>{item.status}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${item.flow > 80 ? 'bg-danger' : item.flow > 50 ? 'bg-amber-500' : 'bg-success'}`} style={{ width: `${item.flow}%` }}></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-xs text-text-muted">Loading live RTC data...</p>
                        )}
                    </div>
                </div>

                <div className="glass-card section-block">
                    <h3 className="label-xs mb-4">📢 Transit Alerts</h3>
                    <div className="space-y-3">
                        {liveData ? liveData.alerts.map((alert, idx) => (
                            <div key={idx} className={`detail-box border-l-4 ${alert.type === 'maintenance' ? 'border-amber-500' : alert.type === 'traffic' ? 'border-danger' : 'border-telangana-green'}`}>
                                <p className="text-sm text-white font-bold">{alert.title}</p>
                                <p className="text-xs text-text-muted">{alert.description}</p>
                            </div>
                        )) : (
                            <p className="text-xs text-text-muted">Loading alerts...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
