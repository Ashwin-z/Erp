import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase, Plus, Calendar, Clock, DollarSign, Users,
  AlertTriangle, CheckCircle2, Play, Pause, Eye, TrendingUp
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SOPGuide from '../components/modules/SOPGuide';
import ModuleDashboard from '../components/modules/ModuleDashboard';

const projectSOP = {
  title: "Project Management Workflow",
  description: "Planning → Execution → Monitoring → Closure",
  steps: [
    { name: "Planning", description: "Define scope, timeline, and resources.", checklist: ["Define objectives", "Create WBS", "Assign resources", "Set milestones"] },
    { name: "Execution", description: "Execute project tasks and deliverables.", checklist: ["Kickoff meeting", "Assign tasks", "Track progress", "Team coordination"] },
    { name: "Monitoring", description: "Track progress, budget, and risks.", checklist: ["Progress updates", "Budget tracking", "Risk assessment", "Status reports"] },
    { name: "Closure", description: "Complete and hand over project.", checklist: ["Final deliverables", "Client sign-off", "Lessons learned", "Archive docs"] }
  ]
};

export default function ProjectManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date', 50)
  });

  const stats = [
    { label: 'Active Projects', value: 8, icon: Briefcase, color: 'bg-blue-500', trend: 2 },
    { label: 'On Track', value: 6, icon: CheckCircle2, color: 'bg-green-500', trend: 0 },
    { label: 'At Risk', value: 2, icon: AlertTriangle, color: 'bg-amber-500', trend: 1 },
    { label: 'Total Budget', value: '$1.2M', icon: DollarSign, color: 'bg-purple-500', trend: 15 }
  ];

  const sampleProjects = projects.length > 0 ? projects : [
    { id: 1, project_code: 'PRJ-001', name: 'ERP Implementation', customer_name: 'TechStart Pte Ltd', status: 'in_progress', priority: 'high', progress: 35, budget: 150000, actual_cost: 45000, start_date: '2024-10-01', end_date: '2025-03-31', manager: 'Sarah Chen', ai_risk_score: 25 },
    { id: 2, project_code: 'PRJ-002', name: 'POS System Upgrade', customer_name: 'Marina Foods', status: 'in_progress', priority: 'medium', progress: 65, budget: 45000, actual_cost: 28000, start_date: '2024-11-01', end_date: '2025-01-31', manager: 'Michael Tan', ai_risk_score: 15 },
    { id: 3, project_code: 'PRJ-003', name: 'Warehouse Automation', customer_name: 'Global Logistics', status: 'planning', priority: 'high', progress: 5, budget: 280000, actual_cost: 0, start_date: '2025-01-15', end_date: '2025-06-30', manager: 'John Lee', ai_risk_score: 40 },
    { id: 4, project_code: 'PRJ-004', name: 'Mobile App Development', customer_name: 'Urban Retail', status: 'in_progress', priority: 'medium', progress: 80, budget: 75000, actual_cost: 58000, start_date: '2024-08-01', end_date: '2024-12-31', manager: 'Emily Wong', ai_risk_score: 10 }
  ];

  const statusColors = {
    planning: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-blue-100 text-blue-700',
    on_hold: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const priorityColors = {
    low: 'bg-slate-100 text-slate-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-amber-100 text-amber-700',
    critical: 'bg-red-100 text-red-700'
  };

  const getRiskColor = (score) => {
    if (score <= 25) return 'text-green-600';
    if (score <= 50) return 'text-amber-600';
    return 'text-red-600';
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
                <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
                <p className="text-slate-500">Track projects, milestones, and profitability with AI risk alerts</p>
              </div>
              <Button className="bg-lime-500 hover:bg-lime-600">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            <SOPGuide {...projectSOP} />
            <ModuleDashboard stats={stats} />

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {sampleProjects.map((project) => {
                const budgetUsed = project.budget > 0 ? (project.actual_cost / project.budget) * 100 : 0;
                return (
                  <Card key={project.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-500 font-mono">{project.project_code}</p>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <p className="text-sm text-slate-500">{project.customer_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={priorityColors[project.priority]}>{project.priority}</Badge>
                          <Badge className={statusColors[project.status]}>{project.status?.replace('_', ' ')}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      {/* Budget */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Budget Used</span>
                          <span className="font-medium">${project.actual_cost?.toLocaleString()} / ${project.budget?.toLocaleString()}</span>
                        </div>
                        <Progress value={budgetUsed} className={`h-2 ${budgetUsed > 90 ? 'bg-red-200' : ''}`} />
                      </div>

                      {/* Meta */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>{project.end_date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="w-4 h-4" />
                          <span>{project.manager}</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm ${getRiskColor(project.ai_risk_score)}`}>
                          <AlertTriangle className="w-4 h-4" />
                          <span>Risk: {project.ai_risk_score}%</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}