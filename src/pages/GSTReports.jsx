import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, Download, FileText, CheckCircle2, AlertTriangle,
  Sparkles, ArrowUpRight, ArrowDownRight, Send, Eye
} from 'lucide-react';

const gstSummary = {
  period: 'Q4 2024',
  outputGst: 28500,
  inputGst: 12400,
  netPayable: 16100,
  status: 'draft'
};

const gstHistory = [
  { period: 'Q3 2024', outputGst: 24200, inputGst: 10800, net: 13400, status: 'submitted' },
  { period: 'Q2 2024', outputGst: 22800, inputGst: 9600, net: 13200, status: 'acknowledged' },
  { period: 'Q1 2024', outputGst: 19500, inputGst: 8200, net: 11300, status: 'acknowledged' },
];

const aiIssues = [
  { type: 'warning', message: '3 invoices missing GST registration numbers' },
  { type: 'info', message: 'Input GST claim for office supplies can be optimized by $420' },
];

export default function GSTReports() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1800px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Calculator className="w-7 h-7 text-indigo-600" />
                  GST Reports
                </h1>
                <p className="text-slate-500 text-sm">IRAS-compliant GST filing and management</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export F5</Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700"><Send className="w-4 h-4 mr-2" />Submit to IRAS</Button>
              </div>
            </div>

            {/* Current Period */}
            <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Current Period: {gstSummary.period}</CardTitle>
                  <Badge className="bg-amber-100 text-amber-700">Draft</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Output GST (Sales)</p>
                    <p className="text-3xl font-bold text-slate-900">${gstSummary.outputGst.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      <ArrowUpRight className="w-3 h-3 mr-1" />+17.8% vs Q3
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Input GST (Purchases)</p>
                    <p className="text-3xl font-bold text-slate-900">${gstSummary.inputGst.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                      <ArrowUpRight className="w-3 h-3 mr-1" />+14.8% vs Q3
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Net GST Payable</p>
                    <p className="text-3xl font-bold text-indigo-600">${gstSummary.netPayable.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Due: Jan 31, 2025</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-2">
                        <Progress value={85} className="h-20 w-20 rounded-full" />
                      </div>
                      <p className="text-sm font-medium">85% Complete</p>
                      <p className="text-xs text-slate-500">Review required</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Issues */}
            {aiIssues.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2">AI Validation Issues</h3>
                      <div className="space-y-2">
                        {aiIssues.map((issue, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {issue.type === 'warning' ? (
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-blue-500" />
                            )}
                            <span className="text-sm text-slate-700">{issue.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" className="bg-white">Review Issues</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* GST Breakdown */}
              <Card className="border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">GST Breakdown - {gstSummary.period}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-2">Box 1: Total Standard-Rated Supplies</p>
                    <p className="text-xl font-bold">$356,250.00</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-2">Box 2: Total Zero-Rated Supplies</p>
                    <p className="text-xl font-bold">$0.00</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 mb-2">Box 3: Total Exempt Supplies</p>
                    <p className="text-xl font-bold">$0.00</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                    <p className="text-sm text-indigo-600 mb-2">Box 6: Output Tax Due</p>
                    <p className="text-xl font-bold text-indigo-700">${gstSummary.outputGst.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <p className="text-sm text-emerald-600 mb-2">Box 7: Input Tax Claimable</p>
                    <p className="text-xl font-bold text-emerald-700">${gstSummary.inputGst.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* History */}
              <Card className="border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Filing History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {gstHistory.map((period) => (
                    <div key={period.period} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                      <div>
                        <p className="font-semibold text-slate-900">{period.period}</p>
                        <p className="text-sm text-slate-500">Net: ${period.net.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={
                          period.status === 'acknowledged' ? 'bg-emerald-100 text-emerald-700' :
                          period.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {period.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}