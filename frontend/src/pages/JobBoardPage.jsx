import OfficialSource from '../components/OfficialSource';

// Listed recruitment notifications with post counts and April 2026 deadlines that were not current. (TL-47)
const SOURCES = [
    { name: "TGPSC (Telangana Public Service Commission)", href: "https://websitenew.tgpsc.gov.in/", what: "Group I\u2013IV and other state recruitment notifications." },
    { name: "TGPRB (Police Recruitment Board)", href: "https://www.tgprb.in/", what: "Police constable and sub-inspector recruitment." },
    { name: "National Career Service", href: "https://www.ncs.gov.in/", what: "Government of India job portal." },
];

export default function JobBoardPage() {
    return (
        <OfficialSource
            title="Government Jobs in Telangana"
            intro="Notifications, dates and vacancies change often, so check them on the recruiting body's own site. We don't list jobs."
            sources={SOURCES}
        />
    );
}
