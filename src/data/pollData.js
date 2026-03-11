// Weekly Citizen Poll data
export const currentPoll = {
    id: 'poll-2026-03',
    question: 'Should the new Metro Phase 2 extensions prioritize the Airport Link or the Old City Green Line?',
    context: 'The Telangana government has allocated ₹8,500 Cr for Metro Phase 2. Citizens must choose between connecting the Airport (Shamshabad) or the Old City (Falaknuma–Chandrayangutta).',
    options: [
        { id: 'airport', label: 'Airport Link (Shamshabad)', icon: 'Airport', color: '#6366F1' },
        { id: 'oldcity', label: 'Old City Green Line', icon: 'Heritage', color: '#10B981' },
    ],
    // Mock initial votes for demo
    initialVotes: { airport: 2847, oldcity: 3215 },
    startDate: '2026-03-03',
    endDate: '2026-03-09',
    week: 'Week of March 3–9, 2026',
};

export const pastPolls = [
    {
        id: 'poll-2026-02',
        question: 'Should GHMC provide free drinking water at all bus stops during summer?',
        result: { yes: 4521, no: 892 },
        winner: 'Yes (84%)',
    },
    {
        id: 'poll-2026-01',
        question: 'Do you support the 24/7 bus service on the Miyapur–MGBS corridor?',
        result: { yes: 3802, no: 1245 },
        winner: 'Yes (75%)',
    },
];
