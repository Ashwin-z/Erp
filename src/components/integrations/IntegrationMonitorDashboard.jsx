import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  RefreshCw, CheckCircle2, XCircle, AlertTriangle, Clock, 
  Activity, TrendingUp, Bell, BellOff, Settings, Eye,
  Loader2, PlayCircle, PauseCircle, RotateCcw, Download
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const sampleIntegrations = [
  { id: 1, name: 'DBS Bank', category: 'Banking', status: 'healthy', lastSync: new Date(Date.now() - 1000 * 60 * 5), nextSync: new Date(Date.now() + 1000 * 60 * 55), recordsSynced: 234, syncFrequency: 'hourly', uptime: 99.9 },
  { id: 2, name: 'Stripe', category: 'Payments', status: 'healthy', lastSync: new Date(Date.now() - 1000 * 60 * 15), nextSync: new Date(Date.now() + 1000 * 60 * 45), recordsSynced: 89, syncFrequency: 'hourly', uptime: 100 },
  { id: 3, name: 'Google Workspace', category: 'Productivity', status: 'warning', lastSync: new Date(Date.now() - 1000 * 60 * 120), nextSync: new Date(Date.now() + 1000 * 60 * 60), recordsSynced: 45, syncFrequency: 'hourly', uptime: 95.5, warning: 'Rate limit approaching' },
  { id: 4, name: 'Xero', category: 'Accounting', status: 'error', lastSync: new Date(Date.now() - 1000 * 60 * 60 * 3), nextSync: null, recordsSynced: 0, syncFrequency: 'daily', uptime: 85.2, error: 'Authentication token expired' },
];

const sampleSyncHistory = [
  { id: 1, integration: 'DBS Bank', status: 'success', startedAt: new Date(Date.now() - 1000 * 60 * 5), duration: 12, recordsSynced: 234, type: 'auto' },
  { id: 2, integration: 'Stripe', status: 'success', startedAt: new Date(Date.now() - 1000 * 60 * 15), duration: 8, recordsSynced: 89, type: 'auto' },
  { id: 3, integration: 'Google Workspace', status: 'partial', startedAt: new Date(Date.now() - 1000 * 60 * 120), duration: 45, recordsSynced: 45, recordsFailed: 3, type: 'auto', warning: 'Some records skipped' },
  { id: 4, integration: 'Xero', status: 'failed', startedAt: new Date(Date.now() - 1000 * 60 * 60 * 3), duration: 0, error: 'Authentication token expired', type: 'auto' },
  { id: 5, integration: 'DBS Bank', status: 'success', startedAt: new Date(Date.now() - 1000 * 60 * 65), duration: 15, recordsSynced: 198, type: 'auto' },
  { id: 6, integration: 'Stripe', status: 'success', startedAt: new Date(Date.now() - 1000 * 60 * 75), duration: 6, recordsSynced: 72, type: 'manual' },
];

const statusConfig = {
  healthy: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100', label: 'Healthy' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Warning' },
  error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'Error' },
  syncing: { icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Syncing' },
};

