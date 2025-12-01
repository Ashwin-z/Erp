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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  FileText, ArrowLeft, Plus, Download, Calendar as CalendarIcon, Clock,
  Mail, CheckCircle2, Play, Pause, Trash2, Edit, Eye, BarChart3,
  Users, Coins, Shield, TrendingUp, FileSpreadsheet, File, Layers, Send,
  RefreshCw, Filter, Search, Brain
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ReportBuilder from '@/components/rwa/ReportBuilder';
import { toast } from 'sonner';
import { format } from 'date-fns';

const reportTemplates = [
  { id: 'rwa-activity', name: 'RWA Activity Report', icon: Coins, description: 'RVU minting, validation, and status summary', category: 'activity' },
  { id: 'distribution', name: 'Reward Distribution Report', icon: TrendingUp, description: 'Pool allocations and payout details', category: 'distribution' },
  { id: 'membership', name: 'Membership Status Report', icon: Users, description: 'Tier breakdown, KYC status, renewals', category: 'membership' },
  { id: 'compliance', name: 'Compliance Metrics Report', icon: Shield, description: 'Audit logs, fraud flags, regulatory status', category: 'compliance' },
  { id: 'wallet', name: 'Wallet Transaction Report', icon: BarChart3, description: 'Balances, transfers, payouts summary', category: 'wallet' },
  { id: 'ai-performance', name: 'AI Performance Report', icon: Brain, description: 'Model accuracy, predictions, A/B test results', category: 'ai' },
];

const deliveryMethods = [
  { id: 'email', label: 'Email', icon: Mail, description: 'Send to specified recipients' },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'View in reports dashboard' },
  { id: 'webhook', label: 'Webhook', icon: Send, description: 'POST to external endpoint' },
  { id: 'storage', label: 'Cloud Storage', icon: FileSpreadsheet, description: 'Save to connected storage' }
];

const scheduledReports = [
  { id: 1, name: 'Monthly RWA Summary', template: 'rwa-activity', frequency: 'monthly', nextRun: '2024-12-01 09:00', recipients: ['cfo@company.com', 'finance@company.com'], status: 'active', format: 'pdf' },
  { id: 2, name: 'Weekly Distribution Report', template: 'distribution', frequency: 'weekly', nextRun: '2024-12-02 08:00', recipients: ['admin@company.com'], status: 'active', format: 'csv' },
  { id: 3, name: 'Daily Compliance Check', template: 'compliance', frequency: 'daily', nextRun: '2024-11-28 06:00', recipients: ['compliance@company.com'], status: 'paused', format: 'pdf' },
];

const recentReports = [
  { id: 1, name: 'RWA Activity Report - Nov 2024', template: 'rwa-activity', generatedAt: '2024-11-27 14:30:00', size: '2.4 MB', format: 'pdf', status: 'completed', triggeredBy: 'Scheduled', recipients: 3 },
  { id: 2, name: 'Distribution Report - Week 47', template: 'distribution', generatedAt: '2024-11-25 08:00:00', size: '856 KB', format: 'csv', status: 'completed', triggeredBy: 'Scheduled', recipients: 1 },
  { id: 3, name: 'Membership Status - Nov 2024', template: 'membership', generatedAt: '2024-11-20 09:00:00', size: '1.2 MB', format: 'pdf', status: 'completed', triggeredBy: 'Manual', recipients: 2 },
  { id: 4, name: 'Compliance Metrics - Q4 2024', template: 'compliance', generatedAt: '2024-11-15 10:00:00', size: '3.1 MB', format: 'pdf', status: 'completed', triggeredBy: 'Scheduled', recipients: 4 },
  { id: 5, name: 'AI Performance Report - Nov 2024', template: 'ai-performance', generatedAt: '2024-11-27 09:00:00', size: '1.8 MB', format: 'pdf', status: 'completed', triggeredBy: 'Scheduled', recipients: 2 },
  { id: 6, name: 'Multi-Level Executive Summary', template: 'custom', generatedAt: '2024-11-26 16:00:00', size: '4.2 MB', format: 'pdf', status: 'completed', triggeredBy: 'Manual', recipients: 5 },
];

