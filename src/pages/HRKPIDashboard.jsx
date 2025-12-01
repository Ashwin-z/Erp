import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles, Trophy, TrendingUp, Target, Shield, RefreshCw,
  BarChart3, Clock, CheckCircle2, AlertTriangle, Zap, Brain
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import KPIScoreCard from '../components/hr/KPIScoreCard';
import AIFeedbackPanel from '../components/hr/AIFeedbackPanel';
import MilestoneRewards from '../components/hr/MilestoneRewards';

export default function HRKPIDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('my-kpi');
  const [analyzing, setAnalyzing] = useState(false);

  // Mock current user KPI data
  const myKPI = {
    overall_score: 78,
    previous_score: 72,
    improvement_percentage: 8.3,
    rank_percentile: 75,
    metrics: {
      productivity_score: 82,
      quality_score: 85,
      timeliness_score: 78,
      collaboration_score: 75,
      innovation_score: 68,
      learning_score: 80,
      efficiency_score: 76,
      reliability_score: 88
    },
    previousMetrics: {
      productivity_score: 78,
      quality_score: 80,
      timeliness_score: 75,
      collaboration_score: 72,
      innovation_score: 65,
      learning_score: 70,
      efficiency_score: 74,
      reliability_score: 85
    },
    strengths: ['Reliability', 'Quality Focus', 'Productivity'],
    weaknesses: ['Innovation', 'Collaboration'],
    training_recommendations: [
      'Complete "Creative Problem Solving" course',
      'Join cross-functional project team',
      'Attend innovation workshop series'
    ],
    ai_feedback: "You've shown consistent improvement over the past quarter, particularly in productivity (+4) and learning (+10). Your reliability score of 88 puts you in the top 15% of your department. Focus on expanding your innovation contributions by participating in brainstorming sessions and proposing at least one process improvement per month.",
    ai_action_plan: "Week 1-2: Join the Product Innovation Slack channel. Week 3-4: Propose one improvement idea. Month 2: Lead a mini-project with cross-team collaboration.",
    milestone_reached: '5%',
    achievedMilestones: ['1%', '3%', '5%']
  };

  const recentActivities = [
    { type: 'task_completed', desc: 'Completed Q4 Financial Report', impact: 8, time: '2 hours ago', module: 'Finance' },
    { type: 'approval_processed', desc: 'Approved 3 purchase orders', impact: 6, time: '4 hours ago', module: 'Procurement' },
    { type: 'collaboration', desc: 'Participated in cross-team meeting', impact: 5, time: '1 day ago', module: 'Projects' },
    { type: 'training_completed', desc: 'Finished Excel Advanced course', impact: 7, time: '2 days ago', module: 'Learning' }
  ];

  const handleRefreshAnalysis = async () => {
    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalyzing(false);
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
                  <Brain className="w-7 h-7 text-purple-500" />
                  AI-Powered KPI Dashboard
                </h1>
                <p className="text-slate-500">100% objective, bias-free performance tracking</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  AI Protected - No Override
                </Badge>
                <Button 
                  variant="outline" 
                  onClick={handleRefreshAnalysis}
                  disabled={analyzing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
                  {analyzing ? 'Analyzing...' : 'Refresh Analysis'}
                </Button>
              </div>
            </div>

            {/* Overall Score Card */}
            <Card className="mb-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center">
                      <span className="text-4xl font-bold text-slate-900">{myKPI.overall_score}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Your KPI Score</h2>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-lime-500 text-slate-900">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +{myKPI.improvement_percentage}% improvement
                        </Badge>
                        <span className="text-slate-400">Top {100 - myKPI.rank_percentile}% in company</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Previous Period</p>
                    <p className="text-3xl font-bold">{myKPI.previous_score}</p>
                    <p className="text-lime-400 text-sm mt-1">+{myKPI.overall_score - myKPI.previous_score} points</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="my-kpi">My Performance</TabsTrigger>
                <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
                <TabsTrigger value="activities">Activity Log</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>

              <TabsContent value="my-kpi" className="space-y-6">
                <KPIScoreCard metrics={myKPI.metrics} previousMetrics={myKPI.previousMetrics} />
                <AIFeedbackPanel kpiData={myKPI} />
              </TabsContent>

              <TabsContent value="metrics">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(myKPI.metrics).map(([key, value]) => {
                        const prev = myKPI.previousMetrics[key];
                        const diff = value - prev;
                        return (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium capitalize">{key.replace('_score', '').replace('_', ' ')}</span>
                              <div className="flex items-center gap-4">
                                <span className={`text-sm ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {diff >= 0 ? '+' : ''}{diff}
                                </span>
                                <span className="text-lg font-bold w-12 text-right">{value}</span>
                              </div>
                            </div>
                            <div className="relative">
                              <Progress value={value} className="h-3" />
                              {prev && (
                                <div 
                                  className="absolute top-0 h-3 w-0.5 bg-slate-600"
                                  style={{ left: `${prev}%` }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      Recent Activities Tracked by AI
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-lime-100 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-lime-600" />
                            </div>
                            <div>
                              <p className="font-medium">{activity.desc}</p>
                              <p className="text-sm text-slate-500">{activity.module} • {activity.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-lime-600">+{activity.impact}</p>
                            <p className="text-xs text-slate-500">Impact Score</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards">
                <MilestoneRewards 
                  currentImprovement={myKPI.improvement_percentage} 
                  achievedMilestones={myKPI.achievedMilestones}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}