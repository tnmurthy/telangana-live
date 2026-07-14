import { Helmet } from 'react-helmet-async';
import BloodBankAlerts from '../components/BloodBankAlerts';

export default function BloodBankPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <Helmet>
        <title>Blood Banks & Alerts - Telangana.live</title>
        <meta
          name="description"
          content="Check blood bank locations, stock signals, and requirement alerts across Telangana districts."
        />
      </Helmet>

      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🩸</div>
        <div className="relative z-10">
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Blood Banks</h2>
          <p className="text-text-secondary font-medium italic">Locations, stock signals, and requirement alerts across Telangana</p>
        </div>
      </div>

      <BloodBankAlerts districtOverride="Telangana" />
    </div>
  );
}
