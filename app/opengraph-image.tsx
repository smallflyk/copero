import { ImageResponse } from 'next/og'

export const alt = 'Pokémon Champions Wiki – codes, teams, tier list and guides'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden', padding: '76px 84px',
      color: '#17233d', background: 'linear-gradient(120deg, #e9faff 0%, #ffffff 57%, #fff0f3 100%)',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ position: 'absolute', width: 520, height: 520, border: '2px solid #d9edf5', borderRadius: 999, right: -70, top: 55 }} />
      <div style={{ position: 'absolute', width: 350, height: 350, border: '2px solid #f1dfe4', borderRadius: 999, right: 15, top: 140 }} />
      <div style={{ display: 'flex', flexDirection: 'column', width: 770 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, fontWeight: 800, marginBottom: 42 }}>
          <div style={{ width: 54, height: 54, border: '5px solid #17233d', borderRadius: 99, background: 'linear-gradient(#ef3156 0 43%, #17233d 43% 57%, #ffffff 57%)' }} />
          <div style={{ display: 'flex' }}>Pokémon&nbsp;<span style={{ color: '#0e8ed8' }}>Champions</span></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 66, lineHeight: 1.03, fontWeight: 900, letterSpacing: -3 }}>
          <span>Master every battle.</span>
          <span style={{ color: '#0e8ed8' }}>Become a Champion.</span>
        </div>
        <div style={{ display: 'flex', marginTop: 32, fontSize: 25, color: '#65738a' }}>Codes · Tier List · Best Teams · Battle Database</div>
      </div>
      <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', right: 92, top: 190, width: 250, height: 250, borderRadius: 999, border: '18px solid #17233d', background: '#ffffff', boxShadow: '0 25px 55px rgba(31,76,105,.17)' }}>
        <div style={{ width: 82, height: 82, borderRadius: 999, border: '16px solid #17233d', background: '#e8faff' }} />
      </div>
      <div style={{ position: 'absolute', right: 52, bottom: 45, fontSize: 20, color: '#7b8798' }}>pokemonchampions.pro</div>
    </div>,
    size,
  )
}
