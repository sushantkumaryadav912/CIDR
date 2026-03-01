import { Alert } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskBadge, SeverityBadge, StatusBadge } from './badges';
import { formatTimestamp } from '@/lib/utils';
import { Cloud, Server, Clock } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onClick?: () => void;
}

export function AlertCard({ alert, onClick }: AlertCardProps) {
  return (
    <Card
      className="hover:border-slate-700 transition-colors cursor-pointer"
      onClick={onClick}
      data-testid={`alert-card-${alert.id}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{alert.title}</CardTitle>
            <p className="text-sm text-slate-400">{alert.description}</p>
          </div>
          <RiskBadge score={alert.risk_score} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <SeverityBadge severity={alert.severity} />
          <StatusBadge status={alert.status} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-slate-400">
            <Cloud className="h-4 w-4 mr-2" />
            <span className="capitalize">{alert.cloud_provider}</span>
          </div>
          <div className="flex items-center text-slate-400">
            <Server className="h-4 w-4 mr-2" />
            <span>{alert.resource_type}</span>
          </div>
          <div className="flex items-center text-slate-400 col-span-2">
            <Clock className="h-4 w-4 mr-2" />
            <span>{formatTimestamp(alert.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
