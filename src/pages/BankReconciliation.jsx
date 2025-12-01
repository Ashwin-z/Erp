import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Link2, Upload, Search, Filter, CheckCircle2, XCircle,
  ArrowRight, Sparkles, Building2, RefreshCw
} from 'lucide-react';
import SmartReconciliation from '@/components/finance/SmartReconciliation';

const bankTransactions = [
  { id: 1, date: '2024-12-18', desc: 'TRF - TECHSTART PTE LTD', amount: 4500, type: 'credit', status: 'matched', matchTo: 'INV-2024-0892', confidence: 98 },
  { id: 2, date: '2024-12-17', desc: 'PYMT - MARINA FOODS PTE LTD', amount: 8450, type: 'credit', status: 'suggested', matchTo: 'INV-2024-0891', confidence: 95 },
  { id: 3, date: '2024-12-17', desc: 'AWS SINGAPORE', amount: 2450, type: 'debit', status: 'suggested', matchTo: 'AP-2024-0156', confidence: 92 },
  { id: 4, date: '2024-12-16', desc: 'FAST TRANSFER REF 48291', amount: 12400, type: 'credit', status: 'unmatched', matchTo: null, confidence: 0 },
  { id: 5, date: '2024-12-15', desc: 'DBS BANK CHARGES', amount: 145, type: 'debit', status: 'matched', matchTo: 'Auto-expense', confidence: 99 },
  { id: 6, date: '2024-12-14', desc: 'POPULAR BOOKSTORE', amount: 345, type: 'debit', status: 'matched', matchTo: 'AP-2024-0154', confidence: 96 },
  { id: 7, date: '2024-12-13', desc: 'TRF - CAPITALAND COMMERCIAL', amount: 24500, type: 'credit', status: 'matched', matchTo: 'INV-2024-0887', confidence: 98 },
  { id: 8, date: '2024-12-12', desc: 'GIRO - MARINA BAY SUITES', amount: 8500, type: 'debit', status: 'matched', matchTo: 'AP-2024-0151', confidence: 100 },
  { id: 9, date: '2024-12-11', desc: 'PAYNOW - DBS CORPORATE', amount: 18200, type: 'credit', status: 'suggested', matchTo: 'INV-2024-0886', confidence: 88 },
  { id: 10, date: '2024-12-10', desc: 'SINGTEL ENTERPRISE', amount: 589, type: 'debit', status: 'matched', matchTo: 'AP-2024-0153', confidence: 100 },
];

const statusConfig = {
  matched: { label: 'Matched', color: 'bg-emerald-100 text-emerald-700' },
  suggested: { label: 'AI Suggested', color: 'bg-violet-100 text-violet-700' },
  unmatched: { label: 'Unmatched', color: 'bg-slate-100 text-slate-600' },
};

export default function BankReconciliation() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");

  const matchedCount = bankTransactions.filter(t => t.status === 'matched').length;
  const suggestedCount = bankTransactions.filter(t => t.status === 'suggested').length;
  const unmatchedCount = bankTransactions.filter(t => t.status === 'unmatched').length;

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
                  <Link2 className="w-7 h-7 text-emerald-600" />
                  Bank Reconciliation
                </h1>
                <p className="text-slate-500 text-sm">AI-powered transaction matching and reconciliation</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Sync Banks</Button>
                <Button variant="outline"><Upload className="w-4 h-4 mr-2" />Upload Statement</Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <p className="text-sm text-slate-500 mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-slate-900">{bankTransactions.length}</p>
                  <p className="text-xs text-slate-400 mt-1">This period</p>
                </CardContent>
              </Card>
              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-5">
                  <p className="text-sm text-emerald-600 mb-1">Matched</p>
                  <p className="text-2xl font-bold text-emerald-700">{matchedCount}</p>
                  <Progress value={(matchedCount / bankTransactions.length) * 100} className="mt-2 h-2" />
                </CardContent>
              </Card>
              <Card className="border-violet-200 bg-violet-50">
                <CardContent className="p-5">
                  <p className="text-sm text-violet-600 mb-1">AI Suggestions</p>
                  <p className="text-2xl font-bold text-violet-700">{suggestedCount}</p>
                  <p className="text-xs text-violet-500 mt-1">Ready for review</p>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="p-5">
                  <p className="text-sm text-slate-500 mb-1">Auto-Match Rate</p>
                  <p className="text-2xl font-bold text-slate-900">95%</p>
                  <p className="text-xs text-emerald-500 mt-1">+3% vs last month</p>
                </CardContent>
              </Card>
            </div>

            {/* AI Suggestions Banner */}
            {suggestedCount > 0 && (
              <div className="mb-6">
                <SmartReconciliation />
              </div>
            )}

            {/* Transactions */}
            <Card className="border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Bank Transactions</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input placeholder="Search transactions..." className="pl-9 w-64" />
                    </div>
                    <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {bankTransactions.map((txn) => {
                  const status = statusConfig[txn.status];
                  return (
                    <motion.div 
                      key={txn.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border ${
                        txn.status === 'suggested' ? 'border-violet-200 bg-violet-50/50' : 'border-slate-200 bg-white'
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-slate-500" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-medium text-slate-900">{txn.desc}</p>
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                          <p className="text-sm text-slate-500">{txn.date}</p>
                        </div>

                        <div className={`text-lg font-bold ${txn.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {txn.type === 'credit' ? '+' : '-'}S${txn.amount.toLocaleString()}
                        </div>

                        {txn.matchTo && (
                          <>
                            <ArrowRight className="w-5 h-5 text-slate-300" />
                            <div className="min-w-[140px]">
                              <p className="font-medium text-slate-900 text-sm">{txn.matchTo}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={txn.confidence} className="w-16 h-1.5" />
                                <span className="text-xs text-slate-500">{txn.confidence}%</span>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="flex gap-2">
                          {txn.status === 'suggested' && (
                            <>
                              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8">
                                <CheckCircle2 className="w-4 h-4 mr-1" />Apply
                              </Button>
                              <Button size="sm" variant="outline" className="h-8">
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {txn.status === 'unmatched' && (
                            <Button size="sm" variant="outline" className="h-8">Match Manually</Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}