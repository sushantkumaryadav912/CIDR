'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAlertById, getWorkflowsForAlert } from '@/lib/mock-data';
import { simulateDelay, formatTimestamp } from '@/lib/utils';
import { Alert, Workflow } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RiskBadge, SeverityBadge, StatusBadge } from '@/components/alerts/badges';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Shield, Clock, Server, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AlertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showFalsePositiveModal, setShowFalsePositiveModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await simulateDelay(500);
      const alertData = getAlertById(params.id as string);
      if (alertData) {
        setAlert(alertData);
        setWorkflows(getWorkflowsForAlert(alertData.id));
      }
      setLoading(false);
    };
    loadData();
  }, [params.id]);

  const handleApproveRemediation = async () => {
    await simulateDelay(1000);
    setShowApproveModal(false);
    // In real app, would update alert status
  };

  const handleMarkFalsePositive = async () => {
    await simulateDelay(1000);
    setShowFalsePositiveModal(false);
    // In real app, would update alert status
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-300 mb-2">Alert Not Found</h2>
        <p className="text-slate-500 mb-4">The alert you're looking for doesn't exist.</p>
        <Link href="/alerts">
          <Button variant="outline">Back to Alerts</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="alert-detail-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/alerts">
            <Button variant="ghost" size="icon" data-testid="back-to-alerts">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">{alert.title}</h1>
            <p className="text-slate-400 mt-1">Alert ID: {alert.id}</p>
          </div>
        </div>
        <RiskBadge score={alert.risk_score} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Alert Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Alert Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">Description</h3>
                <p className="text-slate-300">{alert.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">Recommendation</h3>
                <p className="text-slate-300">{alert.recommendation}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Severity</h3>
                  <SeverityBadge severity={alert.severity} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Status</h3>
                  <StatusBadge status={alert.status} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Score Visualization */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Risk Score</span>
                  <span className="text-slate-100 font-medium">{alert.risk_score}/100</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      alert.risk_score < 60 ? 'bg-blue-500' :
                      alert.risk_score < 85 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${alert.risk_score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Risk level: {alert.risk_score < 60 ? 'Low' : alert.risk_score < 85 ? 'Medium' : 'High'}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Retry Attempts</h3>
                <p className="text-slate-100">{alert.retry_attempts} attempt(s)</p>
              </div>
            </CardContent>
          </Card>

          {/* Related Logs */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Related Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm">No related logs found for this alert.</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Metadata & Actions */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Cloud Provider</p>
                  <p className="text-slate-100 capitalize">{alert.cloud_provider}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Server className="h-5 w-5 text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Resource Type</p>
                  <p className="text-slate-100">{alert.resource_type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Created At</p>
                  <p className="text-slate-100 text-sm">{formatTimestamp(alert.created_at)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Last Updated</p>
                  <p className="text-slate-100 text-sm">{formatTimestamp(alert.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Affected Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {alert.affected_services.map((service) => (
                  <span
                    key={service}
                    className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={() => setShowApproveModal(true)}
                data-testid="approve-remediation-button"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Remediation
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowFalsePositiveModal(true)}
                data-testid="mark-false-positive-button"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Mark as False Positive
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approve Remediation Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent onClose={() => setShowApproveModal(false)}>
          <DialogHeader>
            <DialogTitle>Approve Remediation</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve automatic remediation for this alert?
              This action will trigger the configured workflow.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproveRemediation} data-testid="confirm-approve">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* False Positive Modal */}
      <Dialog open={showFalsePositiveModal} onOpenChange={setShowFalsePositiveModal}>
        <DialogContent onClose={() => setShowFalsePositiveModal(false)}>
          <DialogHeader>
            <DialogTitle>Mark as False Positive</DialogTitle>
            <DialogDescription>
              Are you sure this is a false positive? This will update the alert status
              and help improve future detection accuracy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFalsePositiveModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleMarkFalsePositive}
              data-testid="confirm-false-positive"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
