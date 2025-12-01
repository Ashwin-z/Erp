import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  User, CreditCard, BarChart3, Settings, Link2, 
  Crown, Check, Calendar, Download, FileText, 
  TrendingUp, Zap, Shield, Bell, Eye, EyeOff,
  GripVertical, Plus, X, Sparkles, ChevronRight
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const defaultWidgets = [
  { id: 'plan', label: 'Current Plan', icon: Crown, visible: true },
  { id: 'usage', label: 'Usage Statistics', icon: BarChart3, visible: true },
  { id: 'billing', label: 'Billing History', icon: CreditCard, visible: true },
  { id: 'quicklinks', label: 'Quick Links', icon: Link2, visible: true },
  { id: 'activity', label: 'Recent Activity', icon: FileText, visible: true },
  { id: 'ai', label: 'AI Insights', icon: Sparkles, visible: true }
];

const quickLinksOptions = [
  { label: 'Dashboard', page: 'Dashboard', icon: 'BarChart3' },
  { label: 'Invoices', page: 'AccountsReceivable', icon: 'FileText' },
  { label: 'Bank Rec', page: 'BankReconciliation', icon: 'Link2' },
  { label: 'GST Reports', page: 'GSTReports', icon: 'Shield' },
  { label: 'AI Insights', page: 'AIInsights', icon: 'Sparkles' },
  { label: 'Settings', page: 'Settings', icon: 'Settings' }
];

export default function UserDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [widgets, setWidgets] = useState(defaultWidgets);
  const [showCustomize, setShowCustomize] = useState(false);
  const [user, setUser] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: settings } = useQuery({
    queryKey: ['dashboardSettings', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserDashboardSettings.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return base44.entities.UserDashboardSettings.update(settings.id, data);
      }
      return base44.entities.UserDashboardSettings.create({ ...data, user_email: user.email });
    },
    onSuccess: () => queryClient.invalidateQueries(['dashboardSettings'])
  });

  useEffect(() => {
    if (settings?.visible_widgets) {
      setWidgets(prev => prev.map(w => ({
        ...w,
        visible: settings.visible_widgets.includes(w.id)
      })));
    }
  }, [settings]);

  const toggleWidget = (id) => {
    const updated = widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
    setWidgets(updated);
    saveMutation.mutate({ visible_widgets: updated.filter(w => w.visible).map(w => w.id) });
  };

  // Mock data
  const planData = {
    name: 'Growth',
    price: 199,
    period: 'month',
    features: ['50 Clients', 'AI Reconciliation', 'GST Reports', 'Priority Support'],
    usage: { clients: 32, limit: 50, transactions: 4520, aiCalls: 156 },
    nextBilling: '2025-01-15'
  };

  const billingHistory = [
    { date: '2024-12-01', amount: 199, status: 'paid', invoice: 'INV-2024-012' },
    { date: '2024-11-01', amount: 199, status: 'paid', invoice: 'INV-2024-011' },
    { date: '2024-10-01', amount: 199, status: 'paid', invoice: 'INV-2024-010' }
  ];

  const recentActivity = [
    { action: 'Invoice created', detail: 'INV-2024-156', time: '2 hours ago' },
    { action: 'Bank reconciled', detail: '15 transactions matched', time: '5 hours ago' },
    { action: 'GST Report generated', detail: 'Q4 2024', time: '1 day ago' },
    { action: 'Client added', detail: 'TechStart Pte Ltd', time: '2 days ago' }
  ];

  const renderWidget = (widget) => {
    if (!widget.visible) return null;

    switch (widget.id) {
      case 'plan':
        return (
          <Card key={widget.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  Current Plan
                </CardTitle>
                <Badge className="bg-lime-100 text-lime-700">{planData.name}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">${planData.price}</span>
                <span className="text-slate-500">/{planData.period}</span>
              </div>
              <div className="space-y-2 mb-4">
                {planData.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-lime-500" />
                    {f}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Next billing</span>
                <span className="font-medium">{planData.nextBilling}</span>
              </div>
              <Button variant="outline" className="w-full mt-4">Upgrade Plan</Button>
            </CardContent>
          </Card>
        );

      case 'usage':
        return (
          <Card key={widget.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Clients</span>
                  <span className="font-medium">{planData.usage.clients}/{planData.usage.limit}</span>
                </div>
                <Progress value={(planData.usage.clients / planData.usage.limit) * 100} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-slate-900">{planData.usage.transactions.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Transactions</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-slate-900">{planData.usage.aiCalls}</p>
                  <p className="text-xs text-slate-500">AI Calls</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'billing':
        return (
          <Card key={widget.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-500" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {billingHistory.map((bill, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{bill.invoice}</p>
                      <p className="text-xs text-slate-500">{bill.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        {bill.status}
                      </Badge>
                      <span className="font-medium">${bill.amount}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'quicklinks':
        return (
          <Card key={widget.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Link2 className="w-5 h-5 text-emerald-500" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {(settings?.quick_links || quickLinksOptions.slice(0, 4)).map((link, i) => (
                  <Link 
                    key={i}
                    to={createPageUrl(link.page)}
                    className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <Zap className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'activity':
        return (
          <Card key={widget.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-lime-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-slate-500">{item.detail}</p>
                    </div>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'ai':
        return (
          <Card key={widget.id} className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-lime-400" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm mb-4">
                Based on your usage patterns, here are personalized recommendations:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-lime-400" />
                  <span>3 invoices ready for auto-reconciliation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-lime-400" />
                  <span>Q4 GST report due in 15 days</span>
                </div>
              </div>
              <Link to={createPageUrl('AIInsights')}>
                <Button className="w-full mt-4 bg-lime-500 hover:bg-lime-400 text-slate-900">
                  View All Insights
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Welcome back, {user?.full_name || 'User'}
                  </h1>
                  <p className="text-slate-500">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowCustomize(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Customize Dashboard
              </Button>
            </div>

            {/* Widgets Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {widgets.map(renderWidget)}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Customize Dialog */}
      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize Dashboard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-slate-500">Choose which widgets to display:</p>
            {widgets.map(widget => (
              <div key={widget.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <widget.icon className="w-5 h-5 text-slate-600" />
                  <span className="font-medium">{widget.label}</span>
                </div>
                <Switch 
                  checked={widget.visible}
                  onCheckedChange={() => toggleWidget(widget.id)}
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}