export default function RWAReports() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [createModal, setCreateModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    template: '',
    frequency: 'weekly',
    format: 'pdf',
    recipients: '',
    includeCharts: true,
    includeSummary: true,
    deliveryMethod: 'email',
    webhookUrl: '',
    runTime: '09:00'
  });
  const [reportBuilder, setReportBuilder] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all');

  const generateReport = () => {
    toast.success('Report generation started. You will be notified when ready.');
    setCreateModal(false);
  };

  const saveSchedule = () => {
    toast.success('Scheduled report saved successfully');
    setScheduleModal(false);
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    Automated Reports
                  </h1>
                  <p className="text-slate-400 mt-1">Generate and schedule RWA reports</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setReportBuilder(true)}>
                  <Layers className="w-4 h-4 mr-2" />
                  Report Builder
                </Button>
                <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setScheduleModal(true)}>
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Report
                </Button>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500" onClick={() => setCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            <Tabs defaultValue="templates">
              <TabsList className="bg-slate-800/50 border-slate-700 mb-6">
                <TabsTrigger value="templates">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="scheduled">
                  <Clock className="w-4 h-4 mr-2" />
                  Scheduled
                </TabsTrigger>
                <TabsTrigger value="history">
                  <FileText className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              {/* Templates Tab */}
              <TabsContent value="templates">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportTemplates.map((template, idx) => {
                    const TemplateIcon = template.icon;
                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="bg-slate-900/50 border-slate-800 hover:border-amber-500/50 transition-colors cursor-pointer group">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                                <TemplateIcon className="w-6 h-6 text-amber-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-medium">{template.name}</p>
                                <p className="text-slate-400 text-sm mt-1">{template.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button 
                                size="sm" 
                                className="flex-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                                onClick={() => { setSelectedTemplate(template); setCreateModal(true); }}
                              >
                                <Play className="w-4 h-4 mr-1" />
                                Generate
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-slate-700"
                                onClick={() => { setNewSchedule({ ...newSchedule, template: template.id }); setScheduleModal(true); }}
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                Schedule
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Scheduled Tab */}
              <TabsContent value="scheduled">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400">Report Name</TableHead>
                          <TableHead className="text-slate-400">Frequency</TableHead>
                          <TableHead className="text-slate-400">Next Run</TableHead>
                          <TableHead className="text-slate-400">Recipients</TableHead>
                          <TableHead className="text-slate-400">Format</TableHead>
                          <TableHead className="text-slate-400">Status</TableHead>
                          <TableHead className="text-slate-400"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduledReports.map((report) => (
                          <TableRow key={report.id} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell className="text-white font-medium">{report.name}</TableCell>
                            <TableCell>
                              <Badge className="bg-slate-700 text-slate-300 capitalize">{report.frequency}</Badge>
                            </TableCell>
                            <TableCell className="text-slate-400">{report.nextRun}</TableCell>
                            <TableCell className="text-slate-400 text-sm">{report.recipients.length} recipient(s)</TableCell>
                            <TableCell>
                              <Badge className={report.format === 'pdf' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}>
                                {report.format.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={report.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-300'}>
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  {report.status === 'active' ? <Pause className="w-4 h-4 text-slate-400" /> : <Play className="w-4 h-4 text-slate-400" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="w-4 h-4 text-slate-400" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader className="border-b border-slate-800 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Report History & Logs</CardTitle>
                      <div className="flex gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <Input placeholder="Search reports..." className="bg-slate-800 border-slate-700 pl-9 w-64" />
                        </div>
                        <Select value={historyFilter} onValueChange={setHistoryFilter}>
                          <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="all">All Reports</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="pdf">PDF Only</SelectItem>
                            <SelectItem value="csv">CSV Only</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" className="border-slate-700">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400">Report Name</TableHead>
                          <TableHead className="text-slate-400">Generated</TableHead>
                          <TableHead className="text-slate-400">Triggered By</TableHead>
                          <TableHead className="text-slate-400">Recipients</TableHead>
                          <TableHead className="text-slate-400">Size</TableHead>
                          <TableHead className="text-slate-400">Format</TableHead>
                          <TableHead className="text-slate-400">Status</TableHead>
                          <TableHead className="text-slate-400"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentReports.map((report) => (
                          <TableRow key={report.id} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {report.format === 'pdf' ? (
                                  <File className="w-5 h-5 text-red-400" />
                                ) : (
                                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                                )}
                                <span className="text-white">{report.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-400">{report.generatedAt}</TableCell>
                            <TableCell>
                              <Badge className={report.triggeredBy === 'Scheduled' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-violet-500/20 text-violet-400'}>
                                {report.triggeredBy}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-slate-400">
                                <Mail className="w-3 h-3" />
                                {report.recipients}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-400">{report.size}</TableCell>
                            <TableCell>
                              <Badge className={report.format === 'pdf' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}>
                                {report.format.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-emerald-500/20 text-emerald-400">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="text-slate-400">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="ghost" size="sm" className="text-slate-400">
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                                <Button variant="ghost" size="sm" className="text-slate-400">
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  Regenerate
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Generate Report Modal */}
            <Dialog open={createModal} onOpenChange={setCreateModal}>
              <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    Generate Report
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Report Template</Label>
                    <Select defaultValue={selectedTemplate?.id || 'rwa-activity'}>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {reportTemplates.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start border-slate-700 bg-slate-800">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {dateRange.from ? format(dateRange.from, 'PP') : 'Select'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-slate-800 border-slate-700">
                          <Calendar mode="single" selected={dateRange.from} onSelect={(d) => setDateRange({ ...dateRange, from: d })} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>To Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start border-slate-700 bg-slate-800">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {dateRange.to ? format(dateRange.to, 'PP') : 'Select'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-slate-800 border-slate-700">
                          <Calendar mode="single" selected={dateRange.to} onSelect={(d) => setDateRange({ ...dateRange, to: d })} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 border-red-500/50 bg-red-500/10 text-red-400">
                        <File className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" className="flex-1 border-slate-700">
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="charts" defaultChecked />
                      <Label htmlFor="charts" className="text-sm">Include charts and visualizations</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="summary" defaultChecked />
                      <Label htmlFor="summary" className="text-sm">Include executive summary</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button variant="outline" className="border-slate-700" onClick={() => setCreateModal(false)}>Cancel</Button>
                  <Button className="bg-amber-500 hover:bg-amber-400" onClick={generateReport}>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Schedule Report Modal */}
            <Dialog open={scheduleModal} onOpenChange={setScheduleModal}>
              <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    Schedule Automated Report
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Report Name</Label>
                    <Input 
                      placeholder="e.g., Weekly RWA Summary"
                      className="bg-slate-800 border-slate-700"
                      value={newSchedule.name}
                      onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Report Template</Label>
                    <Select value={newSchedule.template} onValueChange={(v) => setNewSchedule({ ...newSchedule, template: v })}>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {reportTemplates.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select value={newSchedule.frequency} onValueChange={(v) => setNewSchedule({ ...newSchedule, frequency: v })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Format</Label>
                      <Select value={newSchedule.format} onValueChange={(v) => setNewSchedule({ ...newSchedule, format: v })}>
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Recipients</Label>
                    <Input 
                      placeholder="email1@company.com, email2@company.com"
                      className="bg-slate-800 border-slate-700"
                      value={newSchedule.recipients}
                      onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                    />
                    <p className="text-slate-500 text-xs">Separate multiple emails with commas</p>
                  </div>

                  {/* Delivery Method */}
                  <div className="space-y-2">
                    <Label>Delivery Method</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {deliveryMethods.map((method) => {
                        const MethodIcon = method.icon;
                        return (
                          <div
                            key={method.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              newSchedule.deliveryMethod === method.id 
                                ? 'border-cyan-500 bg-cyan-500/10' 
                                : 'border-slate-700 hover:border-slate-600'
                            }`}
                            onClick={() => setNewSchedule({ ...newSchedule, deliveryMethod: method.id })}
                          >
                            <div className="flex items-center gap-2">
                              <MethodIcon className={`w-4 h-4 ${newSchedule.deliveryMethod === method.id ? 'text-cyan-400' : 'text-slate-400'}`} />
                              <span className="text-white text-sm">{method.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {newSchedule.deliveryMethod === 'webhook' && (
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input 
                        placeholder="https://your-api.com/webhook"
                        className="bg-slate-800 border-slate-700 font-mono"
                        value={newSchedule.webhookUrl}
                        onChange={(e) => setNewSchedule({ ...newSchedule, webhookUrl: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Run Time</Label>
                    <Input 
                      type="time"
                      className="bg-slate-800 border-slate-700"
                      value={newSchedule.runTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, runTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Include charts & visualizations</Label>
                      <Switch checked={newSchedule.includeCharts} onCheckedChange={(c) => setNewSchedule({ ...newSchedule, includeCharts: c })} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Include executive summary</Label>
                      <Switch checked={newSchedule.includeSummary} onCheckedChange={(c) => setNewSchedule({ ...newSchedule, includeSummary: c })} />
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button variant="outline" className="border-slate-700" onClick={() => setScheduleModal(false)}>Cancel</Button>
                  <Button className="bg-cyan-500 hover:bg-cyan-400" onClick={saveSchedule}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Schedule
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Report Builder Modal */}
            <ReportBuilder 
              open={reportBuilder}
              onClose={() => setReportBuilder(false)}
              onSave={(config) => console.log('Report config:', config)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}