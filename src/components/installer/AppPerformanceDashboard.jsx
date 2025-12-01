import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, Database, Cpu, Server, Zap, AlertTriangle, TrendingUp, Scale, Users, BarChart, Heart, MessageSquare 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InstallerEngine } from './InstallerEngine';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart as RechartsBarChart, Bar } from 'recharts';
import FeedbackModal from '@/components/feedback/FeedbackModal';

export default function AppPerformanceDashboard() {
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedApp, setSelectedApp] = useState('All');
  const [detailedMetrics, setDetailedMetrics] = useState(null);
  const [healthStatus, setHealthStatus] = useState([]);
  const [correlations, setCorrelations] = useState([]);

  const { data: apps } = useQuery({
    queryKey: ['installedApps'],
    queryFn: () => base44.entities.InstalledApp.list(),
    initialData: []
  });

  const { data: feedback } = useQuery({
      queryKey: ['appFeedback'],
      queryFn: () => base44.entities.AppFeedback.list('-created_date', 20),
      initialData: []
  });

  // Mock data generator since we might not have real metrics yet
  const generateMockData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      data.push({
        time: new Date(now.getTime() - (24 - i) * 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cpu: Math.floor(Math.random() * 30) + 20,
        memory: Math.floor(Math.random() * 500) + 800,
        response: Math.floor(Math.random() * 100) + 50,
        db: Math.floor(Math.random() * 40) + 10,
      });
    }
    return data;
  };

  const [metrics, setMetrics] = useState(generateMockData());
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    // Load initial AI anomalies & Detailed Metrics
    InstallerEngine.getAIPerformanceAnomalies(metrics).then(setAnomalies);
    InstallerEngine.getDetailedPerformanceMetrics().then(setDetailedMetrics);
    
    if (apps.length > 0) {
        InstallerEngine.runHealthChecks(apps).then(setHealthStatus);
    }
  }, [apps, metrics]); // Added metrics dependency for re-run if needed

  useEffect(() => {
      // Run feedback correlation
      if (metrics && feedback) {
          InstallerEngine.correlateFeedbackWithMetrics(metrics, feedback).then(setCorrelations);
      }
  }, [metrics, feedback]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cpu: Math.floor(Math.random() * 30) + 20,
          memory: Math.floor(Math.random() * 500) + 800,
          response: Math.floor(Math.random() * 100) + 50,
          db: Math.floor(Math.random() * 40) + 10,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">System Health & App Performance</h2>
        <div className="flex gap-3">
          <Select value={selectedApp} onValueChange={setSelectedApp}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select App" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Apps (System)</SelectItem>
              <SelectItem value="ArkApp Core">ArkApp Core</SelectItem>
              <SelectItem value="HR Module">HR Module</SelectItem>
              <SelectItem value="POS">POS</SelectItem>
            </SelectContent>
          </Select>
          
          <FeedbackModal trigger={
              <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" /> Feedback
              </Button>
          } />

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Health Status Overview */}
      {healthStatus.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {healthStatus.map(status => (
                <Card key={status.app_name} className={status.status === 'Unhealthy' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-sm">{status.app_name}</h4>
                            <p className="text-xs text-slate-500">{status.status}</p>
                        </div>
                        <div className={`p-2 rounded-full ${status.status === 'Unhealthy' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            <Heart className="w-4 h-4 fill-current" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}

      {/* AI Anomalies & Feedback Correlations */}
      <div className="grid gap-4 md:grid-cols-2">
          {/* Anomalies */}
          <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Performance Anomalies
              </h3>
              {anomalies.map((anomaly, idx) => (
                <Card key={idx} className={`border-l-4 ${anomaly.severity === 'High' ? 'border-l-red-500 bg-red-50/50' : 'border-l-amber-500 bg-amber-50/50'}`}>
                  <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-white p-1.5 rounded shadow-sm">
                            {anomaly.type === 'Scaling' ? <Scale className="w-4 h-4 text-slate-700" /> : <TrendingUp className="w-4 h-4 text-slate-700" />}
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm flex items-center gap-2 ${anomaly.severity === 'High' ? 'text-red-900' : 'text-amber-900'}`}>
                            {anomaly.title}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">{anomaly.description}</p>
                          <div className="mt-2 bg-white/50 p-1.5 rounded text-xs font-medium flex items-center gap-1.5">
                             <Zap className="w-3 h-3" /> {anomaly.recommendation}
                          </div>
                        </div>
                      </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Feedback Correlations */}
          <div className="space-y-4">
             <h3 className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> User Feedback Correlations
             </h3>
             {correlations.map((corr, idx) => (
                 <Card key={idx} className="border-l-4 border-l-purple-500 bg-purple-50/30">
                     <CardContent className="p-4">
                         <div className="flex items-start gap-3">
                             <div className="bg-white p-1.5 rounded shadow-sm">
                                <MessageSquare className="w-4 h-4 text-purple-600" />
                             </div>
                             <div>
                                 <h4 className="font-bold text-sm text-slate-900">{corr.title}</h4>
                                 <p className="text-xs text-slate-600 mt-1">{corr.description}</p>
                                 <div className="mt-2 bg-white/50 p-1.5 rounded text-xs text-purple-700 font-medium flex items-center gap-1.5">
                                     🚀 Action: {corr.action_item}
                                 </div>
                             </div>
                         </div>
                     </CardContent>
                 </Card>
             ))}
             {correlations.length === 0 && (
                 <Card className="bg-slate-50 border-dashed h-full flex items-center justify-center min-h-[100px]">
                     <CardContent className="p-6 text-center text-slate-400">
                         <p className="text-xs">No feedback correlations detected.</p>
                     </CardContent>
                 </Card>
             )}
          </div>
      </div>

      {/* Detailed Analytics */}
      {detailedMetrics && (
        <div className="grid md:grid-cols-3 gap-4">
           <Card className="md:col-span-2">
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
                 <BarChart className="w-4 h-4" /> Module Response Times & Status
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="h-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <RechartsBarChart data={detailedMetrics.module_performance} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                     <RechartsTooltip />
                     <Bar dataKey="response_time" fill="#6366f1" radius={[0, 4, 4, 0]} name="Response (ms)" barSize={20} />
                   </RechartsBarChart>
                 </ResponsiveContainer>
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
                 <Users className="w-4 h-4" /> Active Users per Module
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               {detailedMetrics.module_performance.map(mod => (
                 <div key={mod.name} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${mod.status === 'Healthy' ? 'bg-green-500' : 'bg-amber-500'}`} />
                     <span className="text-sm font-medium">{mod.name}</span>
                   </div>
                   <span className="text-sm text-slate-500">{mod.active_users} users</span>
                 </div>
               ))}
             </CardContent>
           </Card>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* CPU & Memory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Cpu className="w-4 h-4" /> CPU & Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Response Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Activity className="w-4 h-4" /> Response & DB Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="response" stroke="#10b981" strokeWidth={2} dot={false} name="App Response (ms)" />
                  <Line type="monotone" dataKey="db" stroke="#f59e0b" strokeWidth={2} dot={false} name="DB Query (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}