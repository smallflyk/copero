import Link from 'next/link'
import type { Metadata } from 'next'
import { codes, codesLastChecked, rewardHistory, type CodeItem } from '@/data/codes'
import { FAQ, FAQSchema, PageHero, SectionHeading } from '@/components/ui'
import { metadata as createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata(
  'Pokémon Champions Codes – Active Mystery Gift Codes & Rewards',
  'Find verified Pokémon Champions Mystery Gift codes, active and expired rewards, release updates, and clear instructions for redeeming every available code.',
  '/codes',
)

const faq = [
  { q: 'Are there any active Pokémon Champions codes?', a: 'No active Pokémon Champions codes are currently confirmed. We check official announcements and reliable reports before adding any code.' },
  { q: 'How do I redeem a Pokémon Champions code?', a: 'Open the game menu and look for Mystery Gift, Gifts, or a similar redemption option. Choose the code entry method, enter the code exactly, and confirm the reward. Menu names can vary by platform or update.' },
  { q: 'Why is my Pokémon Champions code not working?', a: 'Check capitalization, expiry time, region or account restrictions, network access, and whether the code was already redeemed. A reported code may also be unverified, which is why this page excludes placeholders.' },
  { q: 'When are new Mystery Gift codes released?', a: 'There is no guaranteed schedule. New distributions are most likely around game updates, ranked seasons, campaigns, broadcasts, tournaments, or platform launches.' },
  { q: 'How does ChampionsDex verify a code?', a: 'We require a traceable announcement or a reliable distribution report, a clear reward description, and a successful date check. Guesses and code-generator claims are never listed.' },
]

export default function CodesPage() {
  const active = codes.filter((item) => item.status === 'active')
  const expired = codes.filter((item) => item.status === 'expired')
  return <>
    <PageHero eyebrow="Verified Mystery Gift Tracker" title="Pokémon Champions Codes" description="Check active codes, expired rewards, official distribution history, and safe step-by-step redemption help without fake or placeholder entries.">
      <p><strong>Last checked:</strong> {codesLastChecked}</p>
    </PageHero>

    <div className="wrap"><div className="status-note" style={{ marginTop: 28 }}><span className="dot" /><p><strong>Code policy:</strong> We only list codes confirmed by official announcements or reliable community reports. Placeholder, guessed, and unverified codes are not included.</p></div></div>

    <section className="section"><div className="wrap">
      <SectionHeading eyebrow="Current Status" title="Active Pokémon Champions codes" description="No active Pokémon Champions codes are currently confirmed. Bookmark this page and check again around updates, new ranked seasons, and official campaigns." />
      <CodeTable items={active} empty="No active codes are confirmed right now." />

      <div style={{ height: 58 }} />
      <SectionHeading eyebrow="Code Archive" title="Expired Pokémon Champions codes" description="Expired entries remain visible only after a real distribution has been documented, helping you distinguish old rewards from fake code lists." />
      <CodeTable items={expired} empty="No expired codes have been verified for the archive yet." />

      <div style={{ height: 58 }} />
      <SectionHeading eyebrow="Distribution Archive" title="Official Mystery Gift reward history" description="This timeline records official gifts even when they use an online distribution method instead of a typed code." />
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Reward</th><th>Distribution</th><th>Date</th><th>Source</th></tr></thead><tbody>{rewardHistory.length ? rewardHistory.map((item) => <tr key={`${item.reward}-${item.date}`}><td>{item.reward}</td><td>{item.distribution}</td><td>{item.date}</td><td>{item.source}</td></tr>) : <tr><td colSpan={4}><strong>No official reward-history entries are documented yet.</strong><br />We will add the first confirmed distribution with its source and date.</td></tr>}</tbody></table></div>
    </div></section>

    <section className="section white"><div className="wrap">
      <SectionHeading eyebrow="Redemption Guide" title="How to redeem Pokémon Champions codes" description="Use the official game client and never enter account credentials on a third-party code website." />
      <div className="info-grid">{[
        ['01', 'Open the game menu', 'Start Pokémon Champions while connected to the internet, then open the main menu and find Mystery Gift or the current gift feature.'],
        ['02', 'Choose code redemption', 'Select the option to receive a gift with a code. Avoid QR links or external forms unless an official announcement specifically requires them.'],
        ['03', 'Enter and confirm', 'Type the code exactly as published, confirm the reward details, and check your gift box or inventory after redemption completes.'],
      ].map((item) => <div className="info-card" key={item[0]}><span className="number">{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></div>)}</div>
    </div></section>

    <section className="section tint"><div className="wrap two-col">
      <div className="content-card"><span className="eyebrow">Troubleshooting</span><h2 style={{ fontSize: '1.75rem' }}>Why a code may not work</h2><ul><li>The code has expired in your region.</li><li>A character was entered incorrectly.</li><li>The reward is limited to one use per account.</li><li>Your game or account region is not eligible.</li><li>The game needs an update or network connection.</li><li>The code came from an unverified list.</li></ul></div>
      <div className="content-card"><span className="eyebrow blue">Release Patterns</span><h2 style={{ fontSize: '1.75rem' }}>When new codes may appear</h2><p>Watch official channels around major updates, mobile or platform launches, Regulation changes, tournaments, livestreams, and promotional campaigns. Codes can expire quickly, so confirm the time zone and claim window before waiting.</p><p>Our tracker records the source, added date, expiry date, and last check for every future entry.</p></div>
    </div></section>

    <section className="section white"><div className="wrap"><SectionHeading eyebrow="Continue Exploring" title="Useful guides while you wait" /><div className="card-grid">
      <Link className="content-card" href="/beginner-guide"><h3>Beginner Guide</h3><p>Learn battle roles and build your first team.</p><span className="text-link">Start here →</span></Link>
      <Link className="content-card" href="/download"><h3>Download Guide</h3><p>Find safe platform and store information.</p><span className="text-link">Check platforms →</span></Link>
      <Link className="content-card" href="/regulation-set-m-b"><h3>Regulation Set M-B</h3><p>Understand the current ranked rules and meta.</p><span className="text-link">Read the guide →</span></Link>
      <Link className="content-card" href="/team-builder"><h3>Team Builder</h3><p>Build and analyze a six-Pokémon squad.</p><span className="text-link">Build a team →</span></Link>
    </div></div></section>

    <section className="section tint"><div className="wrap narrow"><SectionHeading eyebrow="Codes FAQ" title="Pokémon Champions code questions" /><FAQ items={faq} /></div></section>
    <FAQSchema items={faq} />
  </>
}

function CodeTable({ items, empty }: { items: CodeItem[]; empty: string }) {
  return <div className="table-wrap"><table className="data-table"><thead><tr><th>Code</th><th>Reward</th><th>Source</th><th>Expiry</th><th>Status</th></tr></thead><tbody>{items.length ? items.map((item) => <tr key={item.code}><td><span className="code-text">{item.code}</span></td><td>{item.reward}</td><td>{item.sourceType}</td><td>{item.expiryDate || 'Not announced'}</td><td><span className={`status ${item.status}`}>{item.status}</span></td></tr>) : <tr><td colSpan={5}><strong>{empty}</strong><br />Last checked: {codesLastChecked}</td></tr>}</tbody></table></div>
}
