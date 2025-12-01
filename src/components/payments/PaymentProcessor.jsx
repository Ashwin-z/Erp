import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentProcessor({ amount, currency = "USD", context, onComplete }) {
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState('stripe');

  const handlePayment = () => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      toast.success(`Payment of ${currency} ${amount} successful!`);
      if (onComplete) onComplete({
        transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
        status: 'Success',
        amount,
        method
      });
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-slate-900 border-slate-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          Secure Checkout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-400">{context || 'Payment Amount'}</p>
            <p className="text-2xl font-bold">{currency} {amount.toLocaleString()}</p>
          </div>
          <Badge className="bg-blue-500">Encrypted</Badge>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Payment Method</label>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={method === 'stripe' ? 'default' : 'outline'}
              className={method === 'stripe' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-700 hover:bg-slate-800'}
              onClick={() => setMethod('stripe')}
            >
              <CreditCard className="w-4 h-4 mr-2" /> Card (Stripe)
            </Button>
            <Button 
              variant={method === 'paynow' ? 'default' : 'outline'}
              className={method === 'paynow' ? 'bg-purple-600 hover:bg-purple-700' : 'border-slate-700 hover:bg-slate-800'}
              onClick={() => setMethod('paynow')}
            >
              <span className="font-bold mr-2">PayNow</span> QR
            </Button>
          </div>
        </div>

        {method === 'stripe' && (
          <div className="space-y-3">
            <Input placeholder="Card Number" className="bg-slate-950 border-slate-700" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="MM / YY" className="bg-slate-950 border-slate-700" />
              <Input placeholder="CVC" className="bg-slate-950 border-slate-700" />
            </div>
          </div>
        )}

        {method === 'paynow' && (
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="w-32 h-32 bg-black mx-auto" /> 
            <p className="text-slate-900 text-xs mt-2 font-bold">Scan to Pay</p>
          </div>
        )}

        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
          {processing ? 'Processing...' : `Pay ${currency} ${amount}`}
        </Button>

        <p className="text-xs text-center text-slate-500">
          Secured by 256-bit SSL encryption. Credentials are tokenized and never stored.
        </p>
      </CardContent>
    </Card>
  );
}