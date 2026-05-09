import { Link } from 'react-router-dom'
import type { Tier } from '../lib/types'

interface TierMarkProps {
  tier: Tier
  size?: 'sm' | 'md' | 'lg'
}

const SIZE = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
}

export function TierMark({ tier, size = 'md' }: TierMarkProps) {
  if (tier === 'unknown') return null
  return (
    <Link
      to="/tier-system"
      className={`font-display ${SIZE[size]} text-orange hover:text-twilight transition-colors`}
      aria-label={`Tier ${tier} — read about the tier system`}
      title={`Tier ${tier} — read about the tier system`}
    >
      {tier}
    </Link>
  )
}
