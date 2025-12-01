import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Link2, ArrowLeft, Plus, Settings, Activity, CheckCircle2, XCircle,
  AlertTriangle, Eye, EyeOff, Copy, RefreshCw, Play, Clock, Building2,
  Landmark, CreditCard, Server, Key, Webhook, FileText, TrendingUp,
  Zap, Shield, BarChart3
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PartnerOnboardingWizard from '@/components/rwa/PartnerOnboardingWizard';
import PartnerDashboard from '@/components/rwa/PartnerDashboard';
import { toast } from 'sonner';

const partners = [
  {
    id: 'psp-001',
    name: 'DBS PayLah! Business',
    type: 'psp',
    status: 'active',
    lastSync: '2024-11-27 14:30:00',
    apiVersion: 'v2.1',
    uptime: 99.98,
    txVolume: 1250000,
    txCount: 4523,
    errorRate: 0.02
  },
  {
    id: 'cust-001',
    name: 'Fireblocks Custody',
    type: 'custodian',
    status: 'active',
    lastSync: '2024-11-27 14:28:00',
    apiVersion: 'v3.0',
    uptime: 100,
    txVolume: 5000000,
    txCount: 156,
    errorRate: 0
  },
  {
    id: 'bank-001',
    name: 'OCBC Business Banking',
    type: 'bank',
    status: 'active',
    lastSync: '2024-11-27 14:25:00',
    apiVersion: 'v1.5',
    uptime: 99.95,
    txVolume: 890000,
    txCount: 2341,
    errorRate: 0.05
  },
  {
    id: 'fin-001',
    name: 'Funding Societies',
    type: 'fintech',
    status: 'degraded',
    lastSync: '2024-11-27 14:00:00',
    apiVersion: 'v2.0',
    uptime: 98.5,
    txVolume: 450000,
    txCount: 89,
    errorRate: 1.5
  }
];

const apiLogs = [
  { id: 1, partner: 'DBS PayLah!', endpoint: 'POST /payments/initiate', status: 200, duration: 245, timestamp: '14:30:15' },
  { id: 2, partner: 'Fireblocks', endpoint: 'GET /wallets/balance', status: 200, duration: 120, timestamp: '14:28:42' },
  { id: 3, partner: 'OCBC', endpoint: 'POST /transfers/domestic', status: 200, duration: 380, timestamp: '14:25:30' },
  { id: 4, partner: 'Funding Societies', endpoint: 'POST /loans/disburse', status: 500, duration: 5200, timestamp: '14:00:15' },
  { id: 5, partner: 'DBS PayLah!', endpoint: 'POST /payments/callback', status: 200, duration: 85, timestamp: '13:55:20' },
];

const partnerTypeConfig = {
  psp: { label: 'Payment Provider', icon: CreditCard, color: 'bg-blue-500' },
  custodian: { label: 'Custodian', icon: Shield, color: 'bg-violet-500' },
  bank: { label: 'Bank', icon: Landmark, color: 'bg-emerald-500' },
  fintech: { label: 'Fintech', icon: Zap, color: 'bg-amber-500' }
};

