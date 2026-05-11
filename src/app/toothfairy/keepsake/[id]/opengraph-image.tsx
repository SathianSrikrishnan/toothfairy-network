import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Tooth Fairy Keepsake';

export default function OGImage() {
  const cream = '#FFF8EA';
  const creamDeep = '#F4E7CF';
  const brown = '#4B3226';
  const brownSoft = '#705743';
  const gold = '#C89A31';
  const goldTint = '#E7C66B';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: `linear-gradient(135deg, ${cream} 0%, ${creamDeep} 100%)`,
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
          color: brown,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: `2px solid ${goldTint}`,
            borderRadius: 24,
            display: 'flex',
          }}
        />

        <div
          style={{
            width: '61%',
            height: '100%',
            padding: '82px 58px 82px 90px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: gold,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: 26,
              fontWeight: 700,
            }}
          >
            Tooth Fairy Network
          </div>

          <div
            style={{
              fontSize: 76,
              color: brown,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: 0,
              display: 'flex',
            }}
          >
            A Toothlight memory is saved.
          </div>

          <div
            style={{
              width: 92,
              height: 4,
              background: gold,
              marginTop: 30,
              marginBottom: 28,
              display: 'flex',
            }}
          />

          <div
            style={{
              color: brownSoft,
              fontSize: 27,
              lineHeight: 1.35,
              maxWidth: 560,
              display: 'flex',
            }}
          >
            A lost tooth, a child&apos;s story, and a family keepsake in one
            shareable place.
          </div>
        </div>

        <div
          style={{
            width: '39%',
            height: '100%',
            padding: '82px 86px 82px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 382,
              height: 382,
              borderRadius: 28,
              background: '#FFFCF5',
              border: `1px solid ${goldTint}`,
              boxShadow: '0 20px 60px rgba(75, 50, 38, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                width: 174,
                height: 174,
                borderRadius: 87,
                background: gold,
                color: cream,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              TFN
            </div>
            <div
              style={{
                marginTop: 24,
                color: brownSoft,
                fontSize: 25,
                fontWeight: 700,
                display: 'flex',
              }}
            >
              Toothlight memory
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
