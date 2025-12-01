import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Package, RefreshCw, Trash2, FileText, CheckCircle2, 
  AlertTriangle, Clock, RotateCcw, ChevronRight, Search,
  Brain, Sparkles, GitBranch, Shield, Activity, History, Zap, MessageSquare
} from 'lucide-react';
import FeedbackModal from '@/components/feedback/FeedbackModal';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { InstallerEngine } from './InstallerEngine';
import CICDPipeline from './CICDPipeline';
import AppPermissions from './AppPermissions';
import AppPerformanceDashboard from './AppPerformanceDashboard';
import AppDiscoveryPanel from './AppDiscoveryPanel';
import AppAuditLogPanel from './AppAuditLogPanel';
import moment from 'moment';

export default function AppManagerDashboard() {
  const queryClient = useQueryClient();
  const [selectedAppLogs, setSelectedAppLogs] = useState(null);
  const [logOpen, setLogOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Mock User Role (In real app, fetch from base44.auth.me() + permissions)
  // Roles: 'App Administrator', 'App Deployer', 'App Viewer'
  const userRole = 'App Administrator'; 

  // Fetch Installed Apps
  const { data: apps, isLoading } = useQuery({
    queryKey: ['installedApps'],
    queryFn: () => base44.entities.InstalledApp.list('-last_updated'),
    initialData: [
      // Mock data for initial view if DB is empty
      { id: '1', app_name: 'ArkApp Core', version: '1.0.0', status: 'Installed', compatibility_status: 'Compatible', last_updated: '2024-10-26T10:00:00Z', modules_installed: ['Manufacturing', 'CRM'] },
      { id: '2', app_name: 'HR Module', version: '2.1.0', status: 'Updating', compatibility_status: 'Warning', last_updated: '2024-10-25T14:30:00Z', modules_installed: ['HR', 'Payroll'] }
    ]
  });

  // Mock Logs Fetcher
  const fetchLogs = async (installId) => {
    // In real app: return base44.entities.AppInstallerLog.filter({ installation_id: installId });
    return [
      { id: 1, timestamp: '2024-10-26T10:00:00Z', level: 'Info', step: 'Init', message: 'Installation started' },
      { id: 2, timestamp: '2024-10-26T10:01:00Z', level: 'Info', step: 'DepCheck', message: 'Dependencies resolved' },
      { id: 3, timestamp: '2024-10-26T10:05:00Z', level: 'Info', step: 'Complete', message: 'Installation successful' }
    ];
  };

  const handleViewLogs = async (app) => {
    const logs = await fetchLogs(app.installation_id);
    setSelectedAppLogs({ app, logs });
    setLogOpen(true);
  };

  const handleUninstall = (id) => {
    if (userRole !== 'App Administrator') {
      toast.error("Permission denied. Only Administrators can uninstall apps.");
      return;
    }
    toast.info("Uninstalling app...");
    setTimeout(() => toast.success("App uninstalled successfully"), 1500);
  };

  const handleUpdate = (id) => {
    if (userRole === 'App Viewer') {
      toast.error("Permission denied. Viewers cannot update apps.");
      return;
    }
    toast.info("Checking for updates...");
    setTimeout(() => toast.success("App is up to date"), 1500);
  };

  const runAIScan = async () => {
    setLoadingAi(true);
    const insights = await InstallerEngine.getAIAppInsights(apps);
    setAiInsights(insights);
    setLoadingAi(false);
    toast.success("AI Analysis Completed");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="apps" className="w-full">
        <TabsList className="mb-4 flex-wrap h-auto gap-2">
          <TabsTrigger value="apps" className="flex gap-2"><Package className="w-4 h-4"/> Installed Apps</TabsTrigger>
          <TabsTrigger value="performance" className="flex gap-2"><Activity className="w-4 h-4"/> Performance</TabsTrigger>
          <TabsTrigger value="discovery" className="flex gap-2"><Zap className="w-4 h-4"/> App Discovery</TabsTrigger>
          <TabsTrigger value="cicd" className="flex gap-2"><GitBranch className="w-4 h-4"/> CI/CD</TabsTrigger>
          <TabsTrigger value="audit" className="flex gap-2"><History className="w-4 h-4"/> Audit Logs</TabsTrigger>
          <TabsTrigger value="permissions" className="flex gap-2"><Shield className="w-4 h-4"/> Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="apps" className="space-y-6">
          {/* AI Insights Section */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm h-10 w-10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-900">AI App Insights</h3>
                    <p className="text-sm text-indigo-700">Intelligent compatibility checks and optimization tips.</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={runAIScan}
                  disabled={loadingAi}
                >
                  {loadingAi ? <RefreshCw className="w-4 h-4 mr-2 animate-spin"/> : <Brain className="w-4 h-4 mr-2"/>}
                  {loadingAi ? 'Analyzing...' : 'Run Analysis'}
                </Button>
              </div>

              {aiInsights && (
                <div className="mt-4 grid md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-white/60 p-3 rounded-lg border border-indigo-100">
                    <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3"/> Compatibility
                    </h4>
                    <ul className="space-y-2">
                      {aiInsights.compatibility_issues.map((issue, i) => (
                        <li key={i} className="text-xs">
                          <span className="font-semibold text-slate-700">{issue.app}:</span> {issue.issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg border border-indigo-100">
                    <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3"/> Update Strategy
                    </h4>
                    <p className="text-xs text-slate-700 font-medium">{aiInsights.update_strategy.recommendation}</p>
                    <p className="text-xs text-slate-500 mt-1">{aiInsights.update_strategy.reason}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg border border-indigo-100">
                    <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2 flex items-center gap-1">
                      <RotateCcw className="w-3 h-3"/> Optimization
                    </h4>
                    <ul className="space-y-2">
                      {aiInsights.module_recommendations.map((rec, i) => (
                        <li key={i} className="text-xs text-slate-600">
                          • {rec.suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search installed apps..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
            </div>
          </div>

          <div className="grid gap-4">
            {apps?.map(app => (
              <Card key={app.id} className="bg-white">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Package className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-900">{app.app_name || 'Unknown App'}</h3>
                        <Badge variant={app.status === 'Installed' ? 'default' : 'secondary'} 
                          className={app.status === 'Installed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                          {app.status || 'Unknown'}
                        </Badge>
                        {app.compatibility_status === 'Warning' && (
                          <Badge variant="outline" className="text-amber-600 border-amber-200">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Check Compatibility
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        Version {app.version} • Installed on {new Date(app.last_updated).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {app.modules_installed?.map(mod => (
                          <span key={mod} className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewLogs(app)}>
                      <FileText className="w-4 h-4 mr-2" /> Logs
                    </Button>

                    <FeedbackModal 
                        appName={app.app_name}
                        trigger={
                            <Button variant="ghost" size="sm">
                                <MessageSquare className="w-4 h-4 mr-2" /> Feedback
                            </Button>
                        } 
                    />
                    
                    {userRole !== 'App Viewer' && (
                      <Button variant="outline" size="sm" onClick={() => handleUpdate(app.id)}>
                        <RefreshCw className="w-4 h-4 mr-2" /> Update
                      </Button>
                    )}
                    
                    {userRole === 'App Administrator' && (
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleUninstall(app.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Uninstall
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cicd">
           <CICDPipeline />
        </TabsContent>

        <TabsContent value="permissions">
           <AppPermissions />
        </TabsContent>

        <TabsContent value="performance">
           <AppPerformanceDashboard />
        </TabsContent>

        <TabsContent value="discovery">
           <AppDiscoveryPanel />
        </TabsContent>

        <TabsContent value="audit">
           <AppAuditLogPanel />
        </TabsContent>
      </Tabs>

      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Installation Logs: {selectedAppLogs?.app.app_name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] rounded-md border p-4 bg-slate-50 font-mono text-xs">
            <div className="space-y-2">
              {selectedAppLogs?.logs.map((log, idx) => (
                <div key={idx} className="flex gap-3 border-b border-slate-100 pb-2 last:border-0">
                  <span className="text-slate-400 w-32 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <div className="flex-1">
                    <span className={`font-bold mr-2 ${
                      log.level === 'Error' ? 'text-red-600' : 
                      log.level === 'Warning' ? 'text-amber-600' : 'text-blue-600'
                    }`}>[{log.level}]</span>
                    <span className="text-slate-600 mr-2">[{log.step}]</span>
                    <span className="text-slate-900">{log.message}</span>
                    {log.details && (
                      <pre className="mt-1 p-2 bg-slate-100 rounded text-slate-600 overflow-x-auto">
                        {log.details}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}