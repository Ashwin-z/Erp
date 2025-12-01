import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, RefreshCw, ArrowRightLeft, 
  FileText, Wand2, AlertCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function SmartReconciliation() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [matches, setMatches] = useState([]);

  const runSmartMatch = () => {
    setScanning(true);
    setProgress(0);
    
    // Simulation of AI matching process
    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setScanning(false);
                setMatches([
                    { id: 1, bank_desc: "TRF 482930 STRIPE", amount: 450.00, sys_ref: "INV-2024-001", confidence: 98, status: 'matched', notes: 'Perfect match on Ref ID' },
                    { id: 2, bank_desc: "AMZN WEB SVCS", amount: 129.99, sys_ref: "EXP-992", confidence: 92, status: 'matched', notes: 'Matched via Recurring Pattern' },
                    { id: 3, bank_desc: "CHECK DEP 402", amount: 2500.00, sys_ref: "PAY-442", confidence: 85, status: 'suggested', notes: 'Amount match, verify payer' },
                    { id: 4, bank_desc: "Unknown Transfer", amount: 50.00, sys_ref: null, confidence: 12, status: 'unmatched', notes: 'No matching invoice found' },
                ]);
                toast.success("AI Matching Complete: 3 matches found");
                return 100;
            }
            return prev + 20;
        });
    }, 400);
  };

  const handleCorrection = (id, newStatus) => {
      toast.promise(
          new Promise(resolve => setTimeout(resolve, 1500)),
          {
              loading: 'Learning from your feedback...',
              success: 'Model Updated! Similar transactions will auto-match next time.',
              error: 'Error updating model'
          }
      );
      setMatches(matches.map(m => m.id === id ? { ...m, status: 'matched', confidence: 100 } : m));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Smart Bank Reconciliation</CardTitle>
        <Button onClick={runSmartMatch} disabled={scanning} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            {scanning ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
            {scanning ? 'AI Matching...' : 'Auto-Match'}
        </Button>
      </CardHeader>
      <CardContent>
        {scanning && (
            <div className="mb-4 space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                    <span>Analyzing descriptions...</span>
                    <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1" />
            </div>
        )}

        {!scanning && matches.length === 0 && (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                <ArrowRightLeft className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Import bank statement to start reconciliation</p>
            </div>
        )}

        {!scanning && matches.length > 0 && (
            <div className="space-y-2">
                {matches.map(match => (
                    <div key={match.id} className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-full ${
                                match.status === 'matched' ? 'bg-emerald-100 text-emerald-600' : 
                                match.status === 'suggested' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                            }`}>
                                {match.status === 'matched' ? <CheckCircle2 className="w-4 h-4" /> : 
                                 match.status === 'suggested' ? <AlertCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            </div>
                            <div>
                                <div className="font-medium text-sm text-slate-900">{match.bank_desc}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                    <span className="font-mono">${match.amount.toFixed(2)}</span>
                                    {match.sys_ref && <span>• Matched to {match.sys_ref}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className={
                                match.confidence > 90 ? "text-emerald-600 bg-emerald-50" : 
                                match.confidence > 70 ? "text-amber-600 bg-amber-50" : "text-slate-500"
                            }>
                                {match.confidence}% Match
                            </Badge>
                            {match.status !== 'matched' && (
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                    onClick={() => handleCorrection(match.id)}
                                >
                                    Correct & Match
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}