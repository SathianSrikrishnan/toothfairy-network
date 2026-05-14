import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const title = 'Tooth Fairy Network'
const tagline = "A child's first digital asset from a lost tooth."
const logoUrl = 'https://toothfairy.network/toothfairy/brand/toothfairy-glow-mark-512.png'

export const alt = `${title} - ${tagline}`

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: '#fff8ea',
          color: '#11234a',
          fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 82% 18%, rgba(240, 196, 86, 0.42), transparent 280px), radial-gradient(circle at 15% 86%, rgba(47, 191, 176, 0.20), transparent 260px), linear-gradient(135deg, #fff8ea 0%, #f6ead4 45%, #f9f4e9 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 58,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            color: '#6f5f3a',
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          <span style={{ color: '#11234a' }}>toothfairy</span>
          <span style={{ color: '#c99a3a' }}>.network</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 58,
            width: '100%',
            padding: '86px 84px 76px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 308,
              height: 308,
              borderRadius: 72,
              background: 'rgba(255, 255, 255, 0.70)',
              border: '2px solid rgba(201, 154, 58, 0.28)',
              boxShadow: '0 28px 90px rgba(91, 63, 18, 0.18)',
            }}
          >
            <img
              src={logoUrl}
              width="230"
              height="230"
              alt=""
              style={{
                objectFit: 'contain',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 650,
            }}
          >
            <div
              style={{
                display: 'flex',
                marginBottom: 22,
                color: '#b8903a',
                fontSize: 24,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
              }}
            >
              First tooth. First asset.
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Georgia, Times New Roman, serif',
                fontSize: 82,
                fontWeight: 800,
                lineHeight: 0.94,
                letterSpacing: '0',
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 30,
                color: '#2a3b63',
                fontSize: 38,
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: '0',
              }}
            >
              {tagline}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
