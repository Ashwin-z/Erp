import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { 
  DollarSign, TrendingUp, Users, Clock, Target, Download, 
  CheckCircle2, AlertTriangle, Calendar, BarChart3
} from 'lucide-react';
import moment from 'moment';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ProjectReportingDashboard() {
  const [dateRange, setDateRange] = useState('all');

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list()
  });

  const { data: timeEntries = [] } = useQuery({
    queryKey: ['all-time-entries'],
    queryFn: () => base44.entities.TimeEntry.list()
  });

  const { data: allocations = [] } = useQuery({
    queryKey: ['all-allocations'],
    queryFn: () => base44.entities.ResourceAllocation.list()
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['all-project-tasks'],
    queryFn: () => base44.entities.ProjectTask.list()
  });

  // Profitability Analysis
  const profitabilityData = useMemo(() => {
    return projects.map(p => ({
      name: p.name?.substring(0, 15) || 'Unnamed',
      budget: p.budget || 0,
      spent: p.spent || 0,
      profit: (p.budget || 0) - (p.spent || 0),
      profitMargin: p.budget ? (((p.budget - (p.spent || 0)) / p.budget) * 100).toFixed(1) : 0
    })).slice(0, 10);
  }, [projects]);

  // Resource Utilization
  const resourceUtilization = useMemo(() => {
    const userHours = {};
    timeEntries.forEach(entry => {
      if (!userHours[entry.user_name]) {
        userHours[entry.user_name] = { name: entry.user_name, billable: 0, nonBillable: 0, total: 0 };
      }
      userHours[entry.user_name].total += entry.hours || 0;
      if (entry.billable) {
        userHours[entry.user_name].billable += entry.hours || 0;
      } else {
        userHours[entry.user_name].nonBillable += entry.hours || 0;
      }
    });
    return Object.values(userHours).map(u => ({
      ...u,
      utilization: u.total > 0 ? ((u.billable / u.total) * 100).toFixed(1) : 0
    }));
  }, [timeEntries]);

  // Task Completion Timeline
  const taskCompletionData = useMemo(() => {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const month = moment().subtract(i, 'months');
      const monthTasks = tasks.filter(t => moment(t.completed_date).isSame(month, 'month'));
      last6Months.push({
        month: month.format('MMM'),
        completed: monthTasks.length,
        onTime: monthTasks.filter(t => !t.due_date || moment(t.completed_date).isSameOrBefore(t.due_date)).length,
        late: monthTasks.filter(t => t.due_date && moment(t.completed_date).isAfter(t.due_date)).length
      });
    }
    return last6Months;
  }, [tasks]);

  // Project Status Summary
  const statusSummary = useMemo(() => {
    const counts = { planning: 0, in_progress: 0, on_hold: 0, completed: 0, cancelled: 0 };
    projects.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });
    return Object.entries(counts).map(([status, count]) => ({ name: status.replace('_', ' '), value: count }));
  }, [projects]);

  // KPIs
  const kpis = useMemo(() => {
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
    const avgProgress = projects.length > 0 ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length : 0;
    const totalHours = timeEntries.reduce((sum, e) => sum + (e.hours || 0), 0);
    const billableHours = timeEntries.filter(e => e.billable).reduce((sum, e) => sum + (e.hours || 0), 0);
    
    return {
      totalBudget,
      totalSpent,
      profitMargin: totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget * 100).toFixed(1) : 0,
      avgProgress: avgProgress.toFixed(0),
      totalHours,
      billableRate: totalHours > 0 ? ((billableHours / totalHours) * 100).toFixed(1) : 0,
      activeProjects: projects.filter(p => p.status === 'in_progress').length,
      completedTasks: tasks.filter(t => t.status === 'completed').length
    };
  }, [projects, timeEntries, tasks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-violet-600" />Project Reports
        </h2>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <DollarSign className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-700">${(kpis.totalBudget / 1000).toFixed(0)}K</p>
            <p className="text-sm text-blue-600">Total Budget</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <TrendingUp className="w-8 h-8 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold text-emerald-700">{kpis.profitMargin}%</p>
            <p className="text-sm text-emerald-600">Profit Margin</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
          <CardContent className="p-4">
            <Users className="w-8 h-8 text-violet-600 mb-2" />
            <p className="text-2xl font-bold text-violet-700">{kpis.billableRate}%</p>
            <p className="text-sm text-violet-600">Billable Rate</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <Target className="w-8 h-8 text-amber-600 mb-2" />
            <p className="text-2xl font-bold text-amber-700">{kpis.avgProgress}%</p>
            <p className="text-sm text-amber-600">Avg Progress</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profitability">
        <TabsList>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="tasks">Task Completion</TabsTrigger>
          <TabsTrigger value="status">Status Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="profitability" className="mt-4">
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-base">Budget vs Spent by Project</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={profitabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${v/1000}K`} />
                  <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="budget" name="Budget" fill="#3b82f6" />
                  <Bar dataKey="spent" name="Spent" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-4">
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-base">Resource Utilization</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={resourceUtilization} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" unit="h" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="billable" name="Billable" stackId="a" fill="#10b981" />
                  <Bar dataKey="nonBillable" name="Non-Billable" stackId="a" fill="#94a3b8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <Card className="border-slate-200">
            <CardHeader><CardTitle className="text-base">Task Completion Timeline</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" name="Completed" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="onTime" name="On Time" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="late" name="Late" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader><CardTitle className="text-base">Project Status Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusSummary} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                      {statusSummary.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardHeader><CardTitle className="text-base">Summary Stats</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Active Projects', value: kpis.activeProjects, icon: Clock, color: 'blue' },
                  { label: 'Completed Tasks', value: kpis.completedTasks, icon: CheckCircle2, color: 'emerald' },
                  { label: 'Total Hours Logged', value: `${kpis.totalHours.toFixed(0)}h`, icon: Clock, color: 'violet' },
                  { label: 'Total Spent', value: `$${(kpis.totalSpent / 1000).toFixed(0)}K`, icon: DollarSign, color: 'amber' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <span className="font-bold">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}