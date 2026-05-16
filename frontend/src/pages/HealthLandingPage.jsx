import BasthiDawakhana from '../components/BasthiDawakhana';

export default function HealthLandingPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="glass-card section-block relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🏥</div>
                <div className="relative z-10">
                    <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Healthcare Finder</h2>
                    <p className="text-text-secondary font-medium italic">Basthi Dawakhanas & Government Hospitals · 2026 Locations</p>
                </div>
            </div>

            <BasthiDawakhana />

            <div className="glass-card section-block bg-telangana-green/5 border-telangana-green/20">
                <h3 className="label-xs mb-4">🚑 24/7 Emergency Help</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a href="tel:108" className="bg-white/5 p-4 rounded-xl text-center hover:bg-white/10 transition-all border border-white/5">
                        <span className="block text-2xl mb-2">🚑</span>
                        <p className="text-xs font-bold text-white uppercase">108 Ambulance</p>
                    </a>
                    <a href="tel:104" className="bg-white/5 p-4 rounded-xl text-center hover:bg-white/10 transition-all border border-white/5">
                        <span className="block text-2xl mb-2">📞</span>
                        <p className="text-xs font-bold text-white uppercase">104 Health Help</p>
                    </a>
                    <a href="tel:181" className="bg-white/5 p-4 rounded-xl text-center hover:bg-white/10 transition-all border border-white/5">
                        <span className="block text-2xl mb-2">🛡️</span>
                        <p className="text-xs font-bold text-white uppercase">181 Safety Helpline</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
