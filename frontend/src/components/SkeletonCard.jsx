export default function SkeletonCard({ variant = 'standard' }) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] overflow-hidden">
      <div className={`flex flex-col ${variant !== 'compact' ? 'md:flex-row' : ''}`}>
        {/* Thumbnail */}
        <div className={`skeleton ${variant === 'compact' ? 'h-36' : 'h-40 md:h-auto md:w-44 lg:w-52'} shrink-0`} />
        {/* Content */}
        <div className="flex-grow flex flex-col p-4 gap-3">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-4/5 rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonFeed({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
