'use client';

import { useState, useEffect } from 'react';
import { mockAuditLogs } from '@/lib/mock-data';
import { simulateDelay, formatISOTimestamp } from '@/lib/utils';
import { AuditLog, AuditResult } from '@/lib/types';
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
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 50;

function ResultBadge({ result }: { result: AuditResult }) {
  const variants = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    failure: 'bg-red-500/10 text-red-400 border-red-500/20',
    partial: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <Badge className={cn('border capitalize', variants[result])} data-testid="result-badge">
      {result}
    </Badge>
  );
}

export default function AuditLogsPage() {
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await simulateDelay(500);
      setAuditLogs(mockAuditLogs);
      setLoading(false);
    };
    loadData();
  }, []);

  const paginatedLogs = auditLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(auditLogs.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-800 animate-pulse rounded" />
        <TableSkeleton rows={10} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="audit-logs-page">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Audit Logs</h1>
        <p className="text-slate-400">Immutable record of all system activities for compliance</p>
      </div>

      {/* Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp (ISO)</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.map((log) => (
              <TableRow key={log.id} data-testid={`audit-log-row-${log.id}`}>
                <TableCell>
                  <span className="text-slate-400 text-sm font-mono">
                    {formatISOTimestamp(log.timestamp)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-slate-300">{log.actor}</span>
                </TableCell>
                <TableCell>
                  <span className="text-slate-300 font-medium capitalize">{log.action}</span>
                </TableCell>
                <TableCell>
                  <span className="text-slate-400">{log.resource}</span>
                </TableCell>
                <TableCell>
                  <span className="text-slate-400 capitalize">{log.resource_type}</span>
                </TableCell>
                <TableCell>
                  <ResultBadge result={log.result} />
                </TableCell>
                <TableCell>
                  <span className="text-slate-400 text-sm font-mono">{log.ip_address}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, auditLogs.length)} of {auditLogs.length} audit logs
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            data-testid="pagination-prev"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            data-testid="pagination-next"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
