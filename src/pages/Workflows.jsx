import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GitBranch, Plus, Play, Pause, Settings, Zap, Clock,
  CheckCircle2, XCircle, Mail, Bell, FileText, Users, ArrowRight, Brain
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SOPGuide from '../components/modules/SOPGuide';
import ModuleDashboard from '../components/modules/ModuleDashboard';
import SmartWorkflowBuilder from '../components/workflows/SmartWorkflowBuilder';
import AIWorkflowGenerator from '@/components/workflows/AIWorkflowGenerator';
import { WorkflowEngine } from '@/components/automation/WorkflowEngine';
import { toast } from 'sonner';
import moment from 'moment';

const workflowSOP = {
  title: "Workflow Automation",
  description: "Design → Configure → Test → Deploy → Monitor",
  steps: [
    { name: "Design", description: "Plan workflow triggers and actions.", checklist: ["Identify trigger", "Map process steps", "Define conditions", "Set approvers"] },
    { name: "Configure", description: "Build workflow with visual editor.", checklist: ["Add trigger", "Configure actions", "Set conditions", "Add notifications"] },
    { name: "Test", description: "Test workflow with sample data.", checklist: ["Create test case", "Run simulation", "Verify outputs", "Check notifications"] },
    { name: "Deploy", description: "Activate workflow in production.", checklist: ["Review config", "Enable workflow", "Monitor initial runs", "Adjust if needed"] },
    { name: "Monitor", description: "Track performance and optimize.", checklist: ["View run history", "Check errors", "Analyze metrics", "Optimize steps"] }
  ]
};

