export function maskAadhaar(aadhaar) {
  if (aadhaar === null || aadhaar === undefined) return '—'
  const digits = String(aadhaar).replace(/\D/g, '')
  if (digits.length < 4) return '•••• •••• ••••'
  const last4 = digits.slice(-4)
  return `XXXX XXXX ${last4}`
}

export function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatDate(dateInput) {
  if (!dateInput) return '—'
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Deterministic color assignment for party chips, so the same party always
// renders in the same color without hardcoding a party list.
const PARTY_PALETTE = ['#B8873A', '#2F6B4F', '#33415C', '#A63D2F', '#7C5722', '#255740']

export function partyColor(partyName) {
  if (!partyName) return PARTY_PALETTE[0]
  let hash = 0
  for (let i = 0; i < partyName.length; i++) {
    hash = partyName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PARTY_PALETTE[Math.abs(hash) % PARTY_PALETTE.length]
}
