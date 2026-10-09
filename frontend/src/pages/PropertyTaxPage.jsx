import OfficialSource from '../components/OfficialSource';

// Showed per-square-foot rates by "zone" and a calculator built on them; the rates were made up. (TL-47)
const SOURCES = [
    { name: "GHMC", href: "https://www.ghmc.gov.in/", what: "Property tax search, online payment and self-assessment." },
    { name: "How to pay property tax", href: "/services/bills-taxes/property-tax", what: "Our step-by-step guide." },
];

export default function PropertyTaxPage() {
    return (
        <OfficialSource
            title="Property Tax"
            intro="Check and pay GHMC property tax on the corporation's site. We don't publish tax rates or hold assessment records."
            sources={SOURCES}
        />
    );
}
