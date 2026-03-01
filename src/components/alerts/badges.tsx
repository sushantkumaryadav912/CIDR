import { Badge } from '@/components/ui/badge';
import { cn, getRiskBgColor } from '@/lib/utils';
import { Severity, AlertStatus } from '@/lib/types';

export function RiskBadge({ score }: { score: number }) {
  return (
    <Badge className={cn('border', getRiskBgColor(score))} data-testid="risk-badge">
      {score}
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const variants = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <Badge className={cn('border capitalize', variants[severity])} data-testid="severity-badge">
      {severity}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: AlertStatus }) {
  const variants = {
    open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    investigating: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    resolved: 'bg-green-500/10 text-green-400 border-green-500/20',
    false_positive: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const labels = {
    open: 'Open',
    investigating: 'Investigating',
    resolved: 'Resolved',
    false_positive: 'False Positive',
  };

  return (
    <Badge className={cn('border', variants[status])} data-testid="status-badge">
      {labels[status]}
    </Badge>
  );
}
