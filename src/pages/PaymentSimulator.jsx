import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, RefreshCw, CheckCircle2, AlertCircle, Wallet, ChevronLeft } from 'lucide-react';
import PaymentProcessor from '@/components/payments/PaymentProcessor';
import { toast } from 'sonner';

export default function PaymentSimulator() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([
    { id: 'txn_883920', amount: 1500, currency: 'USD', status: 'Success', method: 'stripe', date: '2 mins ago' },
    { id: 'txn_112039', amount: 240, currency: 'SGD', status: 'Success', method: 'paynow', date: '1 hour ago' },
  ]);

  const handlePaymentComplete = (result) => {
    const newTxn = {
      id: result.transactionId,
      amount: result.amount,
      currency: 'USD', // defaulting for demo
      status: result.status,
      method: result.method,
      date: 'Just now'
    };
    setHistory([newTxn, ...history]);
  };

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-emerald-400" />
              Payment Gateway Simulator
            </h1>
            <p className="text-slate-400">Test Transaction Processing & Ledger Updates</p>
          </div>
        </div>
        <Button className="bg-white text-slate-900 hover:bg-slate-100 font-medium border-0" onClick={() => setHistory([])}>
          <RefreshCw className="w-4 h-4 mr-2" /> Reset History
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Simulator */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Test Transaction</CardTitle>
              <CardDescription>Simulate a checkout flow for RWA or Crowdfunding</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentProcessor 
                amount={5000} 
                currency="USD" 
                context="Crowdfund Pledge: Solar Farm Ph1" 
                onComplete={handlePaymentComplete} 
              />
            </CardContent>
          </Card>

          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
             <h4 className="font-bold text-blue-200 mb-2 flex items-center gap-2">
               <Wallet className="w-4 h-4" /> Ledger Integration
             </h4>
             <p className="text-xs text-slate-300">
               Transactions are automatically hashed and recorded in the 'RevenueLedgerEntry' entity. 
               Reconciliation bot runs every 60 seconds.
             </p>
          </div>
        </div>

        {/* Live Log */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>Live Transaction Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">No recent transactions</p>
              ) : (
                history.map((txn, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg animate-in slide-in-from-top-2 fade-in cursor-pointer hover:bg-slate-900 transition-colors group"
                    onClick={() => navigate(createPageUrl('TransactionDetail') + `?id=${txn.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${txn.status === 'Success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        {txn.status === 'Success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-blue-400 transition-colors">{txn.id}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Badge variant="outline" className="h-5 border-slate-700 text-slate-400 capitalize">{txn.method}</Badge>
                          <span>{txn.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">+{txn.currency} {txn.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500 group-hover:text-white transition-colors">Captured</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}