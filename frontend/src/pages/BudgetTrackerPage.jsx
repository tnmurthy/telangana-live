import OfficialSource from '../components/OfficialSource';

// Showed a 2025-26 budget total, spend by department and project statuses that were made up. (TL-47)
const SOURCES = [
    { name: "Finance Department, Telangana", href: "https://finance.telangana.gov.in/", what: "Budget documents, allocations and statements." },
    { name: "PRS Legislative Research: state budgets", href: "https://prsindia.org/budgets/states", what: "Plain-language analysis of each state budget." },
];

export default function BudgetTrackerPage() {
    return (
        <OfficialSource
            title="Telangana Budget"
            intro="We don't publish our own budget figures. The state's budget documents and an independent summary are below."
            sources={SOURCES}
        />
    );
}
