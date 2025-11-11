import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CreditCard, DollarSign, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import { PaymentCheckout } from './PaymentCheckout';
import { PatientRefundRequest } from './PatientRefundRequest';

interface Invoice {
  id: string;
  date: string;
  service: string;
  provider: string;
  amount: number;
  status: 'pending' | 'paid' | 'refunded' | 'partial_refund';
  paymentMethod?: string;
  processingFee?: number;
}

export function PatientPortal() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showRefundRequest, setShowRefundRequest] = useState(false);

  const invoices: Invoice[] = [
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      service: 'General Consultation',
      provider: 'Dr. Sarah Johnson',
      amount: 150.0,
      status: 'pending',
    },
    {
      id: 'INV-2024-002',
      date: '2024-01-10',
      service: 'Blood Test Panel',
      provider: 'Lab Services',
      amount: 200.0,
      status: 'paid',
      paymentMethod: 'Credit Card',
      processingFee: 6.1,
    },
    {
      id: 'INV-2024-003',
      date: '2024-01-05',
      service: 'X-Ray Imaging',
      provider: 'Radiology Dept',
      amount: 350.0,
      status: 'paid',
      paymentMethod: 'ACH',
      processingFee: 3.5,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      case 'partial_refund':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showPayment && selectedInvoice) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => {
            setShowPayment(false);
            setSelectedInvoice(null);
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Button>
        <PaymentCheckout invoice={selectedInvoice} onComplete={() => {
          setShowPayment(false);
          setSelectedInvoice(null);
        }} />
      </div>
    );
  }

  if (showRefundRequest && selectedInvoice) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => {
            setShowRefundRequest(false);
            setSelectedInvoice(null);
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Button>
        <PatientRefundRequest invoice={selectedInvoice} onComplete={() => {
          setShowRefundRequest(false);
          setSelectedInvoice(null);
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Info Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Welcome, John Doe</CardTitle>
          <CardDescription>Patient ID: PT-2024-12345</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="text-gray-900">$150.00</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Paid This Year</p>
                <p className="text-gray-900">$550.00</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <FileText className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-gray-900">3</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Your Invoices</CardTitle>
          <CardDescription>View and manage your medical billing statements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-gray-900">{invoice.service}</h3>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{invoice.provider}</p>
                    <p className="text-sm text-gray-500">Invoice: {invoice.id} • Date: {invoice.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">${invoice.amount.toFixed(2)}</p>
                    {invoice.processingFee && (
                      <p className="text-xs text-gray-500">+ ${invoice.processingFee.toFixed(2)} fee</p>
                    )}
                  </div>
                </div>

                {invoice.status === 'paid' && invoice.paymentMethod && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard className="w-4 h-4" />
                      <span>Paid via {invoice.paymentMethod}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowRefundRequest(true);
                      }}
                    >
                      Request Refund
                    </Button>
                  </div>
                )}

                {invoice.status === 'pending' && (
                  <div className="pt-3 border-t border-gray-100">
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowPayment(true);
                      }}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
