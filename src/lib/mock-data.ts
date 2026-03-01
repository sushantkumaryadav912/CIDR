import { Alert, Log, Workflow, AuditLog, Severity, AlertStatus, CloudProvider } from './types';

// Helper function to generate random dates
const randomDate = (daysAgo: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Mock Alerts Data (12 alerts)
export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    title: 'Unusual API call pattern detected in S3 bucket',
    description: 'Multiple GetObject calls from unknown IP address detected in production S3 bucket',
    severity: 'critical',
    risk_score: 92,
    status: 'open',
    cloud_provider: 'aws',
    resource_type: 's3_bucket',
    resource_id: 'prod-data-bucket-2024',
    created_at: randomDate(1),
    updated_at: randomDate(1),
    retry_attempts: 0,
    affected_services: ['S3', 'CloudTrail'],
    recommendation: 'Review bucket access policies and enable MFA delete'
  },
  {
    id: 'ALT-002',
    title: 'Unauthorized IAM policy modification',
    description: 'IAM policy changed to allow broad S3 access from external account',
    severity: 'critical',
    risk_score: 95,
    status: 'investigating',
    cloud_provider: 'aws',
    resource_type: 'iam_policy',
    resource_id: 'prod-admin-policy',
    created_at: randomDate(2),
    updated_at: randomDate(1),
    retry_attempts: 2,
    affected_services: ['IAM', 'STS'],
    recommendation: 'Revert policy changes and rotate credentials immediately'
  },
  {
    id: 'ALT-003',
    title: 'Security group allows unrestricted SSH access',
    description: 'Security group sg-0123456789 modified to allow SSH from 0.0.0.0/0',
    severity: 'high',
    risk_score: 78,
    status: 'open',
    cloud_provider: 'aws',
    resource_type: 'security_group',
    resource_id: 'sg-0123456789',
    created_at: randomDate(3),
    updated_at: randomDate(2),
    retry_attempts: 1,
    affected_services: ['EC2', 'VPC'],
    recommendation: 'Restrict SSH access to specific IP ranges'
  },
  {
    id: 'ALT-004',
    title: 'Blob storage container public access enabled',
    description: 'Azure blob container set to allow anonymous public read access',
    severity: 'high',
    risk_score: 81,
    status: 'resolved',
    cloud_provider: 'azure',
    resource_type: 'blob_container',
    resource_id: 'app-backups-container',
    created_at: randomDate(5),
    updated_at: randomDate(1),
    retry_attempts: 0,
    affected_services: ['Blob Storage', 'Storage Account'],
    recommendation: 'Disable public access and use SAS tokens'
  },
  {
    id: 'ALT-005',
    title: 'GCP firewall rule exposing database port',
    description: 'Firewall rule created allowing PostgreSQL port 5432 from internet',
    severity: 'critical',
    risk_score: 88,
    status: 'open',
    cloud_provider: 'gcp',
    resource_type: 'firewall_rule',
    resource_id: 'allow-postgres-external',
    created_at: randomDate(2),
    updated_at: randomDate(2),
    retry_attempts: 3,
    affected_services: ['Compute Engine', 'VPC'],
    recommendation: 'Remove public access and use Cloud SQL proxy'
  },
  {
    id: 'ALT-006',
    title: 'Root account activity detected',
    description: 'AWS root account used for console login, violating security best practices',
    severity: 'critical',
    risk_score: 97,
    status: 'investigating',
    cloud_provider: 'aws',
    resource_type: 'iam_root',
    resource_id: 'root-account',
    created_at: randomDate(1),
    updated_at: randomDate(1),
    retry_attempts: 0,
    affected_services: ['IAM', 'CloudTrail'],
    recommendation: 'Enable MFA on root account and use IAM users'
  },
  {
    id: 'ALT-007',
    title: 'Encryption disabled on EBS volume',
    description: 'Production EBS volume created without encryption',
    severity: 'medium',
    risk_score: 65,
    status: 'resolved',
    cloud_provider: 'aws',
    resource_type: 'ebs_volume',
    resource_id: 'vol-0987654321',
    created_at: randomDate(7),
    updated_at: randomDate(3),
    retry_attempts: 1,
    affected_services: ['EC2', 'EBS'],
    recommendation: 'Enable encryption for all EBS volumes'
  },
  {
    id: 'ALT-008',
    title: 'Lambda function with overly permissive role',
    description: 'Lambda execution role has Administrator access policy attached',
    severity: 'high',
    risk_score: 76,
    status: 'open',
    cloud_provider: 'aws',
    resource_type: 'lambda_function',
    resource_id: 'data-processor-lambda',
    created_at: randomDate(4),
    updated_at: randomDate(3),
    retry_attempts: 0,
    affected_services: ['Lambda', 'IAM'],
    recommendation: 'Apply principle of least privilege to Lambda role'
  },
  {
    id: 'ALT-009',
    title: 'CloudTrail logging disabled',
    description: 'CloudTrail logging was disabled in us-east-1 region',
    severity: 'critical',
    risk_score: 93,
    status: 'false_positive',
    cloud_provider: 'aws',
    resource_type: 'cloudtrail',
    resource_id: 'main-audit-trail',
    created_at: randomDate(6),
    updated_at: randomDate(2),
    retry_attempts: 0,
    affected_services: ['CloudTrail'],
    recommendation: 'Re-enable CloudTrail and enable log file validation'
  },
  {
    id: 'ALT-010',
    title: 'Suspicious login from new geolocation',
    description: 'User admin@company.com logged in from Russia, first time from this country',
    severity: 'medium',
    risk_score: 72,
    status: 'investigating',
    cloud_provider: 'multi-cloud',
    resource_type: 'user_account',
    resource_id: 'admin@company.com',
    created_at: randomDate(1),
    updated_at: randomDate(1),
    retry_attempts: 1,
    affected_services: ['IAM', 'GuardDuty'],
    recommendation: 'Verify user identity and rotate credentials'
  },
  {
    id: 'ALT-011',
    title: 'Unencrypted RDS snapshot shared publicly',
    description: 'RDS snapshot containing production data shared with public',
    severity: 'critical',
    risk_score: 99,
    status: 'open',
    cloud_provider: 'aws',
    resource_type: 'rds_snapshot',
    resource_id: 'prod-db-snapshot-2024',
    created_at: randomDate(1),
    updated_at: randomDate(1),
    retry_attempts: 0,
    affected_services: ['RDS'],
    recommendation: 'Immediately remove public access and delete snapshot'
  },
  {
    id: 'ALT-012',
    title: 'Certificate expiring soon',
    description: 'SSL certificate for api.company.com expires in 7 days',
    severity: 'low',
    risk_score: 45,
    status: 'resolved',
    cloud_provider: 'aws',
    resource_type: 'acm_certificate',
    resource_id: 'arn:aws:acm:cert-123',
    created_at: randomDate(8),
    updated_at: randomDate(1),
    retry_attempts: 0,
    affected_services: ['ACM', 'CloudFront'],
    recommendation: 'Renew certificate or enable auto-renewal'
  }
];

