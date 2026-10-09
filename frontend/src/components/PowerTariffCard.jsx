import { Card, CardHeader } from './LocalPulse';

// The card listed per-unit rates, effective "2026-03-01", that were not taken
// from a tariff order (TL-47). It now points to the regulator and the
// distribution company.
export default function PowerTariffCard({ variant = 'default' }) {
    return <Card accent="orange" className="animate-fade-in h-full">
        <CardHeader icon="⚡" title={variant === 'district' ? 'Power & Tariffs' : 'Power Tariff'} subtitle="TGERC / TGSPDCL" />
        <p className="text-[12px] text-text-secondary">
            Current tariffs are set by the{' '}
            <a href="https://tgerc.telangana.gov.in/" target="_blank" rel="noopener noreferrer" className="underline">Electricity Regulatory Commission</a>.
            Pay bills and report outages with{' '}
            <a href="https://www.tgsouthernpower.org/" target="_blank" rel="noopener noreferrer" className="underline">TGSPDCL</a> or call 1912.
        </p>
    </Card>;
}
