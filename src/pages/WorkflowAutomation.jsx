import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, Calendar, Bell, Zap, 
  MoreHorizontal, Play, CheckCircle2, AlertTriangle,
  ArrowRight, Layers, GitGraph, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VisualWorkflowBuilder from '@/components/workflows/VisualWorkflowBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WorkflowAutomation() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-400" />
              Advanced Workflow Engine
            </h1>
            <p className="text-slate-400">Timer-based Automation & Escalation Matrix</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button className="bg-white text-slate-900 hover:bg-slate-100 font-medium border-0" onClick={() => setActiveTab('designer')}>
              <GitGraph className="w-4 h-4 mr-2" /> Visual Designer
           </Button>
           <Button className="bg-yellow-600 hover:bg-yellow-700">
             Create Workflow
           </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="designer">Visual Designer</TabsTrigger>
          <TabsTrigger value="monitor">Real-time Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="designer">
          <VisualWorkflowBuilder />
        </TabsContent>

        <TabsContent value="monitor">
           <Card className="bg-slate-900/50 border-slate-800 h-96 flex items-center justify-center">
             <div className="text-center">
               <p className="text-slate-400">Real-time monitoring dashboard placeholder</p>
               <p className="text-xs text-slate-600">Visualize active threads and bottlenecks here</p>
             </div>
           </Card>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-3 gap-8">
        {/* Workflow List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Timer Triggers */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Active Timer Workflows
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Contract Renewal Alert', interval: '6 Months', nextRun: '2 Days', status: 'Active' },
                { name: 'Quarterly Compliance Check', interval: '3 Months', nextRun: '15 Days', status: 'Active' },
                { name: 'Monthly Payroll Prep', interval: '1 Month', nextRun: '20 Days', status: 'Active' },
                { name: 'Daily Bank Recon', interval: 'Daily', nextRun: '4 Hours', status: 'Active' },
              ].map((wf, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{wf.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] border-slate-700">{wf.interval}</Badge>
                        <span className="text-xs text-slate-500">Next: {wf.nextRun}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                      {wf.status}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Escalation Chains */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Escalation & Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Overdue Invoice > 7 Days', action: 'Email Reminder', escalation: 'Notify Sales Mgr' },
                { name: 'KYC Pending > 24 Hrs', action: 'SLA Alert', escalation: 'Notify Compliance Head' },
              ].map((rule, idx) => (
                <div key={idx} className="p-4 border-l-2 border-purple-500 bg-slate-950/50 rounded-r-lg">
                  <div className="flex justify-between items-start">
                     <div>
                       <h4 className="font-bold text-sm">{rule.name}</h4>
                       <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                         <span className="flex items-center gap-1"><Play className="w-3 h-3 text-emerald-400" /> {rule.action}</span>
                         <ArrowRight className="w-3 h-3" />
                         <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-400" /> {rule.escalation}</span>
                       </div>
                     </div>
                     <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700">Edit</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Execution Log */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle>Execution Log</CardTitle>
              <CardDescription>Recent automated actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { event: 'Daily Bank Recon', time: '08:00 AM', status: 'Success' },
                  { event: 'Wkly Performance Rpt', time: 'Yesterday', status: 'Success' },
                  { event: 'Mthly Payroll Trigger', time: 'Oct 25', status: 'Escalated' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {log.status === 'Success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      <span>{log.event}</span>
                    </div>
                    <span className="text-xs text-slate-500">{log.time}</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-xs text-slate-400">View Full Audit Trail</Button>
            </CardContent>
          </Card>

          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
             <h4 className="font-bold text-blue-200 mb-2 flex items-center gap-2">
               <Bell className="w-4 h-4" /> System Notice
             </h4>
             <p className="text-xs text-slate-300">
               Workflow engine operating at 99.99% uptime. Next major scheduled task: "Quarterly Tax Prep" in 14 days.
             </p>
          </div>
        </div>
      </div>
      </TabsContent>
      </Tabs>
    </div>
  );
}