// Mock Logs Data (30 logs)
export const mockLogs: Log[] = Array.from({ length: 30 }, (_, i) => ({
  id: `LOG-${String(i + 1).padStart(3, '0')}`,
  event_type: ['authentication', 'authorization', 'data_access', 'configuration_change', 'network_activity'][Math.floor(Math.random() * 5)],
  user: ['john.doe@company.com', 'jane.smith@company.com', 'admin@company.com', 'service-account', 'system'][Math.floor(Math.random() * 5)],
  source_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  destination: ['s3.amazonaws.com', 'ec2.amazonaws.com', 'api.company.com', 'db.company.internal'][Math.floor(Math.random() * 4)],
  action: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'][Math.floor(Math.random() * 5)],
  resource: `/api/v1/resource-${i + 1}`,
  timestamp: randomDate(7),
  risk_score: Math.floor(Math.random() * 100),
  details: `Event details for log entry ${i + 1}`
}));

// Mock Workflows Data (6 workflows)
export const mockWorkflows: Workflow[] = [
  {
    id: 'WF-001',
    alert_id: 'ALT-001',
    type: 'auto_remediation',
    status: 'executed',
    executed_at: randomDate(1),
    executed_by: 'system',
    description: 'Automatically revoked public S3 bucket access',
    result: 'Successfully removed public access policy'
  },
  {
    id: 'WF-002',
    alert_id: 'ALT-002',
    type: 'escalation',
    status: 'executed',
    executed_at: randomDate(1),
    executed_by: 'system',
    description: 'Escalated IAM policy change to security team',
    result: 'Notification sent to security@company.com'
  },
  {
    id: 'WF-003',
    alert_id: 'ALT-003',
    type: 'manual_review',
    status: 'pending',
    executed_at: randomDate(2),
    executed_by: 'pending',
    description: 'Security group change requires manual review'
  },
  {
    id: 'WF-004',
    alert_id: 'ALT-005',
    type: 'auto_remediation',
    status: 'failed',
    executed_at: randomDate(2),
    executed_by: 'system',
    description: 'Attempted to remove firewall rule',
    result: 'Failed: Insufficient permissions'
  },
  {
    id: 'WF-005',
    alert_id: 'ALT-006',
    type: 'notification',
    status: 'executed',
    executed_at: randomDate(1),
    executed_by: 'system',
    description: 'Sent root account usage alert',
    result: 'Email and Slack notification sent'
  },
  {
    id: 'WF-006',
    alert_id: 'ALT-011',
    type: 'auto_remediation',
    status: 'pending',
    executed_at: randomDate(1),
    executed_by: 'system',
    description: 'Queued to remove public RDS snapshot access'
  }
];

