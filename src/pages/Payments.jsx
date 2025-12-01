import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/shared/PageHeader';
import DataCard from '@/components/shared/DataCard';
import DataRow from '@/components/shared/DataRow';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, Plus, Send, Clock, CheckCircle2, Calendar,
  Building2, ArrowRight, Download
} from 'lucide-react';

const scheduledPayments = [
  { id: 1, vendor: 'Amazon Web Services', amount: 2450, date: '2024-12-20', status: 'scheduled' },
  { id: 2, vendor: 'Microsoft 365', amount: 890, date: '2024-12-22', status: 'scheduled' },
  { id: 3, vendor: 'Office Supplies Co', amount: 345, date: '2024-12-25', status: 'pending_approval' },
];

const recentPayments = [
  { id: 1, vendor: 'Singtel', amount: 189, date: '2024-12-15', status: 'completed', ref: 'PAY-2024-0089' },
  { id: 2, vendor: 'DBS Bank Fees', amount: 45, date: '2024-12-14', status: 'completed', ref: 'PAY-2024-0088' },
  { id: 3, vendor: 'Rent - Office Space', amount: 3500, date: '2024-12-10', status: 'completed', ref: 'PAY-2024-0087' },
];

export default function Payments() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1800px] mx-auto space-y-6">
            
            <PageHeader
              title="Payments"
              subtitle="Manage payment schedules and processing"
              icon={CreditCard}
              iconColor="text-indigo-600"
              actions={
                <>
                  <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700"><Plus className="w-4 h-4 mr-2" />Schedule Payment</Button>
                </>
              }
            />

            {/* Summary */}
            <div className="grid grid-cols-4 gap-4">
              <DataCard label="Scheduled Payments" value="$3,685" sub="3 payments" icon={Calendar} iconBg="bg-blue-500" linkTo="AccountsPayable" tooltip="View all scheduled payments" />
              <DataCard label="Pending Approval" value="$345" sub="1 payment" icon={Clock} iconBg="bg-amber-500" linkTo="AccountsPayable" tooltip="Payments awaiting approval" />
              <DataCard label="Paid This Month" value="$18,450" sub="12 payments" icon={CheckCircle2} iconBg="bg-emerald-500" tooltip="Total payments completed" />
              <DataCard label="Next Payment" value="Dec 20" sub="AWS - $2,450" icon={Send} iconBg="bg-indigo-500" tooltip="Next scheduled payment date" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Scheduled */}
              <Card className="border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Scheduled Payments</CardTitle>
                    <Link to={createPageUrl('AccountsPayable')}>
                      <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {scheduledPayments.map((payment) => (
                    <DataRow
                      key={payment.id}
                      icon={Building2}
                      title={payment.vendor}
                      subtitle={`Due: ${payment.date}`}
                      amount={`$${payment.amount.toLocaleString()}`}
                      status={payment.status === 'scheduled' ? 'Scheduled' : 'Pending'}
                      statusColor={payment.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}
                      linkTo="AccountsPayable"
                      tooltip={`Click to view invoice details for ${payment.vendor}`}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Recent */}
              <Card className="border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Payments</CardTitle>
                    <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentPayments.map((payment) => (
                    <DataRow
                      key={payment.id}
                      icon={CheckCircle2}
                      title={payment.vendor}
                      subtitle={payment.ref}
                      amount={`$${payment.amount.toLocaleString()}`}
                      date={payment.date}
                      status="Completed"
                      statusColor="bg-emerald-100 text-emerald-700"
                      tooltip={`Payment ${payment.ref} completed on ${payment.date}`}
                    />
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