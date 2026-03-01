import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  );
}