// Mock Audit Logs Data (20 logs)
export const mockAuditLogs: AuditLog[] = Array.from({ length: 20 }, (_, i) => ({
  id: `AUD-${String(i + 1).padStart(3, '0')}`,
  actor: ['john.doe@company.com', 'jane.smith@company.com', 'admin@company.com', 'system'][Math.floor(Math.random() * 4)],
  action: ['create', 'update', 'delete', 'read', 'execute'][Math.floor(Math.random() * 5)],
  resource: `resource-${i + 1}`,
  resource_type: ['alert', 'workflow', 'user', 'policy', 'configuration'][Math.floor(Math.random() * 5)],
  result: ['success', 'failure', 'partial'][Math.floor(Math.random() * 3)] as 'success' | 'failure' | 'partial',
  timestamp: randomDate(14),
  ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  details: `Audit log entry ${i + 1} details`
}));

// Helper function to get alert by ID
export const getAlertById = (id: string): Alert | undefined => {
  return mockAlerts.find(alert => alert.id === id);
};

// Helper function to get workflows for an alert
export const getWorkflowsForAlert = (alertId: string): Workflow[] => {
  return mockWorkflows.filter(wf => wf.alert_id === alertId);
};

// Helper function to calculate dashboard metrics
export const getDashboardMetrics = () => {
  return {
    total_alerts: mockAlerts.length,
    critical_alerts: mockAlerts.filter(a => a.severity === 'critical').length,
    open_alerts: mockAlerts.filter(a => a.status === 'open').length,
    resolved_alerts: mockAlerts.filter(a => a.status === 'resolved').length,
    avg_risk_score: Math.round(mockAlerts.reduce((sum, a) => sum + a.risk_score, 0) / mockAlerts.length),
    alerts_today: mockAlerts.filter(a => {
      const alertDate = new Date(a.created_at);
      const today = new Date();
      return alertDate.toDateString() === today.toDateString();
    }).length
  };
};
