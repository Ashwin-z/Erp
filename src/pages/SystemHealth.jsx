import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, Server, Database, Cpu, 
  AlertCircle, CheckCircle2, PlayCircle, 
  History, RotateCcw, Terminal 
} from 'lucide-react';

export default function SystemHealth() {
  const [healthScore, setHealthScore] = useState(98);

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-400" />
            Auto-Fix & Health Monitor
          </h1>
          <p className="text-slate-400">Self-Healing Infrastructure Agent</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-500">System Health</p>
            <p className="text-2xl font-bold text-emerald-400">{healthScore}%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin-slow flex items-center justify-center bg-slate-900">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Page Load', value: '1.2s', status: 'Good', icon: Server, color: 'text-blue-400' },
          { label: 'DB Latency', value: '45ms', status: 'Good', icon: Database, color: 'text-purple-400' },
          { label: 'CPU Usage', value: '32%', status: 'Normal', icon: Cpu, color: 'text-orange-400' },
          { label: 'Cache Hit', value: '94%', status: 'Excellent', icon: Activity, color: 'text-emerald-400' },
        ].map((metric, idx) => (
          <Card key={idx} className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase">{metric.label}</p>
                <h3 className="text-2xl font-bold">{metric.value}</h3>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {metric.status}
                </span>
              </div>
              <metric.icon className={`w-8 h-8 opacity-20 ${metric.color.replace('text-', 'bg-')}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Auto-Fix Logs */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Auto-Remediations</CardTitle>
              <Badge variant="outline" className="text-blue-400 border-blue-500/30">Active Mode</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '10:42 AM', event: 'High Latency (>3s)', action: 'Scaled OCR Workers (+2)', status: 'Resolved', duration: '45s' },
                  { time: '08:15 AM', event: 'Cache Miss Spike', action: 'Flushed Redis Key Partition', status: 'Resolved', duration: '12s' },
                  { time: 'Yesterday', event: 'DB Slow Query', action: 'Index Optimization Job', status: 'Ticket Created', duration: 'N/A' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                         {log.status === 'Resolved' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{log.event}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px] h-5 bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            {log.action}
                          </Badge>
                          <span className="text-xs text-slate-500">{log.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${log.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'}`}>{log.status}</p>
                      <p className="text-xs text-slate-500">{log.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Playbooks */}
          <Card className="bg-slate-900/50 border-slate-800">
             <CardHeader><CardTitle>Remediation Playbooks</CardTitle></CardHeader>
             <CardContent>
               <div className="grid md:grid-cols-2 gap-4">
                 {['Scale OCR Cluster', 'Flush CDN Cache', 'Restart API Gateway', 'Switch Read-Only Mode'].map(play => (
                   <div key={play} className="flex items-center justify-between p-3 border border-slate-700 rounded hover:bg-slate-800 transition-colors">
                     <div className="flex items-center gap-2">
                       <Terminal className="w-4 h-4 text-slate-400" />
                       <span className="text-sm">{play}</span>
                     </div>
                     <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><PlayCircle className="w-4 h-4 text-blue-400" /></Button>
                   </div>
                 ))}
               </div>
             </CardContent>
          </Card>
        </div>

        {/* Diagnostics */}
        <div className="space-y-6">
           <Card className="bg-slate-900/50 border-slate-800">
             <CardHeader>
               <CardTitle>Live Diagnostics</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-400">API Response Time</span>
                   <span className="text-emerald-400">120ms</span>
                 </div>
                 <Progress value={15} className="h-1 bg-slate-800" />
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-400">Error Rate</span>
                   <span className="text-emerald-400">0.01%</span>
                 </div>
                 <Progress value={2} className="h-1 bg-slate-800" />
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-400">OCR Queue Depth</span>
                   <span className="text-blue-400">12 jobs</span>
                 </div>
                 <Progress value={25} className="h-1 bg-slate-800" />
               </div>
             </CardContent>
           </Card>
           
           <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-xl">
             <h4 className="font-bold text-amber-200 mb-2 flex items-center gap-2">
               <AlertCircle className="w-4 h-4" /> Incident Watch
             </h4>
             <p className="text-xs text-slate-300 mb-3">
               1 active warning: "Memory usage high on Worker-04". Auto-monitor enabled.
             </p>
             <Button size="sm" variant="outline" className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-900/30">
               View Incident Ticket
             </Button>
           </div>
        </div>

      </div>
    </div>
  );
}