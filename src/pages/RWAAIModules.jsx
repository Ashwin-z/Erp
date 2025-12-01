import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Shield, ArrowLeft, Brain, AlertTriangle, CheckCircle2, XCircle,
  Activity, TrendingUp, Users, CreditCard, Zap, Eye, Settings,
  BarChart3, Target, FileText, Clock, RefreshCw, Info, HelpCircle, FlaskConical
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AIExplainabilityModal from '@/components/rwa/AIExplainabilityModal';
import AnomalyDetectionPanel from '@/components/rwa/AnomalyDetectionPanel';
import ModelABTestingPanel from '@/components/rwa/ModelABTestingPanel';
import ModelRetrainingPanel from '@/components/rwa/ModelRetrainingPanel';
import { toast } from 'sonner';

const fraudAlerts = [
  { id: 'FRD-001', company: 'Unknown Corp', activity: 'invoice_paid', amount: 50000, riskScore: 92, reason: 'Unusual amount spike, new account, velocity check failed', status: 'pending', timestamp: '2024-11-27 14:30:00' },
  { id: 'FRD-002', company: 'TechStart Pte Ltd', activity: 'ad_spend', amount: 15000, riskScore: 75, reason: 'Unusual geo location, spending pattern anomaly', status: 'reviewing', timestamp: '2024-11-27 12:15:00' },
  { id: 'FRD-003', company: 'Marina Foods', activity: 'referral_signup', amount: 200, riskScore: 45, reason: 'Multiple referrals from same IP cluster', status: 'approved', timestamp: '2024-11-26 16:00:00' },
];

const activityScores = [
  { id: 'ACT-001', company: 'Global Logistics SG', type: 'invoice_paid', amount: 25000, rawScore: 85, adjustedScore: 102, factors: ['On-time payment (+10)', 'Repeat customer (+5)', 'Large value (+2)'] },
  { id: 'ACT-002', company: 'TechStart Pte Ltd', type: 'loan_disbursement', amount: 100000, rawScore: 100, adjustedScore: 95, factors: ['Good credit (-0)', 'First loan (-5)', 'Standard risk (+0)'] },
  { id: 'ACT-003', company: 'Urban Retail', type: 'ad_spend', amount: 5000, rawScore: 50, adjustedScore: 55, factors: ['Campaign performance (+5)', 'Conversion rate (+0)'] },
];

const creditScores = [
  { company: 'Global Logistics SG', score: 780, level: 'Excellent', limit: 500000, rate: 4.5, factors: ['Strong cashflow', 'Long history', 'Low debt ratio', 'Consistent RVU activity'] },
  { company: 'TechStart Pte Ltd', score: 680, level: 'Good', limit: 150000, rate: 6.2, factors: ['Growing revenue', 'Short history', 'Moderate debt', 'Active platform usage'] },
  { company: 'Urban Retail', score: 550, level: 'Fair', limit: 50000, rate: 9.5, factors: ['Variable cashflow', 'New business', 'Limited history', 'Low RVU activity'] },
];

const hrKPIs = [
  { employee: 'John Tan', department: 'Sales', score: 92, tasks: 156, accuracy: 98.5, eligible: true, reward: 450 },
  { employee: 'Sarah Lee', department: 'Finance', score: 88, tasks: 234, accuracy: 99.2, eligible: true, reward: 380 },
  { employee: 'Mike Wong', department: 'Operations', score: 72, tasks: 189, accuracy: 94.1, eligible: false, reward: 0 },
];

