import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Query parameters with smart defaults
    const title = searchParams.get('title') || 'Telangana.live | Hyper-Local Civic & Tech Intelligence';
    const subtitle = searchParams.get('subtitle') || 'Telangana real-time rates, alerts, civic services & AI benchmarks';
    const tag = searchParams.get('tag') || 'TELANGANA PULSE';
    const category = searchParams.get('category') || 'Civic Command Center';
    const metrics = searchParams.get('metrics') || '';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0a0f1d',
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(16, 185, 129, 0.08) 5%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '60px 70px',
            fontFamily: 'sans-serif',
            color: '#ffffff',
            position: 'relative',
          }}
        >
          {/* Top Decorative Gradient Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #10B981, #06B6D4, #3B82F6, #F59E0B)',
            }}
          />

          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                }}
              >
                🌊
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.5px', color: '#ffffff' }}>
                  Telangana<span style={{ color: '#10B981' }}>.live</span>
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Telangana Civic Portal
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '8px 18px',
                borderRadius: '999px',
              }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                {tag}
              </span>
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#06B6D4',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  backgroundColor: 'rgba(6, 182, 212, 0.12)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                }}
              >
                {category}
              </span>
            </div>

            <h1
              style={{
                fontSize: title.length > 50 ? '48px' : '56px',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-1.5px',
                color: '#F8FAFC',
                margin: 0,
                maxWidth: '1050px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: '22px',
                fontWeight: 500,
                lineHeight: 1.4,
                color: '#94A3B8',
                margin: 0,
                maxWidth: '980px',
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Bottom Footer / Metrics Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '24px',
            }}
          >
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>⚡</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#E2E8F0' }}>
                  Live Daily Essentials
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🏛️</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#E2E8F0' }}>
                  Ward Transparency
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🤖</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#E2E8F0' }}>
                  AI &amp; Tech Pulse
                </span>
              </div>
            </div>

            {metrics ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#F59E0B',
                }}
              >
                {metrics}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#64748B', fontWeight: 600 }}>
                <span>telangana.live</span>
                <span>•</span>
                <span>Hyderabad, Telangana</span>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
