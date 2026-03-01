'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { mockAlerts } from '@/lib/mock-data';
import { simulateDelay, formatTimestamp } from '@/lib/utils';
import { Alert, Severity, AlertStatus, CloudProvider } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RiskBadge, SeverityBadge, StatusBadge } from '@/components/alerts/badges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/layout/skeletons';
import { EmptyState } from '@/components/layout/empty-state';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

export default function AlertsPage() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [cloudFilter, setCloudFilter] = useState<CloudProvider | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await simulateDelay(500);
      // Sort by risk_score descending
      const sorted = [...mockAlerts].sort((a, b) => b.risk_score - a.risk_score);
      setAlerts(sorted);
      setLoading(false);
    };
    loadData();
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
      const matchesCloud = cloudFilter === 'all' || alert.cloud_provider === cloudFilter;
      const matchesSearch = searchTerm === '' || 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSeverity && matchesStatus && matchesCloud && matchesSearch;
    });
  }, [alerts, severityFilter, statusFilter, cloudFilter, searchTerm]);

  const paginatedAlerts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredAlerts.slice(start, end);
  }, [filteredAlerts, currentPage]);

  const totalPages = Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-800 animate-pulse rounded" />
        <TableSkeleton rows={10} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="alerts-page">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Security Alerts</h1>
        <p className="text-slate-400">Monitor and manage security threats across your infrastructure</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search alerts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="alerts-search-input"
        />
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as Severity | 'all')}
          className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="severity-filter"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AlertStatus | 'all')}
          className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="status-filter"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="false_positive">False Positive</option>
        </select>
        <select
          value={cloudFilter}
          onChange={(e) => setCloudFilter(e.target.value as CloudProvider | 'all')}
          className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          data-testid="cloud-filter"
        >
          <option value="all">All Providers</option>
          <option value="aws">AWS</option>
          <option value="azure">Azure</option>
          <option value="gcp">GCP</option>
          <option value="multi-cloud">Multi-Cloud</option>
        </select>
      </div>

      {/* Table */}
      {paginatedAlerts.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No alerts found"
          description="Try adjusting your filters or search criteria"
        />
      ) : (
        <>
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cloud Provider</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAlerts.map((alert) => (
                  <TableRow key={alert.id} data-testid={`alert-row-${alert.id}`}>
                    <TableCell>
                      <Link
                        href={`/alerts/${alert.id}`}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                        data-testid={`alert-link-${alert.id}`}
                      >
                        {alert.title}
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">{alert.resource_id}</p>
                    </TableCell>
                    <TableCell>
                      <RiskBadge score={alert.risk_score} />
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={alert.severity} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={alert.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-300 capitalize">{alert.cloud_provider}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-400 text-sm">{formatTimestamp(alert.created_at)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAlerts.length)} of {filteredAlerts.length} alerts
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
        </>
      )}
    </div>
  );
}
