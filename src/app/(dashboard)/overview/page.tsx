'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAlerts, getDashboardMetrics } from '@/lib/mock-data';
import { simulateDelay } from '@/lib/utils';
import { AlertTriangle, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { AlertCard } from '@/components/alerts/alert-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function OverviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(getDashboardMetrics());
  const [recentAlerts, setRecentAlerts] = useState(mockAlerts.slice(0, 5));

  useEffect(() => {
    const loadData = async () => {
      await simulateDelay(500);
      setMetrics(getDashboardMetrics());
      setRecentAlerts(mockAlerts.slice(0, 5));
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="overview-page">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Security Overview</h1>
        <p className="text-slate-400">Monitor your cloud security posture at a glance</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Alerts</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100" data-testid="metric-total-alerts">{metrics.total_alerts}</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Critical Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400" data-testid="metric-critical-alerts">{metrics.critical_alerts}</div>
            <p className="text-xs text-slate-500 mt-1">Requiring immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Open Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-400" data-testid="metric-open-alerts">{metrics.open_alerts}</div>
            <p className="text-xs text-slate-500 mt-1">Currently under investigation</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Resolved Alerts</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400" data-testid="metric-resolved-alerts">{metrics.resolved_alerts}</div>
            <p className="text-xs text-slate-500 mt-1">Successfully mitigated</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>Risk Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">Low Risk (0-59)</span>
                <span className="text-sm text-blue-400">
                  {mockAlerts.filter(a => a.risk_score < 60).length} alerts
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(mockAlerts.filter(a => a.risk_score < 60).length / mockAlerts.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">Medium Risk (60-84)</span>
                <span className="text-sm text-amber-400">
                  {mockAlerts.filter(a => a.risk_score >= 60 && a.risk_score < 85).length} alerts
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${(mockAlerts.filter(a => a.risk_score >= 60 && a.risk_score < 85).length / mockAlerts.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">High Risk (85-100)</span>
                <span className="text-sm text-red-400">
                  {mockAlerts.filter(a => a.risk_score >= 85).length} alerts
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${(mockAlerts.filter(a => a.risk_score >= 85).length / mockAlerts.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-100">Recent Alerts</h2>
          <Link
            href="/alerts"
            className="text-sm text-blue-400 hover:text-blue-300"
            data-testid="view-all-alerts"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-4">
          {recentAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onClick={() => router.push(`/alerts/${alert.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
