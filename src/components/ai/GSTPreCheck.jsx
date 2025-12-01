import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, CheckCircle2, AlertTriangle, XCircle, 
  FileText, ArrowRight, RefreshCw, Shield
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const gstChecks = [
  { id: 1, name: 'Input Tax Validation', status: 'pass', description: 'All input tax claims verified against valid invoices' },
  { id: 2, name: 'Output Tax Calculation', status: 'pass', description: 'Output tax correctly calculated at 9% rate' },
  { id: 3, name: 'Missing Invoice Detection', status: 'warning', description: '3 invoices missing GST registration numbers', count: 3 },
  { id: 4, name: 'Rate Verification', status: 'pass', description: 'All transactions using correct GST rates' },
  { id: 5, name: 'Zero-Rated Exports', status: 'pass', description: 'Export documentation complete for zero-rated supplies' },
  { id: 6, name: 'Exempt Supplies Classification', status: 'warning', description: '1 transaction may be incorrectly classified', count: 1 },
  { id: 7, name: 'Bad Debt Relief', status: 'pass', description: 'No bad debt relief claims in this period' },
  { id: 8, name: 'Reverse Charge Compliance', status: 'pass', description: 'Imported services correctly accounted for' },
];

const statusConfig = {
  pass: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Passed' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Attention' },
  fail: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Failed' },
};

export default function GSTPreCheck() {
  const passedChecks = gstChecks.filter(c => c.status === 'pass').length;
  const warningChecks = gstChecks.filter(c => c.status === 'warning').length;
  const failedChecks = gstChecks.filter(c => c.status === 'fail').length;
  const readinessScore = Math.round((passedChecks / gstChecks.length) * 100);

  return (
    <TooltipProvider>
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              GST Filing Pre-Check
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-700">Q4 2024</Badge>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-run Check
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Readiness Score */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Filing Readiness Score</p>
                <p className="text-4xl font-bold text-blue-600">{readinessScore}%</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{passedChecks}</p>
                  <p className="text-xs text-slate-500">Passed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{warningChecks}</p>
                  <p className="text-xs text-slate-500">Warnings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{failedChecks}</p>
                  <p className="text-xs text-slate-500">Failed</p>
                </div>
              </div>
            </div>
            <Progress value={readinessScore} className="h-3" />
            <p className="text-sm text-slate-600 mt-3">
              {warningChecks > 0 
                ? `Resolve ${warningChecks} warning(s) to achieve 100% readiness`
                : 'Your GST filing is ready for submission'}
            </p>
          </div>

          {/* Check Items */}
          <div className="space-y-3">
            {gstChecks.map((check, index) => {
              const status = statusConfig[check.status];
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl ${status.bg} border border-slate-100`}
                >
                  <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{check.name}</span>
                      {check.count && (
                        <Badge variant="outline" className="text-xs">
                          {check.count} item(s)
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{check.description}</p>
                  </div>

                  {check.status === 'warning' && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline">
                          Review
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Click to review and fix issues</TooltipContent>
                    </Tooltip>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* IRAS Compliance */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-slate-900">IRAS Compliance Status</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-xs text-slate-500">Due Date</p>
                <p className="font-semibold text-slate-900">31 Jan 2025</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-xs text-slate-500">Output Tax</p>
                <p className="font-semibold text-slate-900">$12,450.00</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-xs text-slate-500">Input Tax</p>
                <p className="font-semibold text-slate-900">$8,920.00</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-3">
              Net GST Payable: <span className="font-bold text-slate-900">$3,530.00</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}