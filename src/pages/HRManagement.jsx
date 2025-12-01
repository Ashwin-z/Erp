import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users, Plus, Search, Calendar, Clock, Award,
  Briefcase, GraduationCap, TrendingUp, FileText
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ModuleDashboard from '../components/modules/ModuleDashboard';

export default function HRManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('employees');

  const stats = [
    { label: 'Total Employees', value: 156, icon: Users, color: 'bg-blue-500', trend: 5 },
    { label: 'On Leave Today', value: 8, icon: Calendar, color: 'bg-amber-500', trend: 0 },
    { label: 'Open Positions', value: 12, icon: Briefcase, color: 'bg-purple-500', trend: 25 },
    { label: 'Avg Tenure', value: '2.4y', icon: Award, color: 'bg-green-500', trend: 8 }
  ];

  const employees = [
    { id: 1, name: 'Sarah Chen', email: 'sarah@arkfinex.com', department: 'Finance', position: 'CFO', status: 'active', startDate: '2021-03-15' },
    { id: 2, name: 'John Lee', email: 'john@arkfinex.com', department: 'Engineering', position: 'CTO', status: 'active', startDate: '2020-06-01' },
    { id: 3, name: 'Emily Wong', email: 'emily@arkfinex.com', department: 'Sales', position: 'Sales Manager', status: 'active', startDate: '2022-01-10' },
    { id: 4, name: 'Mike Tan', email: 'mike@arkfinex.com', department: 'Operations', position: 'Operations Lead', status: 'on_leave', startDate: '2021-09-20' },
    { id: 5, name: 'Lisa Ng', email: 'lisa@arkfinex.com', department: 'HR', position: 'HR Manager', status: 'active', startDate: '2022-05-15' }
  ];

  const leaveRequests = [
    { id: 1, employee: 'Mike Tan', type: 'Annual Leave', from: '2024-12-23', to: '2024-12-27', days: 5, status: 'approved' },
    { id: 2, employee: 'Emily Wong', type: 'Sick Leave', from: '2024-12-20', to: '2024-12-20', days: 1, status: 'pending' },
    { id: 3, employee: 'John Lee', type: 'Personal', from: '2024-12-30', to: '2024-12-31', days: 2, status: 'pending' }
  ];

  const timeEntries = [
    { employee: 'Sarah Chen', project: 'Q4 Financial Close', hours: 8.5, date: 'Today', billable: true },
    { employee: 'Emily Wong', project: 'TechStart Demo', hours: 3.0, date: 'Today', billable: true },
    { employee: 'John Lee', project: 'System Upgrade', hours: 6.5, date: 'Today', billable: false }
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    on_leave: 'bg-amber-100 text-amber-700',
    terminated: 'bg-red-100 text-red-700'
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1800px] mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">HR Management</h1>
                <p className="text-slate-500">Employee directory, leave management, and timesheets</p>
              </div>
              <Button className="bg-lime-500 hover:bg-lime-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>

            <ModuleDashboard stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="employees">Employees</TabsTrigger>
                <TabsTrigger value="leave">Leave Management</TabsTrigger>
                <TabsTrigger value="timesheet">Timesheets</TabsTrigger>
                <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
              </TabsList>

              <TabsContent value="employees">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Employee Directory</CardTitle>
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search employees..." className="pl-10" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {employees.map(emp => (
                        <div key={emp.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback>{emp.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{emp.name}</p>
                              <p className="text-sm text-slate-500">{emp.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-center">
                              <p className="text-sm font-medium">{emp.department}</p>
                              <p className="text-xs text-slate-500">Department</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">{emp.position}</p>
                              <p className="text-xs text-slate-500">Position</p>
                            </div>
                            <Badge className={statusColors[emp.status]}>{emp.status.replace('_', ' ')}</Badge>
                            <Button variant="outline" size="sm">View Profile</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leave">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Leave Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {leaveRequests.map(req => (
                        <div key={req.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{req.employee}</p>
                              <p className="text-sm text-slate-500">{req.type} • {req.days} day(s)</p>
                              <p className="text-sm text-slate-500">{req.from} to {req.to}</p>
                            </div>
                            <div>
                              {req.status === 'pending' ? (
                                <div className="flex gap-2">
                                  <Button size="sm" className="bg-green-500">Approve</Button>
                                  <Button size="sm" variant="outline">Reject</Button>
                                </div>
                              ) : (
                                <Badge className="bg-green-100 text-green-700">{req.status}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Leave Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-slate-400">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Leave calendar view</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="timesheet">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Time Entries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timeEntries.map((entry, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="font-medium">{entry.employee}</p>
                              <p className="text-sm text-slate-500">{entry.project}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-lg font-bold">{entry.hours}h</p>
                            <Badge className={entry.billable ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}>
                              {entry.billable ? 'Billable' : 'Non-billable'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}