const syncStatusConfig = {
  success: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  partial: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  running: { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-100' },
};

export default function IntegrationMonitorDashboard({ integrations: connectedIntegrations }) {
  const [integrations, setIntegrations] = useState(sampleIntegrations);
  const [syncHistory, setSyncHistory] = useState(sampleSyncHistory);
  const [syncing, setSyncing] = useState({});
  const [notifications, setNotifications] = useState(true);
  const [autoRetry, setAutoRetry] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [detailModal, setDetailModal] = useState(null);

  // Calculate stats
  const stats = {
    total: integrations.length,
    healthy: integrations.filter(i => i.status === 'healthy').length,
    warning: integrations.filter(i => i.status === 'warning').length,
    error: integrations.filter(i => i.status === 'error').length,
    totalSynced: integrations.reduce((sum, i) => sum + i.recordsSynced, 0),
    avgUptime: (integrations.reduce((sum, i) => sum + i.uptime, 0) / integrations.length).toFixed(1)
  };

  const handleResync = async (integration) => {
    setSyncing(prev => ({ ...prev, [integration.id]: true }));
    toast.info(`Syncing ${integration.name}...`);
    
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrations(prev => prev.map(i => 
      i.id === integration.id 
        ? { ...i, status: 'healthy', lastSync: new Date(), error: null, warning: null }
        : i
    ));
    
    setSyncHistory(prev => [{
      id: Date.now(),
      integration: integration.name,
      status: 'success',
      startedAt: new Date(),
      duration: 2,
      recordsSynced: Math.floor(Math.random() * 100) + 50,
      type: 'manual'
    }, ...prev]);
    
    setSyncing(prev => ({ ...prev, [integration.id]: false }));
    toast.success(`${integration.name} synced successfully`);
  };

  const handleResyncAll = async () => {
    const failedIntegrations = integrations.filter(i => i.status === 'error' || i.status === 'warning');
    for (const integration of failedIntegrations) {
      await handleResync(integration);
    }
  };

  const filteredIntegrations = integrations.filter(i => 
    filterStatus === 'all' || i.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-slate-500">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.healthy}</p>
                <p className="text-sm text-slate-500">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.warning}</p>
                <p className="text-sm text-slate-500">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.error}</p>
                <p className="text-sm text-slate-500">Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgUptime}%</p>
                <p className="text-sm text-slate-500">Avg Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {stats.error > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-red-700">{stats.error} Integration{stats.error > 1 ? 's' : ''} Require Attention</p>
                  <p className="text-sm text-red-600">Some integrations have failed to sync. Click to resync all failed integrations.</p>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleResyncAll}>
                <RotateCcw className="w-4 h-4 mr-2" />Resync All Failed
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="status" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="status">Integration Status</TabsTrigger>
            <TabsTrigger value="history">Sync History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="status">
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Integration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Next Sync</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIntegrations.map((integration) => {
                    const StatusIcon = statusConfig[integration.status].icon;
                    const isSyncing = syncing[integration.id];
                    
                    return (
                      <TableRow key={integration.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">
                              {integration.name === 'DBS Bank' ? '🏦' : 
                               integration.name === 'Stripe' ? '💳' :
                               integration.name === 'Google Workspace' ? '📅' : '📊'}
                            </div>
                            <div>
                              <p className="font-medium">{integration.name}</p>
                              <p className="text-sm text-slate-500">{integration.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg ${statusConfig[integration.status].bg} flex items-center justify-center`}>
                              <StatusIcon className={`w-4 h-4 ${statusConfig[integration.status].color}`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{statusConfig[integration.status].label}</p>
                              {integration.error && <p className="text-xs text-red-600">{integration.error}</p>}
                              {integration.warning && <p className="text-xs text-amber-600">{integration.warning}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {moment(integration.lastSync).fromNow()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {integration.nextSync ? (
                            <span className="text-sm text-slate-600">{moment(integration.nextSync).fromNow()}</span>
                          ) : (
                            <span className="text-sm text-red-500">Paused</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{integration.recordsSynced}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={integration.uptime} className="w-16 h-2" />
                            <span className="text-sm">{integration.uptime}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setDetailModal(integration)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleResync(integration)}
                              disabled={isSyncing}
                            >
                              {isSyncing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <RefreshCw className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sync History</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />Export Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Integration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncHistory.map((sync) => {
                    const StatusIcon = syncStatusConfig[sync.status].icon;
                    return (
                      <TableRow key={sync.id}>
                        <TableCell className="font-medium">{sync.integration}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${syncStatusConfig[sync.status].bg}`}>
                            <StatusIcon className={`w-3 h-3 ${syncStatusConfig[sync.status].color}`} />
                            <span className={`text-xs font-medium ${syncStatusConfig[sync.status].color}`}>
                              {sync.status.charAt(0).toUpperCase() + sync.status.slice(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{moment(sync.startedAt).format('DD MMM, HH:mm')}</TableCell>
                        <TableCell>{sync.duration}s</TableCell>
                        <TableCell>
                          {sync.recordsSynced !== undefined ? (
                            <span className="font-medium">{sync.recordsSynced}</span>
                          ) : '-'}
                          {sync.recordsFailed > 0 && (
                            <span className="text-red-500 text-sm ml-1">({sync.recordsFailed} failed)</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {sync.type === 'auto' ? 'Scheduled' : 'Manual'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {sync.error || sync.warning || '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Sync Settings</CardTitle>
              <CardDescription>Configure global sync and notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border">
                    <Bell className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-medium">Error Notifications</p>
                    <p className="text-sm text-slate-500">Receive alerts when integrations fail</p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border">
                    <RotateCcw className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-medium">Auto Retry Failed Syncs</p>
                    <p className="text-sm text-slate-500">Automatically retry failed syncs after 15 minutes</p>
                  </div>
                </div>
                <Switch checked={autoRetry} onCheckedChange={setAutoRetry} />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border">
                    <Clock className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-medium">Default Sync Frequency</p>
                    <p className="text-sm text-slate-500">How often integrations should sync by default</p>
                  </div>
                </div>
                <Select defaultValue="hourly">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="15min">Every 15 min</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-2xl">
                {detailModal?.name === 'DBS Bank' ? '🏦' : 
                 detailModal?.name === 'Stripe' ? '💳' :
                 detailModal?.name === 'Google Workspace' ? '📅' : '📊'}
              </span>
              {detailModal?.name}
            </DialogTitle>
          </DialogHeader>
          {detailModal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {React.createElement(statusConfig[detailModal.status].icon, { 
                      className: `w-4 h-4 ${statusConfig[detailModal.status].color}` 
                    })}
                    <span className="font-medium">{statusConfig[detailModal.status].label}</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Uptime</p>
                  <p className="font-medium mt-1">{detailModal.uptime}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Last Sync</p>
                  <p className="font-medium mt-1">{moment(detailModal.lastSync).fromNow()}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Frequency</p>
                  <p className="font-medium mt-1 capitalize">{detailModal.syncFrequency}</p>
                </div>
              </div>
              
              {detailModal.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-700">Error</p>
                  <p className="text-sm text-red-600">{detailModal.error}</p>
                </div>
              )}
              
              {detailModal.warning && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-medium text-amber-700">Warning</p>
                  <p className="text-sm text-amber-600">{detailModal.warning}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-lime-600 hover:bg-lime-700"
                  onClick={() => { handleResync(detailModal); setDetailModal(null); }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />Sync Now
                </Button>
                <Button variant="outline" className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />Configure
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}