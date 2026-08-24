import { memo } from 'react'

interface TikTokIconProps {
  size: number
  color?: string
}

export const TikTokIcon = memo(function TikTokIcon({ size, color }: TikTokIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
})