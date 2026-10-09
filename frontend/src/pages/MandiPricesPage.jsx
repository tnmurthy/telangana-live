import { BasketTable, MspTable, MandiSource } from '../components/MandiTables';

// Daily wholesale prices and MSPs for Telangana from Agmarknet (TL-49).
export default function MandiPricesPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in space-y-6">
            <header>
                <h1 className="text-3xl font-heading font-bold text-white mb-3">Mandi Prices in Telangana</h1>
                <p className="text-text-secondary">
                    Wholesale prices at Telangana&apos;s regulated markets for vegetables, pulses, grains and cash crops,
                    and how they compare with a year ago and with the Minimum Support Price.
                </p>
            </header>
            <section className="glass-card p-5 space-y-3" aria-labelledby="basket-heading">
                <h2 id="basket-heading" className="text-lg font-bold text-white">Market prices</h2>
                <BasketTable />
            </section>
            <section className="glass-card p-5 space-y-3" aria-labelledby="msp-heading">
                <h2 id="msp-heading" className="text-lg font-bold text-white">Minimum Support Prices</h2>
                <MspTable />
            </section>
            <MandiSource />
        </div>
    );
}
