import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Headphones, Plus, Search, AlertCircle, Clock, CheckCircle2,
  MessageSquare, User, Sparkles, TrendingUp, Filter
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SOPGuide from '../components/modules/SOPGuide';
import ModuleDashboard from '../components/modules/ModuleDashboard';

const serviceSOP = {
  title: "Service Desk Workflow",
  description: "Receive → Triage → Assign → Resolve → Close",
  steps: [
    { name: "Receive", description: "Capture ticket from any channel.", checklist: ["Log ticket", "Capture details", "Auto-categorize", "Acknowledge receipt"] },
    { name: "Triage", description: "Assess priority and assign SLA.", checklist: ["Review details", "Set priority", "Assign SLA", "Route to queue"] },
    { name: "Assign", description: "Assign to appropriate team/agent.", checklist: ["Check availability", "Match skills", "Assign agent", "Notify assignee"] },
    { name: "Resolve", description: "Work on and resolve the ticket.", checklist: ["Investigate issue", "Apply solution", "Test resolution", "Document fix"] },
    { name: "Close", description: "Close ticket and collect feedback.", checklist: ["Confirm resolution", "Update knowledge base", "Send survey", "Close ticket"] }
  ]
};

export default function ServiceDesk() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const stats = [
    { label: 'Open Tickets', value: 45, icon: Headphones, color: 'bg-blue-500', trend: -8 },
    { label: 'Avg Response', value: '15m', icon: Clock, color: 'bg-green-500', trend: -25 },
    { label: 'SLA Compliance', value: '96%', icon: CheckCircle2, color: 'bg-purple-500', trend: 3 },
    { label: 'CSAT Score', value: '4.7', icon: TrendingUp, color: 'bg-amber-500', trend: 5 }
  ];

  const tickets = [
    { id: 'TKT-2024-456', title: 'Unable to access dashboard', category: 'incident', priority: 'high', status: 'in_progress', requester: 'john@techstart.com', assigned: 'Sarah Chen', created: '2 hours ago', sla: 85 },
    { id: 'TKT-2024-455', title: 'Request for new user access', category: 'request', priority: 'medium', status: 'pending', requester: 'lisa@marina.com', assigned: 'Mike Tan', created: '4 hours ago', sla: 60 },
    { id: 'TKT-2024-454', title: 'Report generation error', category: 'incident', priority: 'critical', status: 'new', requester: 'admin@global.com', assigned: null, created: '30 mins ago', sla: 95 },
    { id: 'TKT-2024-453', title: 'Feature request: Export to PDF', category: 'request', priority: 'low', status: 'resolved', requester: 'david@skyline.com', assigned: 'Emily Wong', created: '1 day ago', sla: 100 },
    { id: 'TKT-2024-452', title: 'Integration sync failure', category: 'problem', priority: 'high', status: 'in_progress', requester: 'ops@eastern.com', assigned: 'John Lee', created: '6 hours ago', sla: 45 }
  ];

  const priorityColors = {
    low: 'bg-slate-100 text-slate-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-amber-100 text-amber-700',
    critical: 'bg-red-100 text-red-700'
  };

  const statusColors = {
    new: 'bg-purple-100 text-purple-700',
    assigned: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-amber-100 text-amber-700',
    pending: 'bg-slate-100 text-slate-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-slate-100 text-slate-700'
  };

  const categoryIcons = {
    incident: AlertCircle,
    request: MessageSquare,
    problem: Headphones,
    change: TrendingUp
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
                <h1 className="text-2xl font-bold text-slate-900">Service Desk</h1>
                <p className="text-slate-500">IT Service Management with SLA tracking and AI assistance</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Assist
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </div>
            </div>

            <SOPGuide {...serviceSOP} />
            <ModuleDashboard stats={stats} />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tickets..."
                  className="pl-10"
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Tickets Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>SLA</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map(ticket => {
                      const Icon = categoryIcons[ticket.category];
                      return (
                        <TableRow key={ticket.id} className="cursor-pointer hover:bg-slate-50">
                          <TableCell>
                            <div>
                              <p className="font-mono text-sm font-medium">{ticket.id}</p>
                              <p className="text-sm text-slate-600">{ticket.title}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-slate-400" />
                              <span className="capitalize">{ticket.category}</span>
                            </div>
                          </TableCell>
                          <TableCell><Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge></TableCell>
                          <TableCell><Badge className={statusColors[ticket.status]}>{ticket.status.replace('_', ' ')}</Badge></TableCell>
                          <TableCell className="text-sm">{ticket.requester}</TableCell>
                          <TableCell>
                            {ticket.assigned ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                                  <User className="w-3 h-3" />
                                </div>
                                <span className="text-sm">{ticket.assigned}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-sm">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="w-20">
                              <div className="flex justify-between text-xs mb-1">
                                <span className={ticket.sla < 50 ? 'text-red-600' : 'text-slate-500'}>{ticket.sla}%</span>
                              </div>
                              <Progress value={ticket.sla} className={`h-1.5 ${ticket.sla < 50 ? 'bg-red-100' : ''}`} />
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">{ticket.created}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}