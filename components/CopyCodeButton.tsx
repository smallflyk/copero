'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n'

const copy = {
  en: { idle: 'Copy', copied: 'Copied', error: 'Try again' },
  ja: { idle: 'コピー', copied: 'コピー済み', error: '再試行' },
} satisfies Record<Locale, Record<'idle' | 'copied' | 'error', string>>

function fallbackCopy(text: string) {
  const activeElement = document.activeElement as HTMLElement | null
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.setAttribute('aria-hidden', 'true')
  textarea.tabIndex = -1
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    textarea.remove()
    activeElement?.focus()
  }
}

async function clipboardCopy(text: string) {
  if (!navigator.clipboard?.writeText) return false

  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Clipboard timeout')), 1000)
      }),
    ])
    return true
  } catch {
    return false
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

function CopyCodeButton({ code, locale = 'en' }: { code: string; locale?: Locale }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const labels = copy[locale]

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
  }, [])

  async function handleCopy() {
    const copied = await clipboardCopy(code) || fallbackCopy(code)

    setStatus(copied ? 'copied' : 'error')
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setStatus('idle'), 5000)
  }

  return <button
    type="button"
    className="copy-code-button"
    data-slot="copy-code-button"
    data-copy-value={code}
    data-state={status}
    aria-label={`${labels[status]} ${code}`}
    onClick={handleCopy}
  >
    {status === 'copied' ? <span aria-hidden="true">✓</span> : <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="3" width="9" height="11" rx="2" /><path d="M5 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" /></svg>}
    <span aria-live="polite" aria-atomic="true">{labels[status]}</span>
  </button>
}

export { CopyCodeButton }
