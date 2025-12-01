import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  CreditCard, DollarSign, CheckCircle2, Loader2, ExternalLink,
  Smartphone, Building2, Shield, Copy, QrCode
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

// Payment gateway configurations
const paymentGateways = {
  paynow: { name: 'PayNow', icon: Smartphone, color: 'bg-purple-100 text-purple-700', description: 'Singapore QR Payment' },
  stripe: { name: 'Stripe', icon: CreditCard, color: 'bg-blue-100 text-blue-700', description: 'Credit/Debit Card' },
  paypal: { name: 'PayPal', icon: DollarSign, color: 'bg-amber-100 text-amber-700', description: 'PayPal Account' },
  bank: { name: 'Bank Transfer', icon: Building2, color: 'bg-slate-100 text-slate-700', description: 'Direct Bank Transfer' }
};

export default function PaymentIntegration({ invoice, onClose }) {
  const [selectedGateway, setSelectedGateway] = useState('paynow');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [manualRef, setManualRef] = useState('');
  const queryClient = useQueryClient();

  const updateInvoiceMutation = useMutation({
    mutationFn: async (paymentDetails) => {
      await base44.entities.InvoiceNow.update(invoice.id, {
        status: 'paid',
        peppol_status: invoice.peppol_status,
        paid_at: new Date().toISOString(),
        paid_amount: invoice.payable_amount,
        payment_method: paymentDetails.method,
        payment_reference: paymentDetails.reference,
        note: `${invoice.note || ''}\n[Payment] ${paymentDetails.method} - Ref: ${paymentDetails.reference} - ${moment().format('DD MMM YYYY HH:mm')}`
      });

      // Create notification
      await base44.entities.SalesNotification.create({
        type: 'invoice_paid',
        title: 'Invoice Paid',
        message: `${invoice.buyer?.name} paid invoice ${invoice.invoice_number}`,
        reference_type: 'invoice',
        reference_id: invoice.id,
        customer_name: invoice.buyer?.name,
        amount: invoice.payable_amount
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoicenow'] });
      setPaymentComplete(true);
      toast.success('Payment recorded successfully');
    }
  });

  const simulatePayment = async (gateway) => {
    setProcessing(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reference = `${gateway.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    
    await updateInvoiceMutation.mutateAsync({
      method: paymentGateways[gateway].name,
      reference
    });
    
    setProcessing(false);
  };

  const handleManualPayment = async () => {
    if (!manualRef) {
      toast.error('Please enter payment reference');
      return;
    }
    
    await updateInvoiceMutation.mutateAsync({
      method: paymentGateways[selectedGateway].name,
      reference: manualRef
    });
  };

  // Generate PayNow QR data
  const generatePayNowQR = () => {
    const uen = invoice.seller?.uen || '201912345A';
    const amount = invoice.payable_amount?.toFixed(2) || '0.00';
    const ref = invoice.invoice_number || 'INV';
    return `00020101021226380009SG.PAYNOW010120210${uen}0301003040000520400005303702540${amount}5802SG5913${invoice.seller?.name?.substring(0, 13) || 'Company'}6009Singapore62${String(ref.length).padStart(2, '0')}${ref}6304`;
  };

  if (paymentComplete) {
    return (
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-emerald-700 mb-2">Payment Successful!</h3>
          <p className="text-emerald-600 mb-4">Invoice {invoice.invoice_number} has been marked as paid</p>
          <Button onClick={onClose}>Close</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Invoice Summary */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Invoice {invoice.invoice_number}</p>
              <p className="font-medium">{invoice.buyer?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${invoice.payable_amount?.toLocaleString()}</p>
              <p className="text-sm text-slate-500">{invoice.document_currency_code}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Tabs value={selectedGateway} onValueChange={setSelectedGateway}>
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(paymentGateways).map(([key, gw]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              <gw.icon className="w-4 h-4 mr-1" />{gw.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* PayNow */}
        <TabsContent value="paynow" className="mt-4">
          <Card className="border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-600" />PayNow QR Payment
              </CardTitle>
              <CardDescription>Scan with any Singapore bank app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-6 rounded-lg border text-center">
                <div className="w-48 h-48 mx-auto bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                  <QrCode className="w-32 h-32 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">Scan to pay ${invoice.payable_amount?.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Input value={manualRef} onChange={(e) => setManualRef(e.target.value)} placeholder="Enter payment reference after transfer" />
                <Button onClick={handleManualPayment} disabled={processing}>
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stripe */}
        <TabsContent value="stripe" className="mt-4">
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />Card Payment
              </CardTitle>
              <CardDescription>Pay securely with credit or debit card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Card Number</Label>
                  <Input placeholder="4242 4242 4242 4242" />
                </div>
                <div className="space-y-2">
                  <Label>Expiry</Label>
                  <Input placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label>CVC</Label>
                  <Input placeholder="123" type="password" />
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => simulatePayment('stripe')} disabled={processing}>
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : <>Pay ${invoice.payable_amount?.toLocaleString()}</>}
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield className="w-3 h-3" />Secured by Stripe
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PayPal */}
        <TabsContent value="paypal" className="mt-4">
          <Card className="border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />PayPal
              </CardTitle>
              <CardDescription>Pay with your PayPal account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white" onClick={() => simulatePayment('paypal')} disabled={processing}>
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Connecting...</> : <>Pay with PayPal</>}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Transfer */}
        <TabsContent value="bank" className="mt-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-600" />Bank Transfer
              </CardTitle>
              <CardDescription>Transfer directly to our bank account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Bank:</span><span className="font-medium">DBS Bank</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Account Name:</span><span className="font-medium">{invoice.seller?.name}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Account No:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">123-456789-0</span>
                    <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => { navigator.clipboard.writeText('1234567890'); toast.success('Copied'); }}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between"><span className="text-slate-500">Reference:</span><span className="font-mono">{invoice.invoice_number}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Amount:</span><span className="font-bold">${invoice.payable_amount?.toLocaleString()}</span></div>
              </div>
              <div className="flex gap-2">
                <Input value={manualRef} onChange={(e) => setManualRef(e.target.value)} placeholder="Enter bank transfer reference" />
                <Button onClick={handleManualPayment} disabled={processing || !manualRef}>Confirm Payment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}