export default function Workflows() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('workflows');
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);

  const handleTestRun = async (workflowData) => {
    // Simulate a context for the test run
    const mockContext = {
      id: 'TEST-' + Math.floor(Math.random() * 1000),
      project_name: 'Test Project Alpha',
      status: 'Delayed',
      lead_score: 0.4
    };
    
    // Construct a temporary automation object for the engine
    const tempAutomation = {
      id: 'TEST-RUN',
      name: workflowData.name,
      trigger: workflowData.trigger,
      nodes: workflowData.nodes,
      actions: workflowData.nodes
        .filter(n => n.type === 'action' || n.type === 'email' || n.type === 'update')
        .map((n, index) => ({
          action_type: n.type === 'email' ? 'SendEmail' : (n.type === 'update' ? 'UpdateDoc' : 'CallAPI'),
          params: JSON.stringify(n.data),
          order: index + 1,
          enabled: true
        }))
    };

    toast.info('Starting Test Execution...');
    await WorkflowEngine.execute(tempAutomation, mockContext);
  };
  const queryClient = useQueryClient();

  const { data: arkAutomations = [] } = useQuery({
    queryKey: ['arkAutomations', activeCompany],
    queryFn: () => base44.entities.ArkAutomation.filter({ client: activeCompany }),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ArkAutomation.create({ ...data, client: activeCompany }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arkAutomations'] });
      toast.success('Ark Automation deployed with AI agents');
      setShowBuilder(false);
      setEditingWorkflow(null);
    }
  });

  const stats = [
    { label: 'Active Workflows', value: arkAutomations.length + 12, icon: GitBranch, color: 'bg-blue-500', trend: 20 },
    { label: 'Runs Today', value: 156, icon: Zap, color: 'bg-purple-500', trend: 35 },
    { label: 'Success Rate', value: '98.5%', icon: CheckCircle2, color: 'bg-green-500', trend: 2 },
    { label: 'Avg Time Saved', value: '4.2h', icon: Clock, color: 'bg-amber-500', trend: 15 }
  ];

  const defaultWorkflows = [
    { id: 1, name: 'PO Approval Workflow', category: 'approval', trigger: 'PO > $5,000', runs: 234, status: 'active', lastRun: '2 mins ago', successRate: 99 },
    { id: 2, name: 'Invoice Auto-Processing', category: 'automation', trigger: 'New Invoice', runs: 567, status: 'active', lastRun: '5 mins ago', successRate: 97 },
    { id: 3, name: 'Low Stock Alert', category: 'notification', trigger: 'Stock < Reorder', runs: 89, status: 'active', lastRun: '1 hour ago', successRate: 100 },
    { id: 4, name: 'Customer Onboarding', category: 'automation', trigger: 'New Customer', runs: 45, status: 'active', lastRun: '3 hours ago', successRate: 98 },
    { id: 5, name: 'Expense Approval', category: 'approval', trigger: 'New Expense', runs: 123, status: 'paused', lastRun: '1 day ago', successRate: 95 },
    { id: 6, name: 'Contract Renewal Reminder', category: 'notification', trigger: '30 days before expiry', runs: 34, status: 'active', lastRun: '2 days ago', successRate: 100 }
  ];

  const handleSaveWorkflow = (workflowData) => {
    createMutation.mutate(workflowData);
  };

  const approvalQueue = [
    { id: 1, type: 'Purchase Order', title: 'PO-2024-089 - Office Equipment', requester: 'John Tan', amount: 12500, status: 'pending', submitted: '2 hours ago' },
    { id: 2, type: 'Expense', title: 'Travel Reimbursement - Q4 Conference', requester: 'Lisa Wong', amount: 2350, status: 'pending', submitted: '5 hours ago' },
    { id: 3, type: 'Discount', title: '15% Discount for TechStart', requester: 'Mike Chen', amount: 4500, status: 'pending', submitted: '1 day ago' }
  ];

  const categoryIcons = {
    approval: Users,
    automation: Zap,
    notification: Bell,
    integration: GitBranch
  };

  const categoryColors = {
    approval: 'bg-blue-100 text-blue-700',
    automation: 'bg-purple-100 text-purple-700',
    notification: 'bg-amber-100 text-amber-700',
    integration: 'bg-green-100 text-green-700'
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
            {showBuilder ? (
              <div className="h-[calc(100vh-140px)]">
                <SmartWorkflowBuilder 
                  workflow={editingWorkflow}
                  onSave={handleSaveWorkflow} 
                  onCancel={() => { setShowBuilder(false); setEditingWorkflow(null); }}
                  onTestRun={handleTestRun}
                />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Workflow Automation</h1>
                    <p className="text-slate-500">ServiceNow-style workflows with AI approvals and automations</p>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 hover:opacity-90 mr-3"
                    onClick={() => setShowAIGenerator(true)}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Generate with AI
                  </Button>
                  <Button 
                    className="bg-lime-500 hover:bg-lime-600"
                    onClick={() => setShowBuilder(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Smart Workflow
                  </Button>
                </div>

                <AIWorkflowGenerator 
                  open={showAIGenerator} 
                  onOpenChange={setShowAIGenerator}
                  onWorkflowGenerated={(workflow) => {
                    setEditingWorkflow(workflow);
                    setShowBuilder(true);
                  }}
                  clientProfile={{ industry_tag: 'Tech', priority_area: 'Efficiency' }}
                />

                <SOPGuide {...workflowSOP} />
                <ModuleDashboard stats={stats} />

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="workflows">Workflows</TabsTrigger>
                    <TabsTrigger value="approvals">Approval Queue</TabsTrigger>
                    <TabsTrigger value="history">Run History</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                  </TabsList>

                  <TabsContent value="workflows">
                    <div className="grid gap-4">
                      {/* Ark Automations */}
                      {arkAutomations.map(automation => (
                        <Card key={automation.id} className="border-lime-200 bg-lime-50/10">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-lime-100 text-lime-700 flex items-center justify-center">
                                  <Brain className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="font-semibold flex items-center gap-2">
                                    {automation.name}
                                    <Badge className="bg-lime-500 text-white">Ark ERPNext</Badge>
                                  </h3>
                                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                    <span>Trigger: {automation.trigger}</span>
                                    <span>•</span>
                                    <span>{automation.nodes?.length || 0} steps</span>
                                    <span>•</span>
                                    <span>Active: {automation.is_active ? 'Yes' : 'No'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Switch checked={automation.is_active} />
                                <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {/* Legacy Workflows */}
                      {defaultWorkflows.map(workflow => {
                        const Icon = categoryIcons[workflow.category] || GitBranch;
                        return (
                          <Card key={workflow.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-lg ${categoryColors[workflow.category] || 'bg-slate-100'} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{workflow.name}</h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                      <span>Trigger: {workflow.trigger}</span>
                                      <span>•</span>
                                      <span>{workflow.runs} runs</span>
                                      <span>•</span>
                                      <span>Last: {workflow.lastRun}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right hidden md:block">
                                    <p className="text-lg font-bold text-green-600">{workflow.successRate}%</p>
                                    <p className="text-xs text-slate-500">Success rate</p>
                                  </div>
                                  <Switch checked={workflow.status === 'active'} />
                                  <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="approvals">
                    <Card>
                      <CardHeader>
                        <CardTitle>Pending Approvals</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {approvalQueue.map(item => (
                          <div key={item.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <Badge variant="secondary" className="mb-2">{item.type}</Badge>
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-slate-500">Requested by {item.requester} • {item.submitted}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold">${item.amount.toLocaleString()}</p>
                                <div className="flex gap-2 mt-2">
                                  <Button size="sm" className="bg-green-500 hover:bg-green-600">
                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                                    <XCircle className="w-4 h-4 mr-1" /> Reject
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="templates">
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { name: 'Multi-Level Approval', desc: 'Route approvals based on amount thresholds', icon: Users },
                        { name: 'Document Processing', desc: 'Auto-extract and file incoming documents', icon: FileText },
                        { name: 'Email Notifications', desc: 'Send alerts based on triggers', icon: Mail },
                        { name: 'Data Sync', desc: 'Sync data between systems automatically', icon: GitBranch },
                        { name: 'SLA Escalation', desc: 'Escalate tickets when SLA is at risk', icon: Clock },
                        { name: 'Onboarding Sequence', desc: 'Automated onboarding for new customers', icon: Zap }
                      ].map((template, i) => (
                        <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-4">
                              <template.icon className="w-6 h-6 text-slate-600" />
                            </div>
                            <h3 className="font-semibold mb-2">{template.name}</h3>
                            <p className="text-sm text-slate-500">{template.desc}</p>
                            <Button variant="outline" size="sm" className="mt-4">Use Template</Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}