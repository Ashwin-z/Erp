import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  LayoutDashboard, FileText, PieChart, Settings, 
  TrendingUp, Wallet, CreditCard, ArrowLeftRight,
  Building2, Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from '@/components/shared/PageHeader';

import GeneralLedgerView from '@/components/finance/GeneralLedgerView';
import JournalManager from '@/components/finance/JournalManager';
import FinancialReports from '@/components/finance/FinancialReports';
import FinanceSetup from '@/components/finance/FinanceSetup';
import AIFinancialAnalyst from '@/components/finance/AIFinancialAnalyst';
import SmartReconciliation from '@/components/finance/SmartReconciliation';
import APInvoiceProcessor from '@/components/finance/APInvoiceProcessor';
import CollectionsAutomation from '@/components/finance/CollectionsAutomation';
import IntercompanyRecon from '@/components/finance/IntercompanyRecon';
import IFRSReporter from '@/components/finance/IFRSReporter';
import AssetLeaseManager from '@/components/finance/AssetLeaseManager';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <PageHeader 
        title="Finance & Accounting" 
        subtitle="Global Financial Management & IFRS Reporting"
        icon={Wallet}
        iconColor="text-emerald-600"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-4xl bg-white shadow-sm border">
          <TabsTrigger value="dashboard" className="gap-2">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="journals" className="gap-2">
            <FileText className="w-4 h-4" /> Journals
          </TabsTrigger>
          <TabsTrigger value="gl" className="gap-2">
            <Building2 className="w-4 h-4" /> General Ledger
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <PieChart className="w-4 h-4" /> Reporting
          </TabsTrigger>
          <TabsTrigger value="setup" className="gap-2">
            <Settings className="w-4 h-4" /> Setup & CoA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="text-slate-500 text-sm font-medium mb-2">Cash Position</h3>
                            <div className="text-3xl font-bold text-slate-900">$1,240,500</div>
                            <div className="flex items-center text-emerald-600 text-sm mt-1">
                                <TrendingUp className="w-4 h-4 mr-1" /> +4.5% vs last month
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="text-slate-500 text-sm font-medium mb-2">Receivables</h3>
                            <div className="text-3xl font-bold text-slate-900">$342,100</div>
                            <div className="text-sm text-slate-400 mt-1">12 invoices overdue</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border shadow-sm">
                            <h3 className="text-slate-500 text-sm font-medium mb-2">Payables</h3>
                            <div className="text-3xl font-bold text-slate-900">$128,400</div>
                            <div className="text-sm text-slate-400 mt-1">Next run in 3 days</div>
                        </div>
                        </div>
                        <SmartReconciliation />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <APInvoiceProcessor />
                            <CollectionsAutomation />
                        </div>
                        <IntercompanyRecon />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <AIFinancialAnalyst />
                    <AssetLeaseManager />
                </div>
            </div>
        </TabsContent>

        <TabsContent value="journals">
            <JournalManager />
        </TabsContent>

        <TabsContent value="gl">
            <GeneralLedgerView />
        </TabsContent>

        <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <IFRSReporter />
                </div>
                <div className="lg:col-span-1">
                    <FinancialReports />
                </div>
            </div>
        </TabsContent>
        
        <TabsContent value="setup">
            <FinanceSetup />
        </TabsContent>
      </Tabs>
    </div>
  );
}