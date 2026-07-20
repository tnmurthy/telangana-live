import { useState } from 'react';
import { powerTariff } from '../data/alerts';
import { Card, CardHeader, CategoryList } from './LocalPulse';

export default function PowerTariffCard({ variant = 'default' }) {
    const [expanded, setExpanded] = useState(false);
    const categories = powerTariff.categories.map((category, index) => ({ ...category, hot: index < 2 }));

    if (variant === 'district') {
        return <Card accent="orange" className="animate-fade-in h-full">
            <CardHeader icon="⚡" title="Power & Tariffs" subtitle={`TSSPDCL / TSNPDCL · ${categories.length} categories`} status={`Eff. ${powerTariff.lastUpdated}`} />
            <CategoryList items={categories} expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
        </Card>;
    }

    return <Card accent="orange" className="animate-fade-in h-full">
        <CardHeader icon="⚡" title="TS Power Tariff" subtitle="TSSPDCL / TSNPDCL" status={powerTariff.lastUpdated} />
        <CategoryList items={categories} expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
    </Card>;
}
