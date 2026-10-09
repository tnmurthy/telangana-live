// The ward finder searched a "300-ward" list whose ward numbers, circles and
// zonal offices were made up (Ward 1 is not Charminar) (TL-47). Until an
// official ward list is wired in, it points to GHMC.
export default function KnowYourWard() {
    return (
        <a
            href="https://www.ghmc.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-6 block hover:border-telangana-green/40 transition-colors"
        >
            <h3 className="section-title text-xl mb-2">🔍 Know Your Ward ↗</h3>
            <p className="text-text-muted text-sm">
                Find your ward, circle and zonal office on the GHMC website. We don&apos;t keep our own ward list.
            </p>
        </a>
    );
}
