import MetroCard from '../components/MetroCard';

// The page showed an "RTC Free Bus Crowd-Meter · LIVE" and transit alerts
// read from a file last written in May; neither was live (TL-47).
export default function TransportLandingPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="glass-card section-block relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🚇</div>
                <div className="relative z-10">
                    <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Getting Around Hyderabad</h2>
                    <p className="text-text-secondary">Metro lines, buses and MMTS, with links to each operator for timings.</p>
                </div>
            </div>
            <MetroCard />
        </div>
    );
}
