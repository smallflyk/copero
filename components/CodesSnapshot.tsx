import { codes, codesLastChecked, type CodeItem } from '@/data/codes'
import { pendingConfirmation } from '@/data/site'

function Table({ items }: { items: CodeItem[] }) {
  return <div className="table-wrap"><table className="data-table"><thead><tr><th>Code</th><th>Reward</th><th>Start</th><th>Expiry</th><th>Status</th></tr></thead><tbody>{items.map((item) => <tr key={item.code}><td><span className="code-text">{item.code}</span></td><td>{item.reward}</td><td>{item.addedDate || pendingConfirmation}</td><td>{item.expiryDate || 'No end date listed'}</td><td><span className={`status ${item.status}`}>{item.status}</span></td></tr>)}</tbody></table></div>
}

export default function CodesSnapshot() {
  const active = codes.filter((item) => item.status === 'active')
  const expired = codes.filter((item) => item.status === 'expired')
  return <>
    <h2>Active Pokémon Champions codes</h2>
    <p>These entries were still inside their documented claim windows on {codesLastChecked}. A listed code can still be limited by account, region, prior redemption, maintenance, or a publisher change, so the game is the final status check.</p>
    <Table items={active} />
    <h2>Expired Pokémon Champions codes</h2>
    <p>These distributions had an end date earlier than the research check. They remain in the archive so players can distinguish an old real code from a fabricated one.</p>
    <Table items={expired} />
  </>
}
