import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ReportGenerator from '@/components/ai/ReportGenerator';
import GSTPreCheck from '@/components/ai/GSTPreCheck';
import AdvancedAnalytics from '@/components/ai/AdvancedAnalytics';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Sparkles, TrendingUp, AlertTriangle, DollarSign, Shield,
  CheckCircle2, X, ArrowRight, Brain, Zap, Target, PieChart, FileText, BarChart3
} from 'lucide-react';

const recommendations = [
  { id: 1, type: 'cashflow_alert', priority: 'critical', title: 'Cash shortfall projected in 18 days', description: 'Based on current burn rate ($42,800/mo) and expected AR collections, projected shortfall of $12,430.', impact: 12430, action: 'View Forecast', status: 'pending' },
  { id: 2, type: 'collection', priority: 'high', title: 'Collect from Marina Foods Co.', description: 'Invoice INV-2024-0891 is 15 days overdue. Customer has 85% collection score based on history.', impact: 8450, action: 'Send Reminder', status: 'pending' },
  { id: 3, type: 'cost_saving', priority: 'medium', title: 'Duplicate subscription detected', description: 'Microsoft 365 and Google Workspace both active. Potential savings by consolidating.', impact: 890, action: 'Review', status: 'pending' },
  { id: 4, type: 'reconciliation', priority: 'medium', title: '3 transactions ready for auto-match', description: 'AI has identified matches with 95%+ confidence for bank transactions.', impact: 0, action: 'Apply All', status: 'pending' },
  { id: 5, type: 'compliance', priority: 'low', title: 'GST filing due in 45 days', description: 'Q4 2024 GST return preparation is 85% complete. 3 invoices need review.', impact: 0, action: 'Review GST', status: 'pending' },
];

const metrics = [
  { label: 'AI Actions Taken', value: '142', change: '+23 this week', icon: Zap },
  { label: 'Time Saved', value: '48 hrs', change: 'This month', icon: Target },
  { label: 'Cost Savings Identified', value: '$4,280', change: '+$890 this week', icon: DollarSign },
  { label: 'Accuracy Rate', value: '96.8%', change: '+0.3% vs last month', icon: PieChart },
];

const priorityConfig = {
  critical: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  high: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertTriangle },
  medium: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Sparkles },
  low: { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: CheckCircle2 },
};

const typeConfig = {
  cashflow_alert: { label: 'Cashflow', color: 'text-red-600', bg: 'bg-red-50' },
  collection: { label: 'Collection', color: 'text-amber-600', bg: 'bg-amber-50' },
  cost_saving: { label: 'Savings', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  reconciliation: { label: 'Reconciliation', color: 'text-violet-600', bg: 'bg-violet-50' },
  compliance: { label: 'Compliance', color: 'text-blue-600', bg: 'bg-blue-50' },
};

export default function AIInsights() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState("all");
  const [mainTab, setMainTab] = useState("recommendations");

  const filteredRecs = activeTab === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.type === activeTab);

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
                  <Brain className="w-7 h-7 text-violet-600" />
                  AI Insights & Recommendations
                </h1>
                <p className="text-slate-500 text-sm">Intelligent automation, reports, and actionable insights</p>
              </div>
              <Badge className="bg-violet-100 text-violet-700 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                {recommendations.filter(r => r.status === 'pending').length} Active Recommendations
              </Badge>
            </div>

            {/* Main Tabs */}
            <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
              <TabsList className="bg-white border border-slate-200 p-1">
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Reports
                </TabsTrigger>
                <TabsTrigger value="gst" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  GST Pre-Check
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analytics" className="mt-6">
                <AdvancedAnalytics />
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <ReportGenerator />
              </TabsContent>

              <TabsContent value="gst" className="mt-6">
                <GSTPreCheck />
              </TabsContent>

              <TabsContent value="recommendations" className="mt-6 space-y-6">

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-4">
              {metrics.map((metric, i) => (
                <Card key={i} className="border-slate-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">{metric.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                        <p className="text-xs text-emerald-600 mt-1">{metric.change}</p>
                      </div>
                      <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                        <metric.icon className="w-5 h-5 text-violet-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommendations */}
            <Card className="border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">AI Recommendations</CardTitle>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="cashflow_alert">Cashflow</TabsTrigger>
                      <TabsTrigger value="collection">Collection</TabsTrigger>
                      <TabsTrigger value="cost_saving">Savings</TabsTrigger>
                      <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredRecs.map((rec, index) => {
                  const priority = priorityConfig[rec.priority];
                  const type = typeConfig[rec.type];
                  return (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-5 rounded-xl border ${type.bg} border-slate-200`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          rec.priority === 'critical' ? 'bg-red-500' :
                          rec.priority === 'high' ? 'bg-amber-500' :
                          rec.priority === 'medium' ? 'bg-blue-500' : 'bg-slate-400'
                        }`}>
                          <priority.icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={priority.color}>{rec.priority}</Badge>
                            <Badge variant="outline" className={type.color}>{type.label}</Badge>
                          </div>
                          <h3 className="font-semibold text-slate-900 mb-1">{rec.title}</h3>
                          <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                          
                          <div className="flex items-center gap-4">
                            <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
                              {rec.action}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-slate-500">
                              Dismiss
                            </Button>
                            <Button size="sm" variant="ghost" className="text-slate-500">
                              Explain
                            </Button>
                            {rec.impact > 0 && (
                              <span className="text-sm text-slate-500 ml-auto">
                                Impact: <span className="font-semibold text-slate-900">${rec.impact.toLocaleString()}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* AI Performance */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    AI Cashflow Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center bg-slate-50 rounded-xl">
                    <p className="text-slate-400">Cashflow forecast chart</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    Anomaly Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="font-medium text-emerald-700">No anomalies detected</span>
                      </div>
                      <p className="text-sm text-emerald-600 mt-1">All transactions within normal patterns</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      Last scanned: 5 minutes ago • 1,247 transactions analyzed
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}