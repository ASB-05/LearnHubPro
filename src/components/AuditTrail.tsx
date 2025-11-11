import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  CreditCard,
  RefreshCw,
  Database,
  Shield,
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'payment' | 'refund' | 'ehr_sync' | 'admin' | 'security';
  user: string;
  userId: string;
  details: string;
  status: 'success' | 'failed' | 'pending';
  ipAddress: string;
  metadata?: Record<string, any>;
}

export function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const auditLogs: AuditLog[] = [
    {
      id: 'AUD-2024-1234',
      timestamp: '2024-01-15 14:32:18',
      action: 'Refund Approved',
      category: 'refund',
      user: 'Admin Sarah Johnson',
      userId: 'ADM-001',
      details: 'Approved refund REF-2024-042 for $300.00 to patient David Brown',
      status: 'success',
      ipAddress: '192.168.1.45',
      metadata: {
        refundId: 'REF-2024-042',
        amount: 300.0,
        patientId: 'PT-2024-45678',
      },
    },
    {
      id: 'AUD-2024-1233',
      timestamp: '2024-01-15 14:28:45',
      action: 'EHR Sync Completed',
      category: 'ehr_sync',
      user: 'System',
      userId: 'SYS-001',
      details: 'Successfully synced 45 payment records with EHR system',
      status: 'success',
      ipAddress: '10.0.0.1',
      metadata: {
        recordsUpdated: 45,
        syncDuration: '2.3s',
      },
    },
    {
      id: 'AUD-2024-1232',
      timestamp: '2024-01-15 14:15:22',
      action: 'Payment Processed',
      category: 'payment',
      user: 'Patient Portal',
      userId: 'PT-2024-78901',
      details: 'Payment of $206.10 processed via Credit Card for invoice INV-2024-089',
      status: 'success',
      ipAddress: '203.45.67.89',
      metadata: {
        invoiceId: 'INV-2024-089',
        amount: 200.0,
        processingFee: 6.1,
        paymentMethod: 'Credit Card',
      },
    },
    {
      id: 'AUD-2024-1231',
      timestamp: '2024-01-15 14:10:55',
      action: 'Refund Request Submitted',
      category: 'refund',
      user: 'Patient Linda Martinez',
      userId: 'PT-2024-78901',
      details: 'Submitted partial refund request for $50.00 on invoice INV-2024-089',
      status: 'success',
      ipAddress: '203.45.67.89',
      metadata: {
        refundId: 'REF-2024-045',
        amount: 50.0,
        type: 'partial',
        reason: 'Billing Error',
      },
    },
    {
      id: 'AUD-2024-1230',
      timestamp: '2024-01-15 13:58:12',
      action: 'Admin Login',
      category: 'security',
      user: 'Admin Sarah Johnson',
      userId: 'ADM-001',
      details: 'Administrator logged into the system',
      status: 'success',
      ipAddress: '192.168.1.45',
      metadata: {
        loginMethod: '2FA',
      },
    },
    {
      id: 'AUD-2024-1229',
      timestamp: '2024-01-15 13:45:33',
      action: 'Payment Gateway Fee Update',
      category: 'admin',
      user: 'Admin John Doe',
      userId: 'ADM-002',
      details: 'Updated Stripe processing fee from 2.8% to 2.9%',
      status: 'success',
      ipAddress: '192.168.1.50',
      metadata: {
        gateway: 'Stripe',
        oldFee: '2.8%',
        newFee: '2.9%',
      },
    },
    {
      id: 'AUD-2024-1228',
      timestamp: '2024-01-15 13:30:18',
      action: 'EHR Sync Failed',
      category: 'ehr_sync',
      user: 'System',
      userId: 'SYS-001',
      details: 'Failed to sync with EHR system - Connection timeout',
      status: 'failed',
      ipAddress: '10.0.0.1',
      metadata: {
        error: 'Connection timeout after 30s',
        retryScheduled: true,
      },
    },
    {
      id: 'AUD-2024-1227',
      timestamp: '2024-01-15 13:15:47',
      action: 'Refund Rejected',
      category: 'refund',
      user: 'Admin Sarah Johnson',
      userId: 'ADM-001',
      details: 'Rejected refund request REF-2024-040 - Insufficient documentation',
      status: 'success',
      ipAddress: '192.168.1.45',
      metadata: {
        refundId: 'REF-2024-040',
        rejectionReason: 'Insufficient documentation',
      },
    },
    {
      id: 'AUD-2024-1226',
      timestamp: '2024-01-15 12:58:29',
      action: 'Payment Failed',
      category: 'payment',
      user: 'Patient Portal',
      userId: 'PT-2024-56789',
      details: 'Payment attempt failed - Card declined',
      status: 'failed',
      ipAddress: '198.23.45.67',
      metadata: {
        invoiceId: 'INV-2024-085',
        amount: 150.0,
        errorCode: 'card_declined',
      },
    },
    {
      id: 'AUD-2024-1225',
      timestamp: '2024-01-15 12:42:15',
      action: 'Data Export',
      category: 'admin',
      user: 'Admin John Doe',
      userId: 'ADM-002',
      details: 'Exported payment transactions report for December 2024',
      status: 'success',
      ipAddress: '192.168.1.50',
      metadata: {
        reportType: 'Transactions',
        dateRange: 'Dec 2024',
        recordCount: 1250,
      },
    },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment':
        return <CreditCard className="w-4 h-4" />;
      case 'refund':
        return <RefreshCw className="w-4 h-4" />;
      case 'ehr_sync':
        return <Database className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment':
        return 'bg-blue-100 text-blue-800';
      case 'refund':
        return 'bg-purple-100 text-purple-800';
      case 'ehr_sync':
        return 'bg-green-100 text-green-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <RefreshCw className="w-4 h-4 text-yellow-600" />;
    }
  };

  const exportAuditLog = () => {
    // Mock export functionality
    console.log('Exporting audit log...');
    alert('Audit log export initiated. CSV file will be downloaded shortly.');
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Complete log of all system activities for compliance and security
              </CardDescription>
            </div>
            <Button onClick={exportAuditLog} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="ehr_sync">EHR Sync</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Showing {filteredLogs.length} of {auditLogs.length} logs</span>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getStatusIcon(log.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900">{log.action}</h3>
                        <Badge className={getCategoryColor(log.category)}>
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(log.category)}
                            {log.category.replace('_', ' ')}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{log.details}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-900">{log.timestamp}</p>
                      <p className="text-xs text-gray-500">ID: {log.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-gray-600 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">User:</span>
                      <span>{log.user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">IP:</span>
                      <span>{log.ipAddress}</span>
                    </div>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Metadata:</span>
                        <span className="text-indigo-600">
                          {Object.keys(log.metadata).length} fields
                        </span>
                      </div>
                    )}
                  </div>

                  {log.metadata && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs space-y-1">
                      {Object.entries(log.metadata).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-gray-500">{key}:</span>
                          <span className="text-gray-900">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Notice */}
      <Card className="bg-white border-2 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="text-gray-900 mb-1">Compliance & Security</h3>
              <p className="text-sm text-gray-600 mb-2">
                All audit logs are encrypted and stored securely in compliance with HIPAA regulations.
                Logs are retained for 7 years and are tamper-proof.
              </p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>✓ HIPAA Compliant</span>
                <span>✓ PCI-DSS Level 1</span>
                <span>✓ SOC 2 Type II</span>
                <span>✓ 256-bit Encryption</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
