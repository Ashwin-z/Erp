import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Brain, ArrowLeft, Shield, Activity, CreditCard, Users, AlertTriangle,
  FlaskConical, TrendingUp, TrendingDown, CheckCircle2, XCircle, Zap,
  BarChart3, Clock, Target, RefreshCw, ChevronRight, Crown, Eye
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// Mock data for charts
const accuracyTrend = [
  { date: 'Oct 1', fraud: 92.1, activity: 88.5, credit: 85.2, hr: 82.1 },
  { date: 'Oct 8', fraud: 92.5, activity: 89.1, credit: 86.0, hr: 83.5 },
  { date: 'Oct 15', fraud: 93.2, activity: 89.8, credit: 86.5, hr: 84.2 },
  { date: 'Oct 22', fraud: 93.8, activity: 90.2, credit: 87.1, hr: 85.0 },
  { date: 'Oct 29', fraud: 94.2, activity: 91.0, credit: 88.0, hr: 86.3 },
  { date: 'Nov 5', fraud: 94.5, activity: 91.5, credit: 88.9, hr: 87.1 },
  { date: 'Nov 12', fraud: 95.1, activity: 92.0, credit: 89.5, hr: 87.8 },
  { date: 'Nov 19', fraud: 95.4, activity: 92.3, credit: 90.1, hr: 88.2 },
  { date: 'Nov 26', fraud: 95.8, activity: 93.1, credit: 91.2, hr: 88.9 }
];

const predictionVolume = [
  { hour: '00:00', fraud: 120, activity: 450, credit: 15, hr: 0 },
  { hour: '04:00', fraud: 85, activity: 280, credit: 8, hr: 0 },
  { hour: '08:00', fraud: 320, activity: 890, credit: 45, hr: 156 },
  { hour: '12:00', fraud: 480, activity: 1250, credit: 78, hr: 234 },
  { hour: '16:00', fraud: 520, activity: 1420, credit: 92, hr: 189 },
  { hour: '20:00', fraud: 380, activity: 980, credit: 56, hr: 45 }
];

const modelHealth = [
  { module: 'Fraud Detection', status: 'healthy', accuracy: 95.8, latency: 45, predictions: 12450, drift: 0.2 },
  { module: 'Activity Scoring', status: 'healthy', accuracy: 93.1, latency: 32, predictions: 45620, drift: 0.5 },
  { module: 'Creditworthiness', status: 'warning', accuracy: 91.2, latency: 125, predictions: 890, drift: 1.8 },
  { module: 'HR KPIs', status: 'healthy', accuracy: 88.9, latency: 28, predictions: 3420, drift: 0.3 },
  { module: 'Anomaly Detection', status: 'healthy', accuracy: 94.2, latency: 52, predictions: 8950, drift: 0.4 }
];

const abTestResults = [
  { 
    module: 'Fraud Detection', 
    champion: { version: 'v2.3', accuracy: 94.2, traffic: 70 },
    challenger: { version: 'v2.4-beta', accuracy: 95.8, traffic: 30 },
    winner: 'challenger',
    improvement: 1.6
  },
  { 
    module: 'Activity Scoring', 
    champion: { version: 'v1.8', accuracy: 91.5, traffic: 80 },
    challenger: { version: 'v1.9-beta', accuracy: 93.1, traffic: 20 },
    winner: 'challenger',
    improvement: 1.6
  },
  { 
    module: 'Creditworthiness', 
    champion: { version: 'v3.1', accuracy: 88.9, traffic: 100 },
    challenger: null,
    winner: null,
    improvement: 0
  }
];

const recentAlerts = [
  { id: 1, module: 'Creditworthiness', type: 'drift', message: 'Model drift detected above threshold', severity: 'warning', time: '15 mins ago' },
  { id: 2, module: 'Fraud Detection', type: 'performance', message: 'Latency spike detected in last hour', severity: 'info', time: '1 hour ago' },
  { id: 3, module: 'Activity Scoring', type: 'success', message: 'Model v1.9-beta promoted to champion', severity: 'success', time: '3 hours ago' }
];

const COLORS = ['#84cc16', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'];

export default function AIPerformanceDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedModule, setSelectedModule] = useState(null);

  const overallStats = {
    totalPredictions: 71330,
    avgAccuracy: 92.6,
    avgLatency: 56,
    activeTests: 2,
    healthyModels: 4,
    warningModels: 1
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
                <Link to={createPageUrl('RWAAIModules')}>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    AI Performance Dashboard
                  </h1>
                  <p className="text-slate-400 mt-1">Consolidated AI model health and performance metrics</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32 bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-slate-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <p className="text-slate-400 text-xs">Total Predictions</p>
                  <p className="text-2xl font-bold text-white">{overallStats.totalPredictions.toLocaleString()}</p>
                  <p className="text-emerald-400 text-xs">+12.5% vs last period</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <p className="text-slate-400 text-xs">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-lime-400">{overallStats.avgAccuracy}%</p>
                  <p className="text-emerald-400 text-xs">+1.8% improvement</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <p className="text-slate-400 text-xs">Avg Latency</p>
                  <p className="text-2xl font-bold text-white">{overallStats.avgLatency}ms</p>
                  <p className="text-slate-500 text-xs">Within SLA</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <p className="text-slate-400 text-xs">Active A/B Tests</p>
                  <p className="text-2xl font-bold text-violet-400">{overallStats.activeTests}</p>
                  <p className="text-slate-500 text-xs">Running</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <p className="text-slate-400 text-xs">Healthy Models</p>
                  <p className="text-2xl font-bold text-emerald-400">{overallStats.healthyModels}</p>
                  <p className="text-emerald-400 text-xs">All systems go</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <p className="text-slate-400 text-xs">Warnings</p>
                  <p className="text-2xl font-bold text-amber-400">{overallStats.warningModels}</p>
                  <p className="text-amber-400 text-xs">Needs attention</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Accuracy Trends Chart */}
              <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-lime-400" />
                    Accuracy Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={accuracyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis domain={[80, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} dot={false} name="Fraud Detection" />
                      <Line type="monotone" dataKey="activity" stroke="#84cc16" strokeWidth={2} dot={false} name="Activity Scoring" />
                      <Line type="monotone" dataKey="credit" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Creditworthiness" />
                      <Line type="monotone" dataKey="hr" stroke="#ec4899" strokeWidth={2} dot={false} name="HR KPIs" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'warning' ? 'border-amber-500 bg-amber-500/10' :
                      alert.severity === 'success' ? 'border-emerald-500 bg-emerald-500/10' :
                      'border-blue-500 bg-blue-500/10'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <Badge className="bg-slate-700 text-slate-300 text-xs">{alert.module}</Badge>
                        <span className="text-slate-500 text-xs">{alert.time}</span>
                      </div>
                      <p className="text-slate-300 text-sm">{alert.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Model Health Grid */}
            <Card className="bg-slate-900/50 border-slate-800 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Model Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {modelHealth.map((model, idx) => (
                    <motion.div
                      key={model.module}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-105 ${
                        model.status === 'healthy' ? 'border-emerald-500/50 bg-emerald-500/5' :
                        model.status === 'warning' ? 'border-amber-500/50 bg-amber-500/5' :
                        'border-red-500/50 bg-red-500/5'
                      }`}
                      onClick={() => setSelectedModule(model)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-3 h-3 rounded-full ${
                          model.status === 'healthy' ? 'bg-emerald-400' :
                          model.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
                        }`} />
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                      <p className="text-white font-medium text-sm mb-2">{model.module}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Accuracy</span>
                          <span className="text-white font-medium">{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="h-1 bg-slate-700" />
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Latency</span>
                          <span className="text-white">{model.latency}ms</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Predictions</span>
                          <span className="text-white">{model.predictions.toLocaleString()}</span>
                        </div>
                        {model.drift > 1 && (
                          <div className="flex items-center gap-1 text-amber-400 text-xs">
                            <AlertTriangle className="w-3 h-3" />
                            Drift: {model.drift}%
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* A/B Test Comparison */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-violet-400" />
                    A/B Test Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {abTestResults.map((test, idx) => (
                    <div key={idx} className="p-4 bg-slate-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-medium">{test.module}</span>
                        {test.winner && (
                          <Badge className={test.winner === 'challenger' ? 'bg-lime-500/20 text-lime-400' : 'bg-slate-600 text-slate-300'}>
                            {test.winner === 'challenger' ? `+${test.improvement}% improvement` : 'Champion winning'}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`p-3 rounded-lg ${test.winner === 'champion' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-700/50'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-4 h-4 text-amber-400" />
                            <span className="text-slate-300 text-sm">{test.champion.version}</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{test.champion.accuracy}%</p>
                          <p className="text-slate-500 text-xs">{test.champion.traffic}% traffic</p>
                        </div>
                        {test.challenger ? (
                          <div className={`p-3 rounded-lg ${test.winner === 'challenger' ? 'bg-lime-500/10 border border-lime-500/30' : 'bg-slate-700/50'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <FlaskConical className="w-4 h-4 text-violet-400" />
                              <span className="text-slate-300 text-sm">{test.challenger.version}</span>
                            </div>
                            <p className="text-2xl font-bold text-lime-400">{test.challenger.accuracy}%</p>
                            <p className="text-slate-500 text-xs">{test.challenger.traffic}% traffic</p>
                          </div>
                        ) : (
                          <div className="p-3 rounded-lg bg-slate-700/30 border border-dashed border-slate-600 flex items-center justify-center">
                            <span className="text-slate-500 text-sm">No challenger</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Prediction Volume */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Prediction Volume (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={predictionVolume}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      <Bar dataKey="fraud" fill="#ef4444" name="Fraud" stackId="a" />
                      <Bar dataKey="activity" fill="#84cc16" name="Activity" stackId="a" />
                      <Bar dataKey="credit" fill="#8b5cf6" name="Credit" stackId="a" />
                      <Bar dataKey="hr" fill="#ec4899" name="HR" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to={createPageUrl('RWAAIModules')}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-violet-500/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">AI Modules</p>
                      <p className="text-slate-500 text-sm">Configure models</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link to={createPageUrl('RWAReports')}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Reports</p>
                      <p className="text-slate-500 text-sm">Generate reports</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Model Training</p>
                    <p className="text-slate-500 text-sm">Retrain models</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Monitoring</p>
                    <p className="text-slate-500 text-sm">Real-time metrics</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}