// The page listed 25 fair-price shops with dealer names, phone numbers and
// "available quota" figures that were made up, credited to the EPDS portal,
// and card entitlements that are not Telangana's (TL-44). It now points to
// the Civil Supplies department's own portal.

export default function RationPDSPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🍚</div>
        <div className="relative z-10">
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Ration &amp; PDS</h2>
          <p className="text-text-secondary">
            Find your fair-price shop, check your food security card and see your monthly entitlement
            on the Civil Supplies department's portal.
          </p>
        </div>
      </div>

      <a
        href="https://epds.telangana.gov.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="glass-card section-block block hover:border-telangana-green/40 transition-colors"
      >
        <div className="text-white font-semibold">Telangana ePDS portal ↗</div>
        <p className="text-xs text-text-muted mt-1">
          Official shop locations, card status and transaction history.
        </p>
      </a>

      <div className="glass-card section-block bg-amber-500/5 border border-amber-500/20 text-center">
        <p className="text-xs text-text-secondary">Civil Supplies helpline: <strong className="text-white">1967</strong></p>
      </div>
    </div>
  );
}
