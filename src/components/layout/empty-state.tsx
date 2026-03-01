export function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center" data-testid="empty-state">
      <Icon className="h-12 w-12 text-slate-600 mb-4" />
      <h3 className="text-lg font-medium text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
    </div>
  );
}
