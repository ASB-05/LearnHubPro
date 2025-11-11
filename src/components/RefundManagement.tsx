import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Eye,
  FileText
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

interface RefundRequest {
  id: string;
  patient: string;
  patientId: string;
  invoice: string;
  amount: number;
  originalAmount: number;
  type: 'full' | 'partial';
  reason: string;
  description: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  priority: 'high' | 'medium' | 'low';
  paymentMethod: string;
  processingFee: number;
}

export function RefundManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const refundRequests: RefundRequest[] = [
    {
      id: 'REF-2024-045',
      patient: 'Linda Martinez',
      patientId: 'PT-2024-78901',
      invoice: 'INV-2024-089',
      amount: 50.0,
      originalAmount: 200.0,
      type: 'partial',
      reason: 'Billing Error',
      description: 'Overcharged for consultation time. Should be 30 minutes, not 60 minutes.',
      requestDate: '2024-01-14 02:30 PM',
      status: 'pending',
      priority: 'high',
      paymentMethod: 'Credit Card',
      processingFee: 6.1,
    },
    {
      id: 'REF-2024-044',
      patient: 'Robert Taylor',
      patientId: 'PT-2024-67890',
      invoice: 'INV-2024-076',
      amount: 200.0,
      originalAmount: 200.0,
      type: 'full',
      reason: 'Service Cancelled',
      description: 'Appointment was cancelled 48 hours in advance due to medical emergency.',
      requestDate: '2024-01-13 11:15 AM',
      status: 'pending',
      priority: 'medium',
      paymentMethod: 'ACH',
      processingFee: 2.0,
    },
    {
      id: 'REF-2024-043',
      patient: 'Jennifer Lee',
      patientId: 'PT-2024-56789',
      invoice: 'INV-2024-068',
      amount: 125.0,
      originalAmount: 350.0,
      type: 'partial',
      reason: 'Insurance Adjustment',
      description: 'Insurance covered more than initially estimated. Refund difference to patient.',
      requestDate: '2024-01-12 09:45 AM',
      status: 'pending',
      priority: 'low',
      paymentMethod: 'Credit Card',
      processingFee: 10.65,
    },
    {
      id: 'REF-2024-042',
      patient: 'David Brown',
      patientId: 'PT-2024-45678',
      invoice: 'INV-2024-055',
      amount: 300.0,
      originalAmount: 300.0,
      type: 'full',
      reason: 'Duplicate Payment',
      description: 'Patient accidentally paid twice for the same service.',
      requestDate: '2024-01-11 03:20 PM',
      status: 'approved',
      priority: 'high',
      paymentMethod: 'Credit Card',
      processingFee: 9.0,
    },
    {
      id: 'REF-2024-041',
      patient: 'Maria Garcia',
      patientId: 'PT-2024-34567',
      invoice: 'INV-2024-042',
      amount: 75.0,
      originalAmount: 150.0,
      type: 'partial',
      reason: 'Overcharge',
      description: 'Lab test was charged incorrectly.',
      requestDate: '2024-01-10 01:00 PM',
      status: 'processed',
      priority: 'medium',
      paymentMethod: 'ACH',
      processingFee: 1.5,
    },
  ];

  const filteredRequests = refundRequests.filter(
    (request) =>
      request.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.invoice.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'processed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'processed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (request: RefundRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setShowDialog(true);
  };

  const confirmAction = () => {
    // Here you would process the action
    console.log(`${actionType} refund ${selectedRequest?.id} with notes: ${adminNotes}`);
    setShowDialog(false);
    setSelectedRequest(null);
    setActionType(null);
    setAdminNotes('');
  };

  const RequestCard = ({ request }: { request: RefundRequest }) => (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-gray-900">{request.patient}</h3>
                <Badge className={getStatusColor(request.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>
                </Badge>
                <Badge className={getPriorityColor(request.priority)}>
                  {request.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Patient ID: {request.patientId}</p>
              <p className="text-sm text-gray-600">Invoice: {request.invoice}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-900">${request.amount.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{request.type} refund</p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Original Amount:</span>
              <span className="text-gray-900">${request.originalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Processing Fee:</span>
              <span className="text-gray-900">${request.processingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method:</span>
              <span className="text-gray-900">{request.paymentMethod}</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Reason: {request.reason}</p>
            <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">{request.description}</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">Requested: {request.requestDate}</p>
            {request.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleAction(request, 'reject')}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleAction(request, 'approve')}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              </div>
            )}
            {request.status !== 'pending' && (
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Refund Management</CardTitle>
          <CardDescription>Review and process patient refund requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by patient name, refund ID, or invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for filtering */}
      <Tabs defaultValue="all">
        <TabsList className="bg-white">
          <TabsTrigger value="all">
            All Requests ({filteredRequests.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filteredRequests.filter((r) => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({filteredRequests.filter((r) => r.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            Processed ({filteredRequests.filter((r) => r.status === 'processed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredRequests
            .filter((r) => r.status === 'pending')
            .map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filteredRequests
            .filter((r) => r.status === 'approved')
            .map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          {filteredRequests
            .filter((r) => r.status === 'processed')
            .map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Refund Request' : 'Reject Refund Request'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'This will process the refund and notify the patient.'
                : 'Please provide a reason for rejecting this refund request.'}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Patient:</span>
                  <span className="text-sm text-gray-900">{selectedRequest.patient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Refund Amount:</span>
                  <span className="text-sm text-gray-900">${selectedRequest.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Invoice:</span>
                  <span className="text-sm text-gray-900">{selectedRequest.invoice}</span>
                </div>
              </div>

              {actionType === 'approve' && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-900 text-sm">
                    The refund will be processed through the original payment method ({selectedRequest.paymentMethod}) and the EHR system will be updated automatically.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">
                  {actionType === 'approve' ? 'Admin Notes (Optional)' : 'Rejection Reason'}
                </Label>
                <Textarea
                  id="notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={
                    actionType === 'approve'
                      ? 'Add any internal notes...'
                      : 'Explain why this request is being rejected...'
                  }
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={
                actionType === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {actionType === 'approve' ? 'Approve & Process' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
