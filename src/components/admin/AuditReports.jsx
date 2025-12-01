import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Download, FileText, CalendarIcon, Filter, 
  Shield, UserPlus, UserMinus, Edit, Trash2, Eye,
  AlertTriangle, CheckCircle2, Clock, BarChart3, PieChart
} from 'lucide-react';
import { format, subDays, isWithinInterval } from 'date-fns';
import { toast } from 'sonner';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell
} from 'recharts';

const ACTION_TYPES = [
  { id: 'permission_granted', label: 'Permission Granted', icon: CheckCircle2, color: 'bg-green-500' },
  { id: 'permission_revoked', label: 'Permission Revoked', icon: UserMinus, color: 'bg-red-500' },
  { id: 'role_changed', label: 'Role Changed', icon: Edit, color: 'bg-blue-500' },
  { id: 'user_created', label: 'User Created', icon: UserPlus, color: 'bg-purple-500' },
  { id: 'user_deleted', label: 'User Deleted', icon: Trash2, color: 'bg-red-600' },
  { id: 'module_access_changed', label: 'Module Access Changed', icon: Shield, color: 'bg-amber-500' },
  { id: 'department_changed', label: 'Department Changed', icon: Edit, color: 'bg-cyan-500' }
];

const MODULES = ['Overview', 'Operations', 'Finance', 'Compliance', 'Human Resource', 'Tools', 'Manage', 'Account'];

// Sample audit data
const sampleAuditLogs = [
  { id: '1', timestamp: new Date('2025-01-25T10:30:00'), user: 'net28528@gmail.com', performedBy: 'net28528@gmail.com', action: 'user_created', target: 'sarah@arkfinex.com', module: 'Manage', details: 'Created new user Sarah Chen', severity: 'info' },
  { id: '2', timestamp: new Date('2025-01-25T11:15:00'), user: 'sarah@arkfinex.com', performedBy: 'net28528@gmail.com', action: 'permission_granted', target: 'Finance Module', module: 'Finance', details: 'Granted full access to Finance module', severity: 'info' },
  { id: '3', timestamp: new Date('2025-01-24T09:00:00'), user: 'john@arkfinex.com', performedBy: 'net28528@gmail.com', action: 'role_changed', target: 'Department Head', module: 'Manage', details: 'Promoted to Department Head', severity: 'warning' },
  { id: '4', timestamp: new Date('2025-01-24T14:30:00'), user: 'mike@arkfinex.com', performedBy: 'sarah@arkfinex.com', action: 'module_access_changed', target: 'HR Module', module: 'Human Resource', details: 'Added HR module access', severity: 'info' },
  { id: '5', timestamp: new Date('2025-01-23T16:00:00'), user: 'anna@arkfinex.com', performedBy: 'john@arkfinex.com', action: 'permission_revoked', target: 'Admin Panel', module: 'Manage', details: 'Removed admin panel access', severity: 'warning' },
  { id: '6', timestamp: new Date('2025-01-22T08:45:00'), user: 'test@arkfinex.com', performedBy: 'net28528@gmail.com', action: 'user_deleted', target: 'test@arkfinex.com', module: 'Manage', details: 'Deleted inactive user account', severity: 'critical' },
  { id: '7', timestamp: new Date('2025-01-21T11:00:00'), user: 'mike@arkfinex.com', performedBy: 'net28528@gmail.com', action: 'department_changed', target: 'IT to HR', module: 'Manage', details: 'Transferred to HR department', severity: 'info' },
  { id: '8', timestamp: new Date('2025-01-20T13:20:00'), user: 'sarah@arkfinex.com', performedBy: 'net28528@gmail.com', action: 'permission_granted', target: 'Compliance Module', module: 'Compliance', details: 'Granted read access to Compliance', severity: 'info' },
];

