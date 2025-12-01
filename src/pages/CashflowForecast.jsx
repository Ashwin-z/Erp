import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/shared/PageHeader';
import DataCard from '@/components/shared/DataCard';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, AlertTriangle, DollarSign, Calendar, 
  ArrowUpRight, ArrowDownRight, Sparkles, Download, RefreshCw
} from 'lucide-react';

const forecastData = [
  { month: 'Dec 2024', inflow: 48500, outflow: 42800, net: 5700, runway: 87 },
  { month: 'Jan 2025', inflow: 52000, outflow: 45200, net: 6800, runway: 95 },
  { month: 'Feb 2025', inflow: 46800, outflow: 44100, net: 2700, runway: 78 },
  { month: 'Mar 2025', inflow: 55200, outflow: 48900, net: 6300, runway: 92 },
];

const alerts = [
  { type: 'warning', date: 'Jan 15', message: 'Projected low cash: $18,430', action: 'Review AR collections' },
  { type: 'info', date: 'Feb 1', message: 'Large payment due: $12,500', action: 'Ensure funds available' },
];

export default function CashflowForecast() {
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
              title="Cashflow Forecast"
              subtitle="AI-powered 90-day cash prediction"
              icon={TrendingUp}
              iconColor="text-emerald-600"
              actions={
                <>
                  <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
                  <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
                </>
              }
            />

            {/* Summary */}
            <div className="grid grid-cols-4 gap-4">
              <DataCard 
                label="Current Cash" 
                value="$248,520" 
                change="+8.3% vs last month" 
                trend="up" 
                icon={DollarSign} 
                iconBg="bg-emerald-500"
                tooltip="Total cash across all bank accounts"
              />
              <DataCard 
                label="Cash Runway" 
                value="87 days" 
                change="+12 days" 
                trend="up" 
                icon={Calendar} 
                iconBg="bg-blue-500"
                tooltip="Days of operation at current burn rate"
              />
              <DataCard 
                label="Projected Inflow" 
                value="$202,500" 
                sub="Next 90 days" 
                icon={ArrowUpRight} 
                iconBg="bg-lime-500"
                linkTo="AccountsReceivable"
                tooltip="Expected collections from AR"
              />
              <DataCard 
                label="Projected Outflow" 
                value="$181,000" 
                sub="Next 90 days" 
                icon={ArrowDownRight} 
                iconBg="bg-orange-500"
                linkTo="AccountsPayable"
                tooltip="Scheduled payments and expenses"
              />
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">AI Cashflow Alerts</h3>
                      <div className="mt-2 space-y-2">
                        {alerts.map((alert, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-slate-700"><strong>{alert.date}:</strong> {alert.message}</span>
                            <Link to={createPageUrl('AIInsights')}>
                              <Button size="sm" variant="ghost" className="text-amber-700 hover:text-amber-800">
                                {alert.action}
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Forecast Table */}
            <Card className="border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-500" />
                    90-Day Forecast
                  </CardTitle>
                  <Badge className="bg-violet-100 text-violet-700">AI Generated</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {forecastData.map((month, i) => (
                    <motion.div
                      key={month.month}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-slate-50 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <p className="font-semibold text-slate-900 mb-4">{month.month}</p>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Inflow</span>
                          <span className="text-sm font-medium text-emerald-600">+${month.inflow.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Outflow</span>
                          <span className="text-sm font-medium text-red-500">-${month.outflow.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between">
                          <span className="text-sm font-medium text-slate-700">Net</span>
                          <span className={`text-sm font-bold ${month.net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {month.net >= 0 ? '+' : ''}${month.net.toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-slate-500">Runway</span>
                            <span className="text-xs font-medium">{month.runway} days</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${month.runway > 60 ? 'bg-emerald-500' : month.runway > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(month.runway, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}