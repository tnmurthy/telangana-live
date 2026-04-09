// src/hooks/useSEOMeta.ts
// Drop-in SEO meta hook — use in each page component

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}

export const PAGE_META: Record<string, SEOMeta> = {
  home: {
    title: "Telangana Live — Civic Intelligence Portal",
    description: "Real-time Telangana civic data: gold rates, fuel prices, weather, power cuts, news and government schemes for Hyderabad and all 33 districts.",
    keywords: "Telangana, Hyderabad, gold rate today, petrol price Hyderabad, power cuts, weather, civic portal",
  },
  goldRates: {
    title: "Gold Rate Today Hyderabad | 22K & 24K Prices — Telangana Live",
    description: "Today's gold rate in Hyderabad: 22K gold ₹14,100/g, 24K gold ₹15,382/g. Updated daily from Goodreturns. Silver rate and 7-day history included.",
    keywords: "gold rate Hyderabad today, 22k gold price, 24k gold price, silver rate Hyderabad, gold price April 2026",
  },
  fuelPrices: {
    title: "Petrol & Diesel Price Hyderabad Today — Telangana Live",
    description: "Current fuel prices in Hyderabad: Petrol ₹107.46/litre, Diesel ₹95.70/litre, LPG ₹965/cylinder, CNG ₹99/kg. Updated daily.",
    keywords: "petrol price Hyderabad, diesel price Hyderabad, LPG price, CNG price Hyderabad, fuel rates today",
  },
  weather: {
    title: "Hyderabad Weather Today & AQI — Telangana Live",
    description: "Live Hyderabad weather with temperature, rainfall, humidity and Air Quality Index (AQI). Telangana district-wise weather updates.",
    keywords: "Hyderabad weather today, AQI Hyderabad, Telangana weather forecast, air quality index",
  },
  news: {
    title: "Telangana News Today — Latest Updates — Telangana Live",
    description: "Breaking news and latest updates from Telangana and Hyderabad: politics, civic, infrastructure, weather, and government schemes.",
    keywords: "Telangana news today, Hyderabad news, breaking news Telangana, TG news",
  },
  powerAlerts: {
    title: "Power Cut Schedule Hyderabad Today — Telangana Live",
    description: "Today's planned and unplanned power outages in Hyderabad by ward. TSSPDCL and TSNPDCL power cut alerts for all Telangana districts.",
    keywords: "power cut Hyderabad today, TSSPDCL power outage, power cut schedule Telangana, electricity outage",
  },
  dashboard: {
    title: "Civic Dashboard — Telangana Live",
    description: "Your Telangana at a glance: gold rates, fuel prices, weather, power cuts, government schemes and civic news in one dashboard.",
    keywords: "Telangana civic dashboard, Hyderabad live data, Telangana government portal",
  },
};

// Usage in any page component:
// import { PAGE_META } from '@/hooks/useSEOMeta';
// <Helmet>
//   <title>{PAGE_META.goldRates.title}</title>
//   <meta name="description" content={PAGE_META.goldRates.description} />
//   <meta name="keywords" content={PAGE_META.goldRates.keywords} />
//   <meta property="og:title" content={PAGE_META.goldRates.title} />
//   <meta property="og:description" content={PAGE_META.goldRates.description} />
//   <meta property="og:url" content="https://www.telangana.live/rates/gold" />
//   <meta property="og:type" content="website" />
// </Helmet>
