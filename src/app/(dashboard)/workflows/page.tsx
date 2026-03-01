'use client';

import { useState, useEffect } from 'react';
import { mockWorkflows } from '@/lib/mock-data';
import { simulateDelay, formatTimestamp } from '@/lib/utils';
import { Workflow, WorkflowStatus } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/layout/skeletons';
import { cn } from '@/lib/utils';
import { Workflow as WorkflowIcon } from 'lucide-react';

function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  const variants = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    executed: 'bg-green-500/10 text-green-400 border-green-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <Badge className={cn('border capitalize', variants[status])} data-testid="workflow-status-badge">
      {status}
    </Badge>
  );
}

export default function WorkflowsPage() {
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await simulateDelay(500);
      setWorkflows(mockWorkflows);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-800 animate-pulse rounded" />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="workflows-page">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Automated Workflows</h1>
        <p className="text-slate-400">Track automated remediation and notification workflows</p>
      </div>

      {/* Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workflow ID</TableHead>
              <TableHead>Alert ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Executed By</TableHead>
              <TableHead>Execution Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map((workflow) => (
              <TableRow key={workflow.id} data-testid={`workflow-row-${workflow.id}`}>
                <TableCell>
                  <span className="text-slate-300 font-medium">{workflow.id}</span>
                </TableCell>
                <TableCell>
                  <span className="text-blue-400">{workflow.alert_id}</span>
                </TableCell>
                <TableCell>
                  <span className="text-slate-300 capitalize">
                    {workflow.type.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>
                  <WorkflowStatusBadge status={workflow.status} />
                </TableCell>
                <TableCell>
                  <span className="text-slate-300">{workflow.executed_by}</span>
                </TableCell>
                <TableCell>
                  <span className="text-slate-400 text-sm">{formatTimestamp(workflow.executed_at)}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-slate-400">
        Showing {workflows.length} workflows
      </div>
    </div>
  );
}
