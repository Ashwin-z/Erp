import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/shared/PageHeader';
import DataCard from '@/components/shared/DataCard';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, Plus, Search, Building2, CheckCircle2, Clock, 
  AlertTriangle, MoreVertical, Eye, Settings, Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const clients = [
  { id: 1, name: 'TechStart Pte Ltd', industry: 'Technology', status: 'active', tasks: 2, revenue: 12450, health: 'good' },
  { id: 2, name: 'Marina Foods Co.', industry: 'F&B', status: 'review', tasks: 5, revenue: 8920, health: 'warning' },
  { id: 3, name: 'Urban Retail Group', industry: 'Retail', status: 'active', tasks: 1, revenue: 24100, health: 'good' },
  { id: 4, name: 'Global Logistics SG', industry: 'Logistics', status: 'active', tasks: 0, revenue: 15600, health: 'good' },
  { id: 5, name: 'Skyline Properties', industry: 'Real Estate', status: 'onboarding', tasks: 8, revenue: 0, health: 'neutral' },
];

const statusConfig = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  review: { label: 'Needs Review', color: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
  onboarding: { label: 'Onboarding', color: 'bg-blue-100 text-blue-700', icon: Clock },
};

export default function ClientManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1800px] mx-auto space-y-6">
            
            <PageHeader
              title="Client Management"
              subtitle="Manage all client accounts"
              icon={Users}
              iconColor="text-violet-600"
              actions={
                <Button className="bg-violet-600 hover:bg-violet-700"><Plus className="w-4 h-4 mr-2" />Add Client</Button>
              }
            />

            {/* Summary */}
            <div className="grid grid-cols-4 gap-4">
              <DataCard label="Total Clients" value={clients.length.toString()} icon={Building2} iconBg="bg-violet-500" tooltip="All managed client accounts" />
              <DataCard label="Active" value={clients.filter(c => c.status === 'active').length.toString()} icon={CheckCircle2} iconBg="bg-emerald-500" tooltip="Clients with active status" />
              <DataCard label="Needs Review" value={clients.filter(c => c.status === 'review').length.toString()} icon={AlertTriangle} iconBg="bg-amber-500" alert tooltip="Clients requiring attention" />
              <DataCard label="Total MRR" value={`$${clients.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}`} icon={Users} iconBg="bg-blue-500" tooltip="Monthly recurring revenue from all clients" />
            </div>

            {/* Client List */}
            <Card className="border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">All Clients</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search clients..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="space-y-3">
                    {filteredClients.map((client, index) => {
                      const status = statusConfig[client.status];
                      return (
                        <motion.div
                          key={client.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-violet-100 text-violet-600 font-semibold">
                                  {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>Click to view {client.name} dashboard</TooltipContent>
                          </Tooltip>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{client.name}</span>
                              <Badge className={status.color}>
                                <status.icon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500">{client.industry}</p>
                          </div>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-center px-4">
                                <p className="text-lg font-bold text-slate-900">{client.tasks}</p>
                                <p className="text-xs text-slate-500">Open Tasks</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{client.tasks} tasks pending for this client</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-center px-4">
                                <p className="text-lg font-bold text-slate-900">${client.revenue.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">Monthly Revenue</p>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Monthly recurring revenue from {client.name}</TooltipContent>
                          </Tooltip>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Dashboard</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Client Settings</TooltipContent>
                            </Tooltip>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Client</DropdownMenuItem>
                                <DropdownMenuItem>View Reports</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Archive Client</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}