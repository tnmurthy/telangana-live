// Emergency contacts shown on the crisis dashboard.
//
// Only numbers we can source are listed: the national emergency lines, GHMC's
// call centre and its Disaster Response Force line (published by GHMC in its
// rain advisories; see /sources). This file used to call itself "verified 2026
// data" while listing an NDRF number and numbers for the new Cyberabad and
// Malkajgiri corporations that no source confirms, and a fixed March heatwave
// reading with made-up ORS-point distances (TL-48).

export const emergencyContacts = {
    general: [
        { name: 'Emergency (all services)', number: '112', icon: 'Emergency' },
        { name: 'Ambulance', number: '108', icon: 'Ambulance' },
        { name: 'Police', number: '100', icon: 'Emergency' },
        { name: 'Fire', number: '101', icon: 'Fire' },
        { name: 'GHMC call centre', number: '040 2111 1111', icon: 'Heritage' },
        { name: 'GHMC Disaster Response Force', number: '90001 13667', icon: 'Fire' },
        { name: 'Power outages (TGSPDCL)', number: '1912', icon: 'Power' },
    ],
};
