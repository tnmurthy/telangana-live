export const shlokas = [
    {
        id: 1,
        sanskrit: 'धर्मो रक्षति रक्षितः',
        telugu: 'ధర్మో రక్షతి రక్షితః — ధర్మాన్ని రక్షించేవారిని ధర్మమే రక్షిస్తుంది.',
        source: 'Manusmriti 8.15',
        meaning: 'Dharma protects those who protect it.',
    },
    {
        id: 2,
        sanskrit: 'विद्या ददाति विनयम्, विनयाद् याति पात्रताम्।',
        telugu: 'విద్య వినయాన్ని ఇస్తుంది, వినయం పాత్రతను కలిగిస్తుంది.',
        source: 'Hitopadesha',
        meaning: 'Knowledge gives humility, humility gives worthiness.',
    },
    {
        id: 3,
        sanskrit: 'सर्वे भवन्तु सुखिनः, सर्वे सन्तु निरामयाः।',
        telugu: 'అందరూ సుఖంగా ఉండుగాక, అందరూ ఆరోగ్యంగా ఉండుగాక.',
        source: 'Brihadaranyaka Upanishad',
        meaning: 'May all be happy, may all be free from illness.',
    },
    {
        id: 4,
        sanskrit: 'अहिंसा परमो धर्मः।',
        telugu: 'అహింస పరమ ధర్మం — హింస చేయకపోవడమే గొప్ప ధర్మం.',
        source: 'Mahabharata, Anushasana Parva',
        meaning: 'Non-violence is the highest moral virtue.',
    },
    {
        id: 5,
        sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
        telugu: 'నీకు కర్మ చేయడంలో మాత్రమే అధికారం ఉంది, ఫలాలపై కాదు.',
        source: 'Bhagavad Gita 2.47',
        meaning: 'You have the right to perform your duty, but not to the fruits of action.',
    },
    {
        id: 6,
        sanskrit: 'सत्यमेव जयते नानृतम्।',
        telugu: 'సత్యమేవ జయతే — సత్యమే విజయం పొందుతుంది, అసత్యం కాదు.',
        source: 'Mundaka Upanishad 3.1.6',
        meaning: 'Truth alone triumphs, not falsehood.',
    },
    {
        id: 7,
        sanskrit: 'वसुधैव कुटुम्बकम्।',
        telugu: 'వసుధైవ కుటుంబకం — ప్రపంచమంతా ఒక కుటుంబం.',
        source: 'Maha Upanishad 6.72',
        meaning: 'The whole world is one family.',
    },
];

export function getDailyShloka() {
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    return shlokas[dayOfYear % shlokas.length];
}
