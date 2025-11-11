import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { CreditCard, Building2, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Separator } from './ui/separator';

interface PaymentCheckoutProps {
  invoice: {
    id: string;
    service: string;
    amount: number;
  };
  onComplete: () => void;
}

interface PaymentMethod {
  type: string;
  label: string;
  icon: typeof CreditCard;
  feePercent: number;
  feeFixed: number;
}

export function PaymentCheckout({ invoice, onComplete }: PaymentCheckoutProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('credit_card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null); // <-- ADDED: For API errors
  const [transactionId, setTransactionId] = useState<string | null>(null); // <-- ADDED: To store Txn ID

  const paymentMethods: PaymentMethod[] = [
    {
      type: 'credit_card',
      label: 'Credit/Debit Card',
      icon: CreditCard,
      feePercent: 2.9,
      feeFixed: 0.3,
    },
    {
      type: 'ach',
      label: 'ACH Bank Transfer',
      icon: Building2,
      feePercent: 1.0,
      feeFixed: 0,
    },
    {
      type: 'wallet',
      label: 'MediPay Wallet',
      icon: Wallet,
      feePercent: 0,
      feeFixed: 0,
    },
  ];

  const currentMethod = paymentMethods.find((m) => m.type === selectedMethod)!;
  const processingFee = invoice.amount * (currentMethod.feePercent / 100) + currentMethod.feeFixed;
  const totalAmount = invoice.amount + processingFee;

  // --- REPLACED: handlePayment function ---
  const handlePayment = async () => {
    setProcessing(true);
    setSuccess(false);
    setError(null); // Reset errors on a new attempt

    try {
      // Call the backend API
      const response = await fetch('http://localhost:5000/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          service: invoice.service,
          amount: totalAmount.toFixed(2),
          paymentMethodType: selectedMethod,
          // NOTE: In a real-world app, you would send a *token* from a
          // payment provider (like Stripe.js) here, NOT raw credit card data.
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server errors (e.g., 400, 500)
        throw new Error(data.message || 'Payment failed. Please try again.');
      }

      // --- Payment was successful ---
      setProcessing(false);
      setSuccess(true);
      setTransactionId(data.transactionId); // Save the transaction ID from the backend

      // Wait 2 seconds on the success screen before calling onComplete
      setTimeout(() => {
        onComplete();
      }, 2000);

    } catch (err: any) {
      // Handle network errors or the error thrown above
      console.error('Payment API call failed:', err);
      setProcessing(false);
      setError(err.message || 'An unknown error occurred. Please check your connection.');
    }
  };
  // --- END OF REPLACEMENT ---


  if (success) {
    return (
      <Card className="bg-white max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your payment of ${totalAmount.toFixed(2)} has been processed successfully.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto">
              <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
              <p className="text-gray-900">{transactionId || 'Processing...'}</p>
              <p className="text-sm text-gray-600 mt-3 mb-1">Invoice</p>
              <p className="text-gray-900">{invoice.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ... (Invoice Summary card - no changes) ... */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Payment Checkout</CardTitle>
          <CardDescription>Complete your payment for healthcare services</CardDescription>
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
              <span className="text-gray-600">Amount</span>
              <span className="text-gray-900">${invoice.amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ... (Payment Method Selection card - no changes) ... */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.type}
                  onClick={() => setSelectedMethod(method.type)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedMethod === method.type
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    selectedMethod === method.type ? 'text-indigo-600' : 'text-gray-600'
                  }`} />
                  <p className={`text-sm ${
                    selectedMethod === method.type ? 'text-indigo-900' : 'text-gray-900'
                  }`}>
                    {method.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* ... (Payment Details Form logic - no changes) ... */}
          {selectedMethod === 'credit_card' && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" type="password" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
            </div>
          )}
          {selectedMethod === 'ach' && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="routing">Routing Number</Label>
                <Input id="routing" placeholder="123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account Number</Label>
                <Input id="account" placeholder="0000123456" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Select defaultValue="checking">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {selectedMethod === 'wallet' && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                You will pay using your MediPay Wallet balance. Current balance: $500.00
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>


      {/* --- Fee Breakdown & Pay Button Card --- */}
      <Card className="bg-white border-2 border-indigo-200">
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Transparent breakdown of all charges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* ... (Fee breakdown - no changes) ... */}
            <div className="flex justify-between">
              <span className="text-gray-600">Service Amount</span>
              <span className="text-gray-900">${invoice.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-600">Processing Fee</span>
                {processingFee > 0 && (
                  <p className="text-xs text-gray-500">
                    ({currentMethod.feePercent}% + ${currentMethod.feeFixed.toFixed(2)})
                  </p>
                )}
              </div>
              <span className="text-gray-900">
                {processingFee > 0 ? `$${processingFee.toFixed(2)}` : 'FREE'}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-gray-900">Total Amount</span>
              <span className="text-indigo-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <Alert className="bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900 text-sm">
              Your payment is secured with 256-bit encryption and is HIPAA & PCI-DSS compliant.
            </AlertDescription>
          </Alert>

          {/* --- ADDED: Error message display --- */}
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">
                {error}
              </AlertDescription>
            </Alert>
          )}
          {/* --- END OF ADDED BLOCK --- */}

          <Button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {processing ? 'Processing Payment...' : `Pay $${totalAmount.toFixed(2)}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}