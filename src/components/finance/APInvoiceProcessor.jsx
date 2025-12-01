import React, { useState } from 'react';
import { 
  Scan, FileCheck, ArrowRight, Receipt, CheckCircle2, AlertTriangle, Loader2 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function APInvoiceProcessor() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [invoices, setInvoices] = useState([]);

  const handleProcess = () => {
    setProcessing(true);
    setProgress(0);
    
    // Simulate AI OCR and PO Matching
    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setProcessing(false);
                setInvoices([
                    { id: 'INV-001', vendor: 'Office Depot', amount: 1250.00, po_match: 'PO-9921', confidence: 99, status: 'Matched' },
                    { id: 'INV-002', vendor: 'AWS Services', amount: 450.20, po_match: null, confidence: 85, status: 'No PO' },
                    { id: 'INV-003', vendor: 'Logistics Co', amount: 3200.00, po_match: 'PO-9925', confidence: 92, status: 'Variance' },
                ]);
                toast.success("Processed 3 invoices");
                return 100;
            }
            return prev + 15;
        });
    }, 500);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Scan className="w-5 h-5 text-indigo-600" /> AP Automation
                </CardTitle>
                <CardDescription>OCR Invoice Processing & PO Matching</CardDescription>
            </div>
            <Button onClick={handleProcess} disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Receipt className="w-4 h-4 mr-2" />}
                Scan Pending
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {processing && (
            <div className="mb-6 space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                    <span>AI extracting data & matching POs...</span>
                    <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>
        )}

        <div className="space-y-3">
            {invoices.length === 0 && !processing && (
                <div className="text-center py-12 text-slate-400 border-2 border-dashed rounded-lg">
                    <FileCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No pending invoices to process</p>
                </div>
            )}

            {invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${
                            inv.status === 'Matched' ? 'bg-emerald-100 text-emerald-600' :
                            inv.status === 'Variance' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                            {inv.status === 'Matched' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        </div>
                        <div>
                            <h4 className="font-medium text-slate-900">{inv.vendor}</h4>
                            <div className="text-xs text-slate-500 flex gap-2 mt-0.5">
                                <span>{inv.id}</span>
                                {inv.po_match && <span className="text-indigo-600">• Matched to {inv.po_match}</span>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-bold text-slate-900">${inv.amount.toFixed(2)}</div>
                            <div className="text-[10px] text-slate-400">Confidence: {inv.confidence}%</div>
                        </div>
                        <Badge variant={inv.status === 'Matched' ? 'default' : 'secondary'} className={
                            inv.status === 'Matched' ? 'bg-emerald-600' : 'bg-slate-200 text-slate-700'
                        }>
                            {inv.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}