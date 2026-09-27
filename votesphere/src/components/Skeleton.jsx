export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-sm bg-ink-100 ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="rounded border border-ink-100 bg-white p-5">
      <Skeleton className="h-3 w-20 mb-4" />
      <Skeleton className="h-7 w-16 mb-2" />
      <Skeleton className="h-3 w-28" />
    </div>
  )
}

export function CandidateCardSkeleton() {
  return (
    <div className="rounded border border-ink-100 bg-white p-5">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="border-b border-ink-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}
