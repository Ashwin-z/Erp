import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Copy, CheckCircle2, XCircle, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function TransactionDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'txn_unknown';

  // Mock data based on ID
  const txn = {
    id: id,
    amount: "5,000.00",
    currency: "USD",
    status: "Success",
    date: new Date().toLocaleString(),
    method: "Stripe",
    customer: "john.doe@example.com",
    description: "Crowdfund Pledge: Solar Farm Ph1",
    fees: "145.00",
    net: "4,855.00"
  };

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Transaction Details</h1>
            <p className="text-slate-400 text-sm">ID: {txn.id}</p>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 mb-6">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">{txn.currency} {txn.amount}</h2>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 text-sm px-3 py-1">
              Payment Successful
            </Badge>
            <p className="text-slate-400 mt-4 text-sm">Completed on {txn.date}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400">Payment Method</span>
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {txn.method} Secure
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400">Customer</span>
              <span className="font-medium">{txn.customer}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400">Description</span>
              <span className="font-medium">{txn.description}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400">Gateway Reference</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-slate-300">ch_3Lh...2x9</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Gross Amount</span>
                <span>{txn.currency} {txn.amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Processing Fees</span>
                <span className="text-red-400">-{txn.currency} {txn.fees}</span>
              </div>
              <Separator className="bg-slate-800" />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Net Total</span>
                <span>{txn.currency} {txn.net}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" className="border-slate-700 text-slate-300 w-full">
            Email Receipt
          </Button>
          <Button variant="outline" className="border-slate-700 text-slate-300 w-full">
            <ExternalLink className="w-4 h-4 mr-2" /> View in Stripe
          </Button>
        </div>
      </div>
    </div>
  );
}