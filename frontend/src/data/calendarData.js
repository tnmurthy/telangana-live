export const holidays2026 = [
  { date: '2026-01-01', name: "New Year's Day", type: 'Bank', description: 'First day of the Gregorian calendar year', emoji: '🎊' },
  { date: '2026-01-14', name: 'Makar Sankranti / Pongal', type: 'State', description: 'Harvest festival celebrated with kite flying, bonfires and sweets', emoji: '🪁' },
  { date: '2026-01-26', name: 'Republic Day', type: 'National', description: 'Commemorates the Constitution of India coming into effect in 1950', emoji: '🇮🇳' },
  { date: '2026-02-06', name: 'Milad-un-Nabi', type: 'Optional', description: 'Prophet Muhammad\'s birthday observed by the Muslim community', emoji: '☪️' },
  { date: '2026-02-17', name: 'Maha Shivaratri', type: 'State', description: 'Annual festival in honour of Lord Shiva with fasting and night vigils', emoji: '🙏' },
  { date: '2026-03-02', name: 'Holi', type: 'National', description: 'Festival of colours celebrating the victory of good over evil', emoji: '🎨' },
  { date: '2026-03-04', name: 'Holika Dahan', type: 'Optional', description: 'Bonfire festival night preceding Holi', emoji: '🔥' },
  { date: '2026-03-20', name: 'Ugadi (Telugu New Year)', type: 'State', description: 'Telangana & Andhra Pradesh New Year — celebrated with Pachadi and Bevu-Bella', emoji: '🌸' },
  { date: '2026-03-30', name: 'Ram Navami', type: 'State', description: 'Celebrates the birth of Lord Rama', emoji: '🏹' },
  { date: '2026-04-04', name: 'Good Friday', type: 'National', description: 'Commemorates the crucifixion of Jesus Christ', emoji: '✝️' },
  { date: '2026-04-06', name: 'Easter Monday', type: 'Optional', description: 'Celebrates the resurrection of Jesus Christ', emoji: '🐣' },
  { date: '2026-04-14', name: 'Ambedkar Jayanti', type: 'National', description: 'Birth anniversary of Dr. B.R. Ambedkar, architect of the Indian Constitution', emoji: '📖' },
  { date: '2026-04-30', name: 'Buddha Purnima', type: 'State', description: 'Celebrates the birth, enlightenment and death of Gautama Buddha', emoji: '☸️' },
  { date: '2026-05-28', name: 'Eid al-Adha (Bakrid)', type: 'National', description: 'Festival of sacrifice commemorating Ibrahim\'s devotion to Allah', emoji: '🐑' },
  { date: '2026-06-02', name: 'Telangana Formation Day', type: 'State', description: 'Celebrates the formation of Telangana as the 29th state of India on June 2, 2014', emoji: '🌟' },
  { date: '2026-06-18', name: 'Muharram (Ashura)', type: 'State', description: 'First month of Islamic calendar — commemorates the martyrdom of Imam Hussain', emoji: '🕌' },
  { date: '2026-07-01', name: 'Bonalu Festival Begins', type: 'State', description: 'Hyderabad\'s famous Goddess Mahakali festival with processions and offerings', emoji: '🏺' },
  { date: '2026-07-21', name: 'Bonalu Grand Finale', type: 'State', description: 'Concluding celebrations of Bonalu at Golconda Fort', emoji: '🥁' },
  { date: '2026-08-15', name: 'Independence Day', type: 'National', description: 'India\'s Independence from British rule in 1947 — flag hoisting ceremonies statewide', emoji: '🇮🇳' },
  { date: '2026-08-22', name: 'Raksha Bandhan', type: 'Optional', description: 'Festival celebrating the bond between brothers and sisters', emoji: '🎗️' },
  { date: '2026-08-29', name: 'Janmashtami', type: 'State', description: 'Celebrates the birth of Lord Krishna — midnight celebrations at temples', emoji: '🦚' },
  { date: '2026-09-16', name: 'Ganesh Chaturthi', type: 'State', description: '10-day festival celebrating Lord Ganesha — huge processions in Hyderabad', emoji: '🐘' },
  { date: '2026-09-26', name: 'Ganesh Visarjan', type: 'State', description: 'Grand immersion of Ganesha idols at Hussain Sagar lake', emoji: '💧' },
  { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National', description: 'Birth anniversary of Mahatma Gandhi — observed as International Day of Non-Violence', emoji: '🕊️' },
  { date: '2026-10-10', name: 'Bathukamma Festival', type: 'State', description: 'Telangana\'s floral festival — women make floral stacks and sing folk songs for 9 days', emoji: '🌺' },
  { date: '2026-10-18', name: 'Dussehra (Vijayadashami)', type: 'National', description: 'Celebrates victory of Rama over Ravana and Goddess Durga over Mahishasura', emoji: '🏹' },
  { date: '2026-11-01', name: 'Diwali (Deepavali)', type: 'National', description: 'Festival of Lights — celebrated with fireworks, sweets and diyas across Telangana', emoji: '🪔' },
  { date: '2026-11-05', name: 'Bhai Dooj', type: 'Optional', description: 'Celebrates the love between brothers and sisters', emoji: '🌼' },
  { date: '2026-11-24', name: 'Guru Nanak Jayanti', type: 'National', description: 'Birth anniversary of Guru Nanak Dev Ji, founder of Sikhism', emoji: '🪯' },
  { date: '2026-12-25', name: 'Christmas Day', type: 'National', description: 'Celebrates the birth of Jesus Christ — church services and festivities', emoji: '🎄' },
  { date: '2026-12-31', name: "New Year's Eve", type: 'Optional', description: 'Celebrations marking the end of the year — events at Tank Bund and Jubilee Hills', emoji: '🎆' },
];

const today = new Date('2026-04-04');

export const upcomingFestivals = holidays2026
  .filter(h => new Date(h.date) >= today)
  .sort((a, b) => new Date(a.date) - new Date(b.date))
  .slice(0, 5)
  .map(h => ({
    ...h,
    daysFromNow: Math.ceil((new Date(h.date) - today) / (1000 * 60 * 60 * 24)),
  }));
