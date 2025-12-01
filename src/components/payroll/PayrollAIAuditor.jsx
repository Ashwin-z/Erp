import React, { useState } from 'react';
import { 
  ShieldCheck, AlertOctagon, History, Users, 
  TrendingUp, SearchCheck, CheckCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PayrollAIAuditor({ onAuditComplete }) {
  const [status, setStatus] = useState('idle'); // idle, auditing, complete
  const [progress, setProgress] = useState(0);
  const [issues, setIssues] = useState([]);

  const startAudit = () => {
    setStatus('auditing');
    setProgress(0);
    setIssues([]);

    // Simulation steps
    const steps = [
        { pct: 20, label: 'Analyzing Variance vs Last Month...' },
        { pct: 40, label: 'Checking Tax Compliance Rules...' },
        { pct: 60, label: 'Scanning for Ghost Employees...' },
        { pct: 80, label: 'Verifying Overtime Anomalies...' },
        { pct: 100, label: 'Audit Complete.' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
        if (stepIdx >= steps.length) {
            clearInterval(interval);
            setStatus('complete');
            setIssues([
                { type: 'warning', title: 'High Overtime Variance', desc: 'Employee EMP-004 has 400% higher overtime than their 3-month average.' },
                { type: 'critical', title: 'Missing Tax ID', desc: 'New hire EMP-022 is missing a Tax Identification Number.' }
            ]);
            if(onAuditComplete) onAuditComplete(false); // false = found issues
        } else {
            setProgress(steps[stepIdx].pct);
            stepIdx++;
        }
    }, 600);
  };

  return (
    <Card className="border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <CardTitle className="text-base">AI Payroll Auditor</CardTitle>
            </div>
            {status === 'idle' && (
                <Button size="sm" onClick={startAudit} className="bg-indigo-600 hover:bg-indigo-700">
                    <SearchCheck className="w-4 h-4 mr-2" /> Run Pre-Check
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        {status === 'auditing' && (
            <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-slate-500 text-center animate-pulse">
                    AI Engine is scanning payroll data...
                </p>
            </div>
        )}

        {status === 'complete' && (
            <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Audit Results</span>
                    <Button variant="ghost" size="sm" onClick={startAudit} className="h-6 text-xs">Re-run</Button>
                </div>
                
                {issues.length === 0 ? (
                    <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>All Clear</AlertTitle>
                        <AlertDescription>No anomalies detected. Safe to process.</AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-2">
                        {issues.map((issue, idx) => (
                            <Alert key={idx} variant={issue.type === 'critical' ? 'destructive' : 'default'} className={`
                                ${issue.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' : ''}
                                ${issue.type === 'critical' ? 'bg-red-50 border-red-200 text-red-800' : ''}
                            `}>
                                {issue.type === 'critical' ? <AlertOctagon className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <AlertTitle className="text-sm font-semibold">{issue.title}</AlertTitle>
                                <AlertDescription className="text-xs mt-1 opacity-90">
                                    {issue.desc}
                                </AlertDescription>
                            </Alert>
                        ))}
                    </div>
                )}
            </div>
        )}

        {status === 'idle' && (
            <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white p-2 rounded border text-center">
                    <Users className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    <div className="text-[10px] text-slate-500">Ghost Employees</div>
                </div>
                <div className="bg-white p-2 rounded border text-center">
                    <TrendingUp className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    <div className="text-[10px] text-slate-500">Variance Check</div>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}