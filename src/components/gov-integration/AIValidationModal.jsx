import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, CheckCircle2, AlertTriangle, XCircle, Loader2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIValidationModal({ open, onClose, type, data, onProceed }) {
  const [status, setStatus] = useState('idle'); // idle, analyzing, success, error
  const [issues, setIssues] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open && status === 'idle') {
      runAnalysis();
    }
  }, [open]);

  const runAnalysis = () => {
    setStatus('analyzing');
    setProgress(0);
    setIssues([]);

    // Simulate AI Analysis Progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate Completion
    setTimeout(() => {
      clearInterval(interval);
      const mockIssues = generateMockIssues(type);
      setIssues(mockIssues);
      setStatus(mockIssues.length > 0 ? 'error' : 'success');
    }, 3500);
  };

  const generateMockIssues = (type) => {
    // 30% chance of issues for simulation
    if (Math.random() > 0.7) return [];

    switch (type) {
      case 'iras':
        return [
          { severity: 'high', field: 'GST Registration', message: 'GST No. mismatch with UEN record.' },
          { severity: 'medium', field: 'Input Tax', message: 'High input tax claimed compared to historical average.' }
        ];
      case 'cpf':
        return [
          { severity: 'high', field: 'Employee Contribution', message: 'Calculated contribution for Employee #451 differs from statutory rate.' }
        ];
      case 'acra':
        return [
          { severity: 'low', field: 'Address', message: 'Registered address format may not match ACRA standard.' }
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-600" />
            AI Pre-Submission Validator
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {status === 'analyzing' && (
            <div className="space-y-4 text-center">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
                <Brain className="absolute inset-0 m-auto w-8 h-8 text-violet-600 animate-pulse" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Analyzing Submission Data...</p>
                <p className="text-sm text-slate-500">Cross-referencing with {type.toUpperCase()} regulations</p>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-violet-600 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900">Validation Passed</h3>
                <p className="text-sm text-slate-500">No compliance issues detected. Ready to submit.</p>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Potential Issues Detected</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {issues.map((issue, idx) => (
                  <Alert key={idx} variant={issue.severity === 'high' ? "destructive" : "default"} className="border-l-4">
                    {issue.severity === 'high' ? <XCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <AlertTitle className="text-sm font-semibold">{issue.field}</AlertTitle>
                    <AlertDescription className="text-xs">
                      {issue.message}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {status === 'success' ? 'Close' : 'Cancel'}
          </Button>
          {status === 'error' && (
            <Button variant="secondary" onClick={runAnalysis}>
              Re-validate
            </Button>
          )}
          {(status === 'success' || (status === 'error' && issues.every(i => i.severity !== 'high'))) && (
            <Button 
              className="bg-violet-600 hover:bg-violet-700"
              onClick={onProceed}
            >
              Proceed to Submit <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}