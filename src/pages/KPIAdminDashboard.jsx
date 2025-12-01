import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Shield, Trophy, TrendingUp, Users, Brain, Lock,
  CheckCircle2, XCircle, DollarSign, Search, Eye, Gift
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ModuleDashboard from '../components/modules/ModuleDashboard';

export default function KPIAdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('rewards');

  const stats = [
    { label: 'Total Employees', value: 156, icon: Users, color: 'bg-blue-500', trend: 5 },
    { label: 'Avg KPI Score', value: 74, icon: TrendingUp, color: 'bg-green-500', trend: 8 },
    { label: 'Pending Rewards', value: 12, icon: Gift, color: 'bg-amber-500', trend: 0 },
    { label: 'Total Reward Budget', value: '$45K', icon: DollarSign, color: 'bg-purple-500', trend: 15 }
  ];

  const pendingRewards = [
    { id: 1, name: 'Sarah Chen', email: 'sarah@arkfinex.com', dept: 'Finance', milestone: '10%', prevScore: 68, currentScore: 78, improvement: 14.7, suggestedReward: 250, type: 'bonus', justification: 'Exceptional improvement in productivity and quality metrics. Led successful Q4 financial close with zero errors.' },
    { id: 2, name: 'John Lee', email: 'john@arkfinex.com', dept: 'Engineering', milestone: '5%', prevScore: 75, currentScore: 82, improvement: 9.3, suggestedReward: 100, type: 'bonus', justification: 'Significant improvement in timeliness and collaboration. Successfully mentored 2 junior developers.' },
    { id: 3, name: 'Emily Wong', email: 'emily@arkfinex.com', dept: 'Sales', milestone: '30%', prevScore: 55, currentScore: 78, improvement: 41.8, suggestedReward: 500, type: 'bonus + training', justification: 'Outstanding transformation. Went from bottom 30% to top 25% in 3 months through consistent effort.' },
    { id: 4, name: 'Mike Tan', email: 'mike@arkfinex.com', dept: 'Operations', milestone: '3%', prevScore: 72, currentScore: 76, improvement: 5.5, suggestedReward: 50, type: 'bonus', justification: 'Steady improvement in efficiency metrics. Reduced processing time by 15%.' }
  ];

  const topPerformers = [
    { rank: 1, name: 'Emily Wong', dept: 'Sales', score: 92, improvement: 41.8 },
    { rank: 2, name: 'David Lim', dept: 'Engineering', score: 89, improvement: 18.5 },
    { rank: 3, name: 'Sarah Chen', dept: 'Finance', score: 88, improvement: 14.7 },
    { rank: 4, name: 'Lisa Ng', dept: 'HR', score: 86, improvement: 12.3 },
    { rank: 5, name: 'John Lee', dept: 'Engineering', score: 85, improvement: 9.3 }
  ];

  const handleApprove = (id) => {
    console.log('Approving reward for:', id);
  };

  const handleDecline = (id) => {
    console.log('Declining reward for:', id);
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-7 h-7 text-purple-500" />
                  KPI Admin Dashboard
                </h1>
                <p className="text-slate-500">CEO & Super Admin Only - AI Reward Recommendations</p>
              </div>
              <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Restricted Access
              </Badge>
            </div>

            {/* Security Notice */}
            <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardContent className="p-4 flex items-center gap-4">
                <Brain className="w-10 h-10 text-purple-500" />
                <div>
                  <p className="font-semibold text-purple-900">100% AI-Generated Recommendations</p>
                  <p className="text-sm text-purple-700">All KPI scores and reward suggestions are calculated by AI based on objective metrics. No human override is possible on the scoring algorithm.</p>
                </div>
              </CardContent>
            </Card>

            <ModuleDashboard stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="rewards">Pending Rewards</TabsTrigger>
                <TabsTrigger value="leaderboard">Company Leaderboard</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="rewards">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Milestone Reward Approvals
                      </CardTitle>
                      <p className="text-sm text-slate-500">{pendingRewards.length} pending your decision</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingRewards.map(reward => (
                      <div key={reward.id} className="p-6 border rounded-xl bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-14 h-14">
                              <AvatarFallback className="text-lg">{reward.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{reward.name}</h3>
                              <p className="text-sm text-slate-500">{reward.dept} • {reward.email}</p>
                              <Badge className="mt-1 bg-lime-100 text-lime-700">{reward.milestone} Improvement Milestone</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-lime-600">+{reward.improvement.toFixed(1)}%</p>
                            <p className="text-sm text-slate-500">{reward.prevScore} → {reward.currentScore}</p>
                          </div>
                        </div>

                        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                          <p className="text-sm font-medium text-slate-700 mb-1">🤖 AI Justification:</p>
                          <p className="text-sm text-slate-600">{reward.justification}</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                              <p className="text-2xl font-bold text-green-600">${reward.suggestedReward}</p>
                              <p className="text-xs text-green-700">Suggested Reward</p>
                            </div>
                            <Badge variant="outline">{reward.type}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleDecline(reward.id)}>
                              <XCircle className="w-4 h-4 mr-2 text-red-500" />
                              Decline
                            </Button>
                            <Button className="bg-green-500 hover:bg-green-600" onClick={() => handleApprove(reward.id)}>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Approve Reward
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Performance Leaderboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topPerformers.map((emp, i) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-lg ${i === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200' : 'bg-slate-50'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-amber-500 text-white' : i === 1 ? 'bg-slate-400 text-white' : i === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200'}`}>
                              {emp.rank}
                            </div>
                            <div>
                              <p className="font-medium">{emp.name}</p>
                              <p className="text-sm text-slate-500">{emp.dept}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-center">
                              <p className="text-2xl font-bold">{emp.score}</p>
                              <p className="text-xs text-slate-500">KPI Score</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-lime-600">+{emp.improvement}%</p>
                              <p className="text-xs text-slate-500">Improvement</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Department Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {['Engineering', 'Sales', 'Finance', 'Operations', 'HR'].map((dept, i) => (
                        <div key={dept}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{dept}</span>
                            <span className="font-medium">{[82, 78, 85, 74, 79][i]}</span>
                          </div>
                          <Progress value={[82, 78, 85, 74, 79][i]} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Recommendations for Leadership</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-900">📈 Operations team needs attention</p>
                        <p className="text-sm text-blue-700">Avg score 74 - below company average. Recommend team training on efficiency tools.</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-900">🌟 Sales team showing exceptional growth</p>
                        <p className="text-sm text-green-700">41.8% improvement from Emily Wong should be studied as a success model.</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <p className="font-medium text-amber-900">⚠️ Innovation scores company-wide low</p>
                        <p className="text-sm text-amber-700">Consider implementing innovation time or hackathons to boost creativity metrics.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}