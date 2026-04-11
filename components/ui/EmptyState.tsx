import Link from 'next/link'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  ctaText?: string
  ctaHref?: string
}

export default function EmptyState({
  icon,
  title,
  description,
  ctaText,
  ctaHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4 select-none" aria-hidden="true">
        {icon}
      </span>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-muted text-sm max-w-xs">{description}</p>
      {ctaText && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-block mt-6 px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          {ctaText}
        </Link>
      )}
    </div>
  )
}
