import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  // SVG Badge representation for developers and repositories
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="28" viewBox="0 0 260 28">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect rx="6" width="260" height="28" fill="url(#grad)" stroke="#334155" stroke-width="1"/>
  <rect rx="6" width="130" height="28" fill="#10b981" fill-opacity="0.15"/>
  <circle cx="16" cy="14" r="4" fill="#10b981"/>
  <text x="28" y="18" fill="#34d399" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="11" font-weight="800" letter-spacing="0.5">TELANGANA.LIVE</text>
  <text x="140" y="18" fill="#f8fafc" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="11" font-weight="700">Gemini 2.0 Flash: $0.10/M</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=14400, stale-while-revalidate=86400',
    },
  });
}