export default function AuditReports({ tenantId }) {
  const [auditLogs] = useState(sampleAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [dateRange, setDateRange] = useState({ from: subDays(new Date(), 30), to: new Date() });
  const [activeTab, setActiveTab] = useState('logs');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           log.target.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUser = filterUser === 'all' || log.user === filterUser;
      const matchesAction = filterAction === 'all' || log.action === filterAction;
      const matchesModule = filterModule === 'all' || log.module === filterModule;
      const matchesDate = isWithinInterval(log.timestamp, { start: dateRange.from, end: dateRange.to });
      return matchesSearch && matchesUser && matchesAction && matchesModule && matchesDate;
    });
  }, [auditLogs, searchQuery, filterUser, filterAction, filterModule, dateRange]);

  const uniqueUsers = [...new Set(auditLogs.map(l => l.user))];

  // Analytics data
  const actionCounts = useMemo(() => {
    const counts = {};
    filteredLogs.forEach(log => {
      counts[log.action] = (counts[log.action] || 0) + 1;
    });
    return ACTION_TYPES.map(type => ({
      name: type.label,
      value: counts[type.id] || 0,
      color: type.color.replace('bg-', '')
    })).filter(d => d.value > 0);
  }, [filteredLogs]);

  const dailyActivity = useMemo(() => {
    const days = {};
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'MMM dd');
      days[date] = 0;
    }
    filteredLogs.forEach(log => {
      const date = format(log.timestamp, 'MMM dd');
      if (days[date] !== undefined) days[date]++;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count }));
  }, [filteredLogs]);

  const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#a855f7', '#dc2626', '#f59e0b', '#06b6d4'];

  const exportCSV = () => {
    const headers = ['Timestamp', 'User', 'Performed By', 'Action', 'Target', 'Module', 'Details', 'Severity'];
    const rows = filteredLogs.map(log => [
      format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      log.user,
      log.performedBy,
      ACTION_TYPES.find(a => a.id === log.action)?.label || log.action,
      log.target,
      log.module,
      log.details,
      log.severity
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('CSV report downloaded');
  };

  const exportPDF = () => {
    // Simulated PDF export - in production would use a library like jsPDF
    toast.success('PDF report generated and downloading...');
  };

  const getActionIcon = (actionId) => {
    const action = ACTION_TYPES.find(a => a.id === actionId);
    return action ? action.icon : Shield;
  };

  const getActionColor = (actionId) => {
    const action = ACTION_TYPES.find(a => a.id === actionId);
    return action ? action.color : 'bg-slate-500';
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      info: 'bg-blue-100 text-blue-700',
      warning: 'bg-amber-100 text-amber-700',
      critical: 'bg-red-100 text-red-700'
    };
    return <Badge className={styles[severity] || styles.info}>{severity}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-lime-600" />
          Audit Reports & Security Logs
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Generate Reports</TabsTrigger>
          </TabsList>

          {/* Filters - shown on all tabs */}
          <div className="grid grid-cols-5 gap-3 mb-4 p-4 bg-slate-50 rounded-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="pl-9"
              />
            </div>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger>
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {ACTION_TYPES.map(action => (
                  <SelectItem key={action.id} value={action.id}>{action.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger>
                <SelectValue placeholder="All Modules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {MODULES.map(mod => (
                  <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => range && setDateRange(range)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Audit Logs Tab */}
          <TabsContent value="logs">
            <div className="text-sm text-slate-500 mb-3">
              Showing {filteredLogs.length} of {auditLogs.length} logs
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map(log => {
                  const ActionIcon = getActionIcon(log.action);
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {format(log.timestamp, 'MMM dd, HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded ${getActionColor(log.action)} flex items-center justify-center`}>
                            <ActionIcon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm">{ACTION_TYPES.find(a => a.id === log.action)?.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.module}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{log.performedBy}</TableCell>
                      <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Activity Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#84cc16" fill="#84cc16" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Actions by Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPie>
                      <Pie
                        data={actionCounts}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {actionCounts.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm">Summary Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{filteredLogs.length}</p>
                      <p className="text-sm text-slate-500">Total Events</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {filteredLogs.filter(l => l.action === 'permission_granted').length}
                      </p>
                      <p className="text-sm text-slate-500">Permissions Granted</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">
                        {filteredLogs.filter(l => l.severity === 'warning').length}
                      </p>
                      <p className="text-sm text-slate-500">Warnings</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">
                        {filteredLogs.filter(l => l.severity === 'critical').length}
                      </p>
                      <p className="text-sm text-slate-500">Critical Events</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Generate Reports Tab */}
          <TabsContent value="reports">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={exportCSV}>
                    <FileText className="w-4 h-4 mr-2" />
                    Permission Changes (Last 7 Days)
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={exportCSV}>
                    <FileText className="w-4 h-4 mr-2" />
                    User Access Report (Last 30 Days)
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={exportCSV}>
                    <FileText className="w-4 h-4 mr-2" />
                    Security Events Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={exportCSV}>
                    <FileText className="w-4 h-4 mr-2" />
                    Compliance Audit Trail
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Custom Report Builder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Name</Label>
                    <Input placeholder="Enter report name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Include Columns</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Timestamp', 'User', 'Action', 'Target', 'Module', 'Severity'].map(col => (
                        <Badge key={col} variant="outline" className="cursor-pointer hover:bg-lime-50">
                          {col}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-lime-500 hover:bg-lime-600 flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Generate CSV
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}