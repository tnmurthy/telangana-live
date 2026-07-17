import ReportingMap from '../components/ReportingMap';
import GrievanceDashboard from '../components/GrievanceDashboard';
import KnowYourWard from '../components/KnowYourWard';

export default function ReportingLandingPage() {
    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero */}
            <div className="glass-card section-block relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">📌</div>
                <div className="relative z-10">
                    <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Digital Town Square</h2>
                    <p className="text-text-secondary font-medium italic">Report issues, track grievances, and find your ward — all in one place</p>
                </div>
            </div>

            {/* Drop-a-Pin Map */}
            <section>
                <div className="section-header">
                    <div>
                        <h2 className="section-title flex items-center gap-2">📌 Drop-a-Pin Report</h2>
                        <p className="section-subtitle">Click on the map to report an issue. Auto-routed to GHMC/CMC/MMC.</p>
                    </div>
                </div>
                <ReportingMap />
            </section>

            {/* Grievance Dashboard */}
            <section>
                <div className="section-header">
                    <div>
                        <h2 className="section-title flex items-center gap-2">📊 Prajavani 2.0 Dashboard</h2>
                        <p className="section-subtitle">Track accountability across all three corporations</p>
                    </div>
                </div>
                <GrievanceDashboard />
            </section>

            {/* Know Your Ward */}
            <section>
                <div className="section-header">
                    <div>
                        <h2 className="section-title flex items-center gap-2">🔍 Know Your Ward</h2>
                        <p className="section-subtitle">300 wards restructured in 2026 — find yours by colony name</p>
                    </div>
                </div>
                <KnowYourWard />
            </section>
        </div>
    );
}