export default function RWAPartnerIntegrations() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [configModal, setConfigModal] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [simulateModal, setSimulateModal] = useState(null);
  const [onboardingWizard, setOnboardingWizard] = useState(false);
  const [partnerDashboard, setPartnerDashboard] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const runSimulation = () => {
    toast.success('Simulation started - check logs for results');
    setSimulateModal(null);
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link to={createPageUrl('RWADashboard')}>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                      <Link2 className="w-6 h-6 text-white" />
                    </div>
                    Partner Integrations
                  </h1>
                  <p className="text-slate-400 mt-1">Manage PSP, Bank, Custodian, and Fintech connections</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500" onClick={() => setOnboardingWizard(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Partner
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-400 text-sm">Active Partners</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{partners.filter(p => p.status === 'active').length}/{partners.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-400 text-sm">API Calls Today</span>
                  </div>
                  <p className="text-2xl font-bold text-white">12,456</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-lime-400" />
                    <span className="text-slate-400 text-sm">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-white">99.7%</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-violet-400" />
                    <span className="text-slate-400 text-sm">Avg Response</span>
                  </div>
                  <p className="text-2xl font-bold text-white">186ms</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="partners">
              <TabsList className="bg-slate-800/50 border-slate-700 mb-6">
                <TabsTrigger value="partners">
                  <Building2 className="w-4 h-4 mr-2" />
                  Partners
                </TabsTrigger>
                <TabsTrigger value="logs">
                  <FileText className="w-4 h-4 mr-2" />
                  API Logs
                </TabsTrigger>
                <TabsTrigger value="webhooks">
                  <Webhook className="w-4 h-4 mr-2" />
                  Webhooks
                </TabsTrigger>
                <TabsTrigger value="metrics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Metrics
                </TabsTrigger>
              </TabsList>

              {/* Partners Tab */}
              <TabsContent value="partners">
                <div className="grid md:grid-cols-2 gap-4">
                  {partners.map((partner, idx) => {
                    const typeInfo = partnerTypeConfig[partner.type];
                    const TypeIcon = typeInfo.icon;
                    return (
                      <motion.div
                        key={partner.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl ${typeInfo.color} bg-opacity-20 flex items-center justify-center`}>
                                  <TypeIcon className={`w-6 h-6 ${typeInfo.color.replace('bg-', 'text-')}`} />
                                </div>
                                <div>
                                  <p className="text-white font-medium">{partner.name}</p>
                                  <p className="text-slate-500 text-sm">{typeInfo.label} • {partner.apiVersion}</p>
                                </div>
                              </div>
                              <Badge className={
                                partner.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                partner.status === 'degraded' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-red-500/20 text-red-400'
                              }>
                                {partner.status === 'active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> :
                                 partner.status === 'degraded' ? <AlertTriangle className="w-3 h-3 mr-1" /> :
                                 <XCircle className="w-3 h-3 mr-1" />}
                                {partner.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-4">
                              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                <p className="text-slate-500 text-xs">Uptime</p>
                                <p className="text-white font-medium">{partner.uptime}%</p>
                              </div>
                              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                <p className="text-slate-500 text-xs">Volume</p>
                                <p className="text-white font-medium">${(partner.txVolume / 1000000).toFixed(1)}M</p>
                              </div>
                              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                <p className="text-slate-500 text-xs">Txns</p>
                                <p className="text-white font-medium">{partner.txCount.toLocaleString()}</p>
                              </div>
                              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                <p className="text-slate-500 text-xs">Errors</p>
                                <p className={`font-medium ${partner.errorRate > 1 ? 'text-red-400' : 'text-emerald-400'}`}>
                                  {partner.errorRate}%
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                              <span className="text-slate-500 text-xs">Last sync: {partner.lastSync}</span>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setPartnerDashboard(partner)}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  Dashboard
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setSimulateModal(partner)}>
                                  <Play className="w-4 h-4 mr-1" />
                                  Test
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setConfigModal(partner)}>
                                  <Settings className="w-4 h-4 mr-1" />
                                  Config
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* API Logs Tab */}
              <TabsContent value="logs">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Recent API Calls</CardTitle>
                      <Button variant="outline" size="sm" className="border-slate-700">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400">Time</TableHead>
                          <TableHead className="text-slate-400">Partner</TableHead>
                          <TableHead className="text-slate-400">Endpoint</TableHead>
                          <TableHead className="text-slate-400 text-center">Status</TableHead>
                          <TableHead className="text-slate-400 text-right">Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {apiLogs.map((log) => (
                          <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell className="text-slate-400 font-mono text-sm">{log.timestamp}</TableCell>
                            <TableCell className="text-white">{log.partner}</TableCell>
                            <TableCell className="text-cyan-400 font-mono text-sm">{log.endpoint}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={log.status === 200 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                                {log.status}
                              </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-mono ${log.duration > 1000 ? 'text-red-400' : 'text-slate-300'}`}>
                              {log.duration}ms
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Webhooks Tab */}
              <TabsContent value="webhooks">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Webhook Endpoints</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {['Payment Callback', 'Settlement Notification', 'KYC Status Update', 'Loan Disbursement'].map((webhook, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Webhook className="w-5 h-5 text-cyan-400" />
                          <div>
                            <p className="text-white font-medium">{webhook}</p>
                            <p className="text-slate-500 text-sm font-mono">https://api.arkfinex.com/webhooks/{webhook.toLowerCase().replace(/ /g, '-')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <Button variant="ghost" size="icon">
                            <Copy className="w-4 h-4 text-slate-400" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Metrics Tab */}
              <TabsContent value="metrics">
                <div className="grid md:grid-cols-2 gap-6">
                  {partners.map((partner) => (
                    <Card key={partner.id} className="bg-slate-900/50 border-slate-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg">{partner.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-400">Uptime</span>
                              <span className="text-emerald-400">{partner.uptime}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{ width: `${partner.uptime}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-400">Error Rate</span>
                              <span className={partner.errorRate > 1 ? 'text-red-400' : 'text-emerald-400'}>{partner.errorRate}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-red-500" style={{ width: `${partner.errorRate * 10}%` }} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                              <p className="text-slate-400 text-xs">Avg Latency</p>
                              <p className="text-white font-bold">{Math.floor(Math.random() * 200 + 100)}ms</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                              <p className="text-slate-400 text-xs">P99 Latency</p>
                              <p className="text-white font-bold">{Math.floor(Math.random() * 500 + 300)}ms</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Config Modal */}
            <Dialog open={!!configModal} onOpenChange={() => setConfigModal(null)}>
              <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-400" />
                    API Configuration - {configModal?.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        type={showApiKey ? 'text' : 'password'}
                        value="sk_live_abc123xyz789..."
                        className="bg-slate-800 border-slate-700 font-mono"
                        readOnly
                      />
                      <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard('sk_live_abc123xyz789')}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="password"
                        value="••••••••••••••••"
                        className="bg-slate-800 border-slate-700 font-mono"
                        readOnly
                      />
                      <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20">
                        Rotate
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input 
                      value="https://api.arkfinex.com/webhooks/partner-callback"
                      className="bg-slate-800 border-slate-700 font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                    <span className="text-slate-300">Enable Production Mode</span>
                    <Switch />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button variant="outline" className="border-slate-700" onClick={() => setConfigModal(null)}>Cancel</Button>
                  <Button className="bg-blue-500 hover:bg-blue-400">Save Configuration</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Partner Onboarding Wizard */}
            <PartnerOnboardingWizard 
              open={onboardingWizard} 
              onClose={() => setOnboardingWizard(false)}
              onComplete={(config) => toast.success(`Partner ${config.name} added successfully`)}
            />

            {/* Partner Dashboard Modal */}
            <PartnerDashboard 
              open={!!partnerDashboard}
              onClose={() => setPartnerDashboard(null)}
              partner={partnerDashboard}
            />

            {/* Simulate Modal */}
            <Dialog open={!!simulateModal} onOpenChange={() => setSimulateModal(null)}>
              <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-emerald-400" />
                    Simulate Transaction - {simulateModal?.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Transaction Type</Label>
                    <Select defaultValue="payment">
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="payment">Payment Initiation</SelectItem>
                        <SelectItem value="payout">Payout Request</SelectItem>
                        <SelectItem value="transfer">Bank Transfer</SelectItem>
                        <SelectItem value="balance">Balance Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (SGD)</Label>
                    <Input type="number" defaultValue="100.00" className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                      <p className="text-slate-400 text-sm">This is a sandbox simulation. No real funds will be moved.</p>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button variant="outline" className="border-slate-700" onClick={() => setSimulateModal(null)}>Cancel</Button>
                  <Button className="bg-emerald-500 hover:bg-emerald-400" onClick={runSimulation}>
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}