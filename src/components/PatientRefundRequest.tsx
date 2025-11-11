import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Separator } from './ui/separator';

interface PatientRefundRequestProps {
  invoice: {
    id: string;
    service: string;
    amount: number;
    processingFee?: number;
  };
  onComplete: () => void;
}

export function PatientRefundRequest({ invoice, onComplete }: PatientRefundRequestProps) {
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const maxRefundAmount = invoice.amount;
  const requestedAmount = refundType === 'full' ? maxRefundAmount : parseFloat(partialAmount) || 0;
  const isValid = requestedAmount > 0 && requestedAmount <= maxRefundAmount && reason && description;

  const handleSubmit = async () => {
    if (!isValid) return;
    
    setSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  if (success) {
    return (
      <Card className="bg-white max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-2">Refund Request Submitted</h2>
            <p className="text-gray-600 mb-6">
              Your refund request has been submitted successfully and is pending review.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-1">Request ID</p>
              <p className="text-gray-900">REF-{Date.now()}</p>
              <p className="text-sm text-gray-600 mt-3 mb-1">Requested Amount</p>
              <p className="text-gray-900">${requestedAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-3 mb-1">Status</p>
              <p className="text-yellow-600">Pending Review</p>
            </div>
            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 text-sm">
                You will receive an email notification once your request is reviewed (typically within 2-3 business days).
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Invoice Info */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Request Refund</CardTitle>
          <CardDescription>Submit a refund request for your payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Number</span>
              <span className="text-gray-900">{invoice.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service</span>
              <span className="text-gray-900">{invoice.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Original Amount</span>
              <span className="text-gray-900">${invoice.amount.toFixed(2)}</span>
            </div>
            {invoice.processingFee && (
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Fee Paid</span>
                <span className="text-gray-900">${invoice.processingFee.toFixed(2)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Refund Request Form */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Refund Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Refund Type */}
          <div className="space-y-2">
            <Label>Refund Type</Label>
            <Select value={refundType} onValueChange={(value: 'full' | 'partial') => setRefundType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Refund</SelectItem>
                <SelectItem value="partial">Partial Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Partial Amount */}
          {refundType === 'partial' && (
            <div className="space-y-2">
              <Label htmlFor="amount">Refund Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="pl-8"
                  max={maxRefundAmount}
                  step="0.01"
                />
              </div>
              <p className="text-xs text-gray-500">Maximum refundable: ${maxRefundAmount.toFixed(2)}</p>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Refund</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="billing_error">Billing Error</SelectItem>
                <SelectItem value="service_cancelled">Service Cancelled</SelectItem>
                <SelectItem value="claim_adjustment">Insurance Claim Adjustment</SelectItem>
                <SelectItem value="overcharge">Overcharge</SelectItem>
                <SelectItem value="duplicate">Duplicate Payment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Additional Details</Label>
            <Textarea
              id="description"
              placeholder="Please provide details about your refund request..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-900 text-sm">
              Refund requests typically take 2-3 business days to review. Once approved, funds will be returned to your original payment method within 5-10 business days.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-white border-2 border-indigo-200">
        <CardHeader>
          <CardTitle>Refund Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Original Payment</span>
              <span className="text-gray-900">${invoice.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Requested Refund</span>
              <span className="text-gray-900">${requestedAmount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-900">Amount After Refund</span>
              <span className="text-indigo-600">${(invoice.amount - requestedAmount).toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {submitting ? 'Submitting Request...' : 'Submit Refund Request'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