export default function RWAAIModules() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('fraud');
  const [explainModal, setExplainModal] = useState(null);

  const handleApprove = (id) => {
    toast.success(`Alert ${id} approved`);
  };

  const handleReject = (id) => {
    toast.error(`Alert ${id} rejected`);
  };

  const openExplainability = (type, data) => {
    const prediction = {
      type,
      score: data.riskScore || data.score || data.rawScore || 75,
      modelVersion: 'v2.3.1',
      factors: [
        { name: 'Transaction Amount', impact: type === 'fraud' ? -15 : 10, weight: 0.25, explanation: 'Large transaction amounts increase risk scoring' },
        { name: 'Account Age', impact: 8, weight: 0.15, explanation: 'Established accounts have lower risk profiles' },
        { name: 'Velocity Check', impact: type === 'fraud' ? -12 : 5, weight: 0.20, explanation: 'Number of transactions in time window' },
        { name: 'Geo Location', impact: -5, weight: 0.10, explanation: 'Transaction location vs. account registered location' },
        { name: 'Historical Behavior', impact: 15, weight: 0.30, explanation: 'Past transaction patterns and compliance history' }
      ],
      historical: [
        { period: 'Oct', score: 72, accurate: true, outcome: 'Verified' },
        { period: 'Sep', score: 68, accurate: true, outcome: 'Verified' },
        { period: 'Aug', score: 75, accurate: false, outcome: 'False positive' },
        { period: 'Jul', score: 80, accurate: true, outcome: 'Verified' },
        { period: 'Jun', score: 65, accurate: true, outcome: 'Verified' },
        { period: 'May', score: 70, accurate: true, outcome: 'Verified' }
      ],
      recommendation: type === 'fraud' 
        ? 'Review transaction details and verify with customer before approval.'
        : 'Score indicates healthy activity. Consider for premium tier upgrade.'
    };
    setExplainModal(prediction);
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    AI/ML Modules
                  </h1>
                  <p className="text-slate-400 mt-1">Activity scoring, fraud detection, credit assessment, and HR KPIs</p>
                </div>
              </div>
              <Button variant="outline" className="border-slate-700 text-slate-300">
                <Settings className="w-4 h-4 mr-2" />
                Configure Models
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-slate-400 text-sm">Fraud Alerts</span>
                  </div>
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-red-400 text-xs">2 pending review</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-lime-400" />
                    <span className="text-slate-400 text-sm">Avg Activity Score</span>
                  </div>
                  <p className="text-2xl font-bold text-white">84.2</p>
                  <p className="text-lime-400 text-xs">+2.5% from last period</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-violet-400" />
                    <span className="text-slate-400 text-sm">Avg Credit Score</span>
                  </div>
                  <p className="text-2xl font-bold text-white">670</p>
                  <p className="text-slate-400 text-xs">Good standing</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-pink-400" />
                    <span className="text-slate-400 text-sm">HR KPI Eligible</span>
                  </div>
                  <p className="text-2xl font-bold text-white">67%</p>
                  <p className="text-slate-400 text-xs">Above threshold</p>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-800/50 border-slate-700 mb-6">
                <TabsTrigger value="fraud" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                  <Shield className="w-4 h-4 mr-2" />
                  Fraud Detection
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-lime-500/20 data-[state=active]:text-lime-400">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity Scoring
                </TabsTrigger>
                <TabsTrigger value="credit" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Creditworthiness
                </TabsTrigger>
                <TabsTrigger value="hr" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
                  <Users className="w-4 h-4 mr-2" />
                  HR KPI Scoring
                </TabsTrigger>
                <TabsTrigger value="anomaly" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Anomaly Detection
                </TabsTrigger>
                <TabsTrigger value="abtesting" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                  <FlaskConical className="w-4 h-4 mr-2" />
                  A/B Testing
                </TabsTrigger>
                <TabsTrigger value="retraining" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retraining
                </TabsTrigger>
              </TabsList>

              {/* Fraud Detection */}
              <TabsContent value="fraud">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Fraud Alerts Queue
                      </CardTitle>
                      <Button variant="outline" size="sm" className="border-slate-700">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {fraudAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        className={`bg-slate-800/50 rounded-xl p-4 border-l-4 ${
                          alert.riskScore >= 80 ? 'border-red-500' :
                          alert.riskScore >= 60 ? 'border-amber-500' : 'border-emerald-500'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-cyan-400 font-mono text-sm">{alert.id}</span>
                              <Badge className={
                                alert.status === 'pending' ? 'bg-red-500/20 text-red-400' :
                                alert.status === 'reviewing' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-emerald-500/20 text-emerald-400'
                              }>
                                {alert.status}
                              </Badge>
                            </div>
                            <p className="text-white font-medium">{alert.company}</p>
                            <p className="text-slate-400 text-sm">{alert.activity} • ${alert.amount.toLocaleString()}</p>
                            <div className="mt-3 bg-slate-900/50 rounded-lg p-3">
                              <p className="text-slate-400 text-xs mb-1">AI Explanation:</p>
                              <p className="text-slate-300 text-sm">{alert.reason}</p>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="mb-3">
                              <p className="text-slate-400 text-xs">Risk Score</p>
                              <p className={`text-3xl font-bold ${
                                alert.riskScore >= 80 ? 'text-red-400' :
                                alert.riskScore >= 60 ? 'text-amber-400' : 'text-emerald-400'
                              }`}>{alert.riskScore}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 mb-2"
                              onClick={() => openExplainability('fraud', alert)}
                            >
                              <HelpCircle className="w-4 h-4 mr-1" />
                              Why?
                            </Button>
                            {alert.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/20" onClick={() => handleApprove(alert.id)}>
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20" onClick={() => handleReject(alert.id)}>
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Model Config */}
                <Card className="bg-slate-900/50 border-slate-800 mt-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-slate-400" />
                      Fraud Detection Model Config
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <Label className="text-slate-400 text-sm">Velocity Check Window</Label>
                        <Input type="number" defaultValue={24} className="bg-slate-700 border-slate-600 text-white mt-1" />
                        <p className="text-slate-500 text-xs mt-1">Hours</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <Label className="text-slate-400 text-sm">Amount Threshold</Label>
                        <Input type="number" defaultValue={10000} className="bg-slate-700 border-slate-600 text-white mt-1" />
                        <p className="text-slate-500 text-xs mt-1">SGD for high-risk flag</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <Label className="text-slate-400 text-sm">Auto-Block Score</Label>
                        <Input type="number" defaultValue={95} className="bg-slate-700 border-slate-600 text-white mt-1" />
                        <p className="text-slate-500 text-xs mt-1">Auto-reject above</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Scoring */}
              <TabsContent value="activity">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity Scores</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400">Activity ID</TableHead>
                          <TableHead className="text-slate-400">Company</TableHead>
                          <TableHead className="text-slate-400">Type</TableHead>
                          <TableHead className="text-slate-400 text-right">Amount</TableHead>
                          <TableHead className="text-slate-400 text-center">Raw Score</TableHead>
                          <TableHead className="text-slate-400 text-center">Adjusted</TableHead>
                          <TableHead className="text-slate-400">Factors</TableHead>
                          <TableHead className="text-slate-400 w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activityScores.map((score) => (
                          <TableRow key={score.id} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell className="text-cyan-400 font-mono text-sm">{score.id}</TableCell>
                            <TableCell className="text-white">{score.company}</TableCell>
                            <TableCell>
                              <Badge className="bg-slate-700 text-slate-300">{score.type}</Badge>
                            </TableCell>
                            <TableCell className="text-right text-white">${score.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-center text-slate-400">{score.rawScore}</TableCell>
                            <TableCell className="text-center">
                              <span className={score.adjustedScore > score.rawScore ? 'text-lime-400' : 'text-amber-400'}>
                                {score.adjustedScore}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {score.factors.map((f, i) => (
                                  <Badge key={i} className="bg-slate-700 text-slate-300 text-xs">{f}</Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-cyan-400"
                                onClick={() => openExplainability('activity', score)}
                              >
                                <HelpCircle className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Creditworthiness */}
              <TabsContent value="credit">
                <div className="grid md:grid-cols-3 gap-6">
                  {creditScores.map((credit, idx) => (
                    <motion.div
                      key={credit.company}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-6">
                          <div className="text-center mb-4">
                            <p className="text-slate-400 text-sm">{credit.company}</p>
                            <div className="relative w-32 h-32 mx-auto mt-4">
                              <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="10" />
                                <circle
                                  cx="50" cy="50" r="45" fill="none"
                                  stroke={credit.score >= 700 ? '#10b981' : credit.score >= 600 ? '#f59e0b' : '#ef4444'}
                                  strokeWidth="10"
                                  strokeDasharray={`${(credit.score / 850) * 283} 283`}
                                  strokeLinecap="round"
                                  transform="rotate(-90 50 50)"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-white">{credit.score}</span>
                                <span className={`text-sm ${
                                  credit.score >= 700 ? 'text-emerald-400' : credit.score >= 600 ? 'text-amber-400' : 'text-red-400'
                                }`}>{credit.level}</span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                              <p className="text-slate-400 text-xs">Recommended Limit</p>
                              <p className="text-white font-bold">${credit.limit.toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                              <p className="text-slate-400 text-xs">Recommended Rate</p>
                              <p className="text-white font-bold">{credit.rate}%</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs mb-2">AI Factors:</p>
                            <div className="flex flex-wrap gap-1">
                              {credit.factors.map((f, i) => (
                                <Badge key={i} className="bg-slate-700 text-slate-300 text-xs">{f}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              {/* HR KPI */}
              <TabsContent value="hr">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">HR Performance Scores</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400">Employee</TableHead>
                          <TableHead className="text-slate-400">Department</TableHead>
                          <TableHead className="text-slate-400 text-center">KPI Score</TableHead>
                          <TableHead className="text-slate-400 text-center">Tasks</TableHead>
                          <TableHead className="text-slate-400 text-center">Accuracy</TableHead>
                          <TableHead className="text-slate-400 text-center">Eligible</TableHead>
                          <TableHead className="text-slate-400 text-right">Reward</TableHead>
                          <TableHead className="text-slate-400 w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hrKPIs.map((kpi) => (
                          <TableRow key={kpi.employee} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell className="text-white font-medium">{kpi.employee}</TableCell>
                            <TableCell className="text-slate-400">{kpi.department}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Progress value={kpi.score} className="w-16 h-2 bg-slate-700" />
                                <span className={kpi.score >= 80 ? 'text-lime-400' : kpi.score >= 60 ? 'text-amber-400' : 'text-red-400'}>
                                  {kpi.score}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-slate-300">{kpi.tasks}</TableCell>
                            <TableCell className="text-center text-slate-300">{kpi.accuracy}%</TableCell>
                            <TableCell className="text-center">
                              {kpi.eligible ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                              )}
                            </TableCell>
                            <TableCell className="text-right text-emerald-400 font-medium">
                              {kpi.reward > 0 ? `$${kpi.reward}` : '-'}
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-cyan-400"
                                onClick={() => openExplainability('hr', kpi)}
                              >
                                <HelpCircle className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Anomaly Detection */}
              <TabsContent value="anomaly">
                <AnomalyDetectionPanel module="fraud" />
              </TabsContent>

              {/* A/B Testing */}
              <TabsContent value="abtesting">
                <div className="space-y-6">
                  <ModelABTestingPanel module="fraud" onRollback={(v) => toast.success(`Rolled back to ${v.version}`)} />
                  <div className="grid md:grid-cols-2 gap-6">
                    <ModelABTestingPanel module="activity" onRollback={(v) => toast.success(`Rolled back to ${v.version}`)} />
                    <ModelABTestingPanel module="credit" onRollback={(v) => toast.success(`Rolled back to ${v.version}`)} />
                  </div>
                </div>
              </TabsContent>

              {/* Retraining */}
              <TabsContent value="retraining">
                <ModelRetrainingPanel onRollback={(model) => toast.success(`${model.name} rolled back`)} />
              </TabsContent>
            </Tabs>

            <AIExplainabilityModal 
              open={!!explainModal} 
              onClose={() => setExplainModal(null)} 
              prediction={explainModal}
            />
          </div>
        </main>
      </div>
    </div>
  );
}