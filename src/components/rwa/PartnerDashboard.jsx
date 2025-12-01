import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Activity, TrendingUp, Clock, CheckCircle2, XCircle, AlertTriangle,
  BarChart3, FileText, Settings, RefreshCw, Download, Zap, Users, Key, Shield
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PartnerRBAC from './PartnerRBAC';
import APIKeyManagement from './APIKeyManagement';

const generateMetricsData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    requests: Math.floor(Math.random() * 500 + 200),
    latency: Math.floor(Math.random() * 100 + 50),
    errors: Math.floor(Math.random() * 10)
  }));
};

const recentActivities = [
  { id: 1, type: 'payment', status: 'success', amount: 5000, reference: 'PAY-001234', timestamp: '14:30:15' },
  { id: 2, type: 'settlement', status: 'success', amount: 125000, reference: 'SET-005678', timestamp: '14:25:00' },
  { id: 3, type: 'payout', status: 'pending', amount: 8500, reference: 'PO-009012', timestamp: '14:20:45' },
  { id: 4, type: 'payment', status: 'failed', amount: 1200, reference: 'PAY-001235', timestamp: '14:15:30' },
  { id: 5, type: 'webhook', status: 'success', amount: 0, reference: 'WH-003456', timestamp: '14:10:00' }
];

export default function PartnerDashboard({ open, onClose, partner }) {
  const [metricsData] = useState(generateMetricsData());
  const [activeTab, setActiveTab] = useState('overview');

  if (!partner) return null;

  const stats = {
    totalTransactions: partner.txCount || 4523,
    successRate: 100 - (partner.errorRate || 0.02),
    avgLatency: Math.floor(Math.random() * 100 + 100),
    uptime: partner.uptime || 99.98,
    volume: partner.txVolume || 1250000
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              {partner.name} Dashboard
              <Badge className={
                partner.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                partner.status === 'degraded' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }>
                {partner.status}
              </Badge>
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-slate-700">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="border-slate-700">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-3 mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 text-center">
              <p className="text-slate-400 text-xs">Transactions</p>
              <p className="text-xl font-bold text-white">{stats.totalTransactions.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 text-center">
              <p className="text-slate-400 text-xs">Success Rate</p>
              <p className="text-xl font-bold text-emerald-400">{stats.successRate.toFixed(2)}%</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 text-center">
              <p className="text-slate-400 text-xs">Avg Latency</p>
              <p className="text-xl font-bold text-white">{stats.avgLatency}ms</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 text-center">
              <p className="text-slate-400 text-xs">Uptime</p>
              <p className="text-xl font-bold text-lime-400">{stats.uptime}%</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 text-center">
              <p className="text-slate-400 text-xs">Volume</p>
              <p className="text-xl font-bold text-white">${(stats.volume / 1000000).toFixed(2)}M</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="logs">
              <FileText className="w-4 h-4 mr-2" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="access">
              <Users className="w-4 h-4 mr-2" />
              Access Control
            </TabsTrigger>
            <TabsTrigger value="apikeys">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Request Volume (24h)</CardTitle>
                </CardHeader>
                <CardContent className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metricsData}>
                      <defs>
                        <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                      <Area type="monotone" dataKey="requests" stroke="#84cc16" fill="url(#requestGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm">Response Latency (24h)</CardTitle>
                </CardHeader>
                <CardContent className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                      <Line type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Health Indicators */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Health Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {['API Gateway', 'Database', 'Cache', 'Webhooks'].map((service, idx) => (
                    <div key={service} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${idx === 2 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      <span className="text-slate-300 text-sm">{service}</span>
                      <span className={`text-xs ml-auto ${idx === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {idx === 2 ? 'Degraded' : 'Healthy'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-transparent">
                      <TableHead className="text-slate-400">Time</TableHead>
                      <TableHead className="text-slate-400">Type</TableHead>
                      <TableHead className="text-slate-400">Reference</TableHead>
                      <TableHead className="text-slate-400 text-right">Amount</TableHead>
                      <TableHead className="text-slate-400 text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id} className="border-slate-700 hover:bg-slate-800/50">
                        <TableCell className="text-slate-400 font-mono text-sm">{activity.timestamp}</TableCell>
                        <TableCell>
                          <Badge className="bg-slate-700 text-slate-300">{activity.type}</Badge>
                        </TableCell>
                        <TableCell className="text-cyan-400 font-mono text-sm">{activity.reference}</TableCell>
                        <TableCell className="text-right text-white">
                          {activity.amount > 0 ? `$${activity.amount.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {activity.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />}
                          {activity.status === 'pending' && <Clock className="w-4 h-4 text-amber-400 mx-auto" />}
                          {activity.status === 'failed' && <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="mt-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 font-mono text-xs space-y-1 max-h-80 overflow-y-auto">
                {Array.from({ length: 20 }, (_, i) => {
                  const level = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 5)];
                  const color = level === 'ERROR' ? 'text-red-400' : level === 'WARN' ? 'text-amber-400' : 'text-slate-400';
                  return (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-600">{new Date(Date.now() - i * 60000).toISOString()}</span>
                      <span className={color}>[{level}]</span>
                      <span className="text-slate-300">
                        {level === 'ERROR' ? 'Request timeout after 30000ms' : 
                         level === 'WARN' ? 'Retry attempt 2/3 for request' :
                         'Successfully processed request'}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="mt-4">
            <PartnerRBAC partnerId={partner?.id} />
          </TabsContent>

          <TabsContent value="apikeys" className="mt-4">
            <APIKeyManagement partnerId={partner?.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}