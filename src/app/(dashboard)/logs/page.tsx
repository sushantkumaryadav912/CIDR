'use client';

import { useState, useEffect, useMemo } from 'react';
import { mockLogs } from '@/lib/mock-data';
import { simulateDelay, formatTimestamp } from '@/lib/utils';
import { Log } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RiskBadge } from '@/components/alerts/badges';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/layout/skeletons';
import { EmptyState } from '@/components/layout/empty-state';
import { FileText } from 'lucide-react';

export default function LogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<Log[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await simulateDelay(500);
      setLogs(mockLogs);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const searchLower = searchTerm.toLowerCase();
      return (
        searchTerm === '' ||
        log.event_type.toLowerCase().includes(searchLower) ||
        log.user.toLowerCase().includes(searchLower) ||
        log.source_ip.includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower)
      );
    });
  }, [logs, searchTerm]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-800 animate-pulse rounded" />
        <TableSkeleton rows={10} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="logs-page">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Security Logs</h1>
        <p className="text-slate-400">View and search security events across your infrastructure</p>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search logs by event type, user, IP, or action..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="logs-search-input"
        />
      </div>

      {/* Table */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No logs found"
          description="Try adjusting your search criteria"
        />
      ) : (
        <div className="border border-slate-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Source IP</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} data-testid={`log-row-${log.id}`}>
                  <TableCell>
                    <span className="text-slate-300 capitalize">
                      {log.event_type.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-300">{log.user}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-400 font-mono text-sm">{log.source_ip}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-300 font-medium">{log.action}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-400 text-sm">{log.resource}</span>
                  </TableCell>
                  <TableCell>
                    <RiskBadge score={log.risk_score} />
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-400 text-sm">{formatTimestamp(log.timestamp)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="text-sm text-slate-400">
        Showing {filteredLogs.length} of {logs.length} logs
      </div>
    </div>
  );
}
