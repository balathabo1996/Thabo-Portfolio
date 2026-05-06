import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'Thabotharan Balachandran Portfolio';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '40px',
          border: '20px solid #00c6ff',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: '900',
              marginBottom: '20px',
              background: 'linear-gradient(to right, #00c6ff, #0072ff)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Thabotharan Balachandran
          </h1>
          <p
            style={{
              fontSize: '40px',
              color: '#a0a0a0',
              maxWidth: '800px',
              lineHeight: '1.4',
            }}
          >
            Infrastructure Engineer | IT Solutions | Cybersecurity Enthusiast
          </p>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            display: 'flex',
            gap: '30px',
            fontSize: '24px',
            color: '#00c6ff',
          }}
        >
          <span>🌐 thabo-portfolio.vercel.app</span>
          <span>📧 balathabo96@gmail.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
