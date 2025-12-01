import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Megaphone, Plus, Search, Mail, MessageSquare, Bell,
  Users, Target, TrendingUp, Sparkles, Play, Pause, Eye
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SOPGuide from '../components/modules/SOPGuide';
import ModuleDashboard from '../components/modules/ModuleDashboard';

const marketingSOP = {
  title: "Marketing Campaign Workflow",
  description: "Plan → Segment → Create → Launch → Analyze",
  steps: [
    { name: "Plan", description: "Define campaign objectives and budget.", checklist: ["Set goals", "Allocate budget", "Define timeline", "Choose channels"] },
    { name: "Segment", description: "Select target audience based on criteria.", checklist: ["Filter by industry", "Filter by status", "Custom filters", "Estimate reach"] },
    { name: "Create", description: "Design campaign content and assets.", checklist: ["Write copy", "Design visuals", "AI optimization", "A/B variants"] },
    { name: "Launch", description: "Schedule and deploy campaign.", checklist: ["Set schedule", "Test delivery", "Launch campaign", "Monitor live"] },
    { name: "Analyze", description: "Track performance and optimize.", checklist: ["Track opens/clicks", "Measure conversions", "Calculate ROI", "Generate report"] }
  ]
};

export default function Marketing() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('campaigns');

  const stats = [
    { label: 'Active Campaigns', value: 5, icon: Megaphone, color: 'bg-purple-500', trend: 25 },
    { label: 'Total Reach', value: '12.5K', icon: Users, color: 'bg-blue-500', trend: 18 },
    { label: 'Avg Open Rate', value: '24.5%', icon: Mail, color: 'bg-green-500', trend: 5 },
    { label: 'Conversions', value: 156, icon: Target, color: 'bg-amber-500', trend: 32 }
  ];

  const campaigns = [
    { id: 1, name: 'Q4 Product Launch', type: 'email', status: 'running', segment: 'All Customers', sent: 2500, delivered: 2450, opened: 612, clicked: 89, converted: 23 },
    { id: 2, name: 'Holiday Promotion', type: 'multi_channel', status: 'scheduled', segment: 'Active Customers', sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0 },
    { id: 3, name: 'Re-engagement Series', type: 'email', status: 'running', segment: 'Inactive', sent: 850, delivered: 820, opened: 156, clicked: 34, converted: 8 },
    { id: 4, name: 'New Feature Announcement', type: 'push', status: 'completed', segment: 'All Users', sent: 5000, delivered: 4850, opened: 1940, clicked: 485, converted: 97 }
  ];

  const pointsRules = [
    { id: 1, name: 'Purchase Points', description: '1 point per $1 spent', multiplier: 1, status: 'active' },
    { id: 2, name: 'Referral Bonus', description: '500 points per referral', multiplier: 500, status: 'active' },
    { id: 3, name: 'Birthday Bonus', description: '2x points on birthday', multiplier: 2, status: 'active' },
    { id: 4, name: 'First Purchase', description: '100 bonus points', multiplier: 100, status: 'active' }
  ];

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    scheduled: 'bg-blue-100 text-blue-700',
    running: 'bg-green-100 text-green-700',
    paused: 'bg-amber-100 text-amber-700',
    completed: 'bg-purple-100 text-purple-700'
  };

  const typeIcons = { email: Mail, sms: MessageSquare, push: Bell, multi_channel: Megaphone };

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
                <h1 className="text-2xl font-bold text-slate-900">Marketing & Campaigns</h1>
                <p className="text-slate-500">Create campaigns, manage segments, and track engagement</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generate
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </div>

            <SOPGuide {...marketingSOP} />
            <ModuleDashboard stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="segments">Segments</TabsTrigger>
                <TabsTrigger value="points">Points Rules</TabsTrigger>
                <TabsTrigger value="promotions">Promotions</TabsTrigger>
              </TabsList>

              <TabsContent value="campaigns">
                <div className="grid gap-4">
                  {campaigns.map((campaign) => {
                    const Icon = typeIcons[campaign.type];
                    const openRate = campaign.sent > 0 ? ((campaign.opened / campaign.delivered) * 100).toFixed(1) : 0;
                    return (
                      <Card key={campaign.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{campaign.name}</h3>
                                <p className="text-sm text-slate-500">{campaign.segment}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={statusColors[campaign.status]}>{campaign.status}</Badge>
                              {campaign.status === 'running' && (
                                <Button variant="outline" size="sm"><Pause className="w-4 h-4" /></Button>
                              )}
                              {campaign.status === 'scheduled' && (
                                <Button variant="outline" size="sm"><Play className="w-4 h-4" /></Button>
                              )}
                              <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                            </div>
                          </div>
                          {campaign.sent > 0 && (
                            <div className="grid grid-cols-5 gap-4">
                              <div className="text-center">
                                <p className="text-2xl font-bold">{campaign.sent.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">Sent</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold">{campaign.delivered.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">Delivered</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{openRate}%</p>
                                <p className="text-xs text-slate-500">Open Rate</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold">{campaign.clicked}</p>
                                <p className="text-xs text-slate-500">Clicks</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{campaign.converted}</p>
                                <p className="text-xs text-slate-500">Conversions</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="points">
                <Card>
                  <CardHeader>
                    <CardTitle>Points Rules Builder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pointsRules.map((rule) => (
                        <div key={rule.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium">{rule.name}</p>
                            <p className="text-sm text-slate-500">{rule.description}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700">{rule.status}</Badge>
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