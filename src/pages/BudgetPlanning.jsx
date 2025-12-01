import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign, Plus, TrendingUp, TrendingDown, PieChart,
  Calendar, AlertTriangle, CheckCircle2, BarChart3
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ModuleDashboard from '../components/modules/ModuleDashboard';

export default function BudgetPlanning() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Budget', value: '$2.4M', icon: DollarSign, color: 'bg-blue-500', trend: 0 },
    { label: 'Spent YTD', value: '$1.8M', icon: TrendingDown, color: 'bg-purple-500', trend: -5 },
    { label: 'Available', value: '$600K', icon: TrendingUp, color: 'bg-green-500', trend: 0 },
    { label: 'Utilization', value: '75%', icon: PieChart, color: 'bg-amber-500', trend: 8 }
  ];

  const departments = [
    { name: 'Engineering', budgeted: 800000, spent: 620000, committed: 50000, utilization: 84, trend: 'on_track' },
    { name: 'Sales & Marketing', budgeted: 600000, spent: 480000, committed: 80000, utilization: 93, trend: 'at_risk' },
    { name: 'Operations', budgeted: 400000, spent: 280000, committed: 40000, utilization: 80, trend: 'on_track' },
    { name: 'Finance', budgeted: 300000, spent: 220000, committed: 20000, utilization: 80, trend: 'on_track' },
    { name: 'HR', budgeted: 200000, spent: 140000, committed: 30000, utilization: 85, trend: 'on_track' },
    { name: 'IT', budgeted: 100000, spent: 60000, committed: 25000, utilization: 85, trend: 'under' }
  ];

  const trendColors = {
    on_track: 'bg-green-100 text-green-700',
    at_risk: 'bg-amber-100 text-amber-700',
    over: 'bg-red-100 text-red-700',
    under: 'bg-blue-100 text-blue-700'
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
                <h1 className="text-2xl font-bold text-slate-900">Budget Planning</h1>
                <p className="text-slate-500">Oracle-style budget management with variance analysis</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  FY 2024
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Budget
                </Button>
              </div>
            </div>

            <ModuleDashboard stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="departments">By Department</TabsTrigger>
                <TabsTrigger value="projects">By Project</TabsTrigger>
                <TabsTrigger value="variance">Variance Analysis</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Departments Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map(dept => {
                const available = dept.budgeted - dept.spent - dept.committed;
                return (
                  <Card key={dept.name}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{dept.name}</CardTitle>
                        <Badge className={trendColors[dept.trend]}>{dept.trend.replace('_', ' ')}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500">Utilization</span>
                          <span className="font-medium">{dept.utilization}%</span>
                        </div>
                        <Progress value={dept.utilization} className={`h-2 ${dept.utilization > 90 ? 'bg-red-100' : ''}`} />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Budgeted</span>
                          <span className="font-medium">${(dept.budgeted / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Spent</span>
                          <span className="font-medium text-red-600">${(dept.spent / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Committed</span>
                          <span className="font-medium text-amber-600">${(dept.committed / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-slate-500">Available</span>
                          <span className="font-medium text-green-600">${(available / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Monthly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-400">
                  <BarChart3 className="w-12 h-12 mr-4 opacity-50" />
                  <span>Budget vs Actual chart</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}