import type { Announcement } from '../app/types'

const COLOMBIA_TIME_ZONE = 'America/Bogota'

function formatPartsToDate(parts: Intl.DateTimeFormatPart[]): string | null {
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  if (!values.year || !values.month || !values.day) return null
  return `${values.year}-${values.month}-${values.day}`
}

export function getColombiaDate(value: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: COLOMBIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value)
  return formatPartsToDate(parts) || ''
}

function normalizeDate(value: string): string | null {
  const dateOnly = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dateOnly) {
    const [, year, month, day] = dateOnly
    const candidate = new Date(`${year}-${month}-${day}T00:00:00Z`)
    return Number.isNaN(candidate.getTime()) || candidate.getUTCFullYear() !== Number(year) || candidate.getUTCMonth() + 1 !== Number(month) || candidate.getUTCDate() !== Number(day)
      ? null
      : `${year}-${month}-${day}`
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : getColombiaDate(parsed)
}

export function isAnnouncementCurrent(announcement: Pick<Announcement, 'start_date' | 'end_date'>, now: Date = new Date()): boolean {
  const today = getColombiaDate(now)
  if (!today) return false

  const start = announcement.start_date ? normalizeDate(announcement.start_date) : null
  const end = announcement.end_date ? normalizeDate(announcement.end_date) : null

  if (announcement.start_date && !start) return false
  if (announcement.end_date && !end) return false
  if (start && end && end < start) return false

  return (!start || today >= start) && (!end || today <= end)
}
