import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, TrendingDown, Clock, CheckCircle2, AlertTriangle,
  Users, DollarSign, Calendar, Target, Zap, Brain
} from 'lucide-react';

export default function ProjectDashboardStats({ project, tasks }) {
  const taskStats = React.useMemo(() => {
    const allTasks = tasks || [];
    return {
      total: allTasks.length,
      completed: allTasks.filter(t => t.status === 'done').length,
      inProgress: allTasks.filter(t => t.status === 'in_progress').length,
      blocked: allTasks.filter(t => t.status === 'blocked' || t.blockers?.length > 0).length,
      overdue: allTasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length
    };
  }, [tasks]);

  const completionRate = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;
  const budgetUsed = project?.budget > 0 ? Math.round((project.actual_cost / project.budget) * 100) : 0;

  const stats = [
    {
      label: 'Progress',
      value: `${project?.progress || completionRate}%`,
      icon: Target,
      color: 'bg-lime-500',
      trend: 5,
      description: `${taskStats.completed}/${taskStats.total} tasks done`
    },
    {
      label: 'Tasks In Progress',
      value: taskStats.inProgress,
      icon: Clock,
      color: 'bg-amber-500',
      trend: 0,
      description: 'Currently active'
    },
    {
      label: 'Blocked Tasks',
      value: taskStats.blocked,
      icon: AlertTriangle,
      color: taskStats.blocked > 0 ? 'bg-red-500' : 'bg-slate-400',
      trend: taskStats.blocked > 0 ? -10 : 0,
      description: 'Need attention'
    },
    {
      label: 'Budget Used',
      value: `${budgetUsed}%`,
      icon: DollarSign,
      color: budgetUsed > 80 ? 'bg-red-500' : budgetUsed > 60 ? 'bg-amber-500' : 'bg-green-500',
      trend: budgetUsed > 80 ? -15 : 0,
      description: `$${(project?.actual_cost || 0).toLocaleString()} / $${(project?.budget || 0).toLocaleString()}`
    }
  ];

  const aiInsights = [
    { 
      type: 'warning',
      message: `${taskStats.overdue} tasks are overdue and need immediate attention`,
      show: taskStats.overdue > 0
    },
    {
      type: 'success',
      message: 'Project is on track for on-time delivery',
      show: taskStats.overdue === 0 && project?.ai_risk_score < 30
    },
    {
      type: 'info',
      message: `AI predicts ${project?.ai_delay_prediction || 0} day delay based on current velocity`,
      show: project?.ai_delay_prediction > 0
    },
    {
      type: 'alert',
      message: 'Budget utilization exceeds 80%. Consider reviewing scope.',
      show: budgetUsed > 80
    }
  ].filter(i => i.show);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                {stat.trend !== 0 && (
                  <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(stat.trend)}% vs last week</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiInsights.map((insight, i) => (
                <div 
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    insight.type === 'warning' ? 'bg-amber-100' :
                    insight.type === 'alert' ? 'bg-red-100' :
                    insight.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                  }`}
                >
                  {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  {insight.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                  {insight.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  {insight.type === 'info' && <Zap className="w-4 h-4 text-blue-600" />}
                  <span className="text-sm">{insight.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Score */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Project Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48" cy="48" r="40"
                    fill="none" stroke="#e2e8f0" strokeWidth="8"
                  />
                  <circle
                    cx="48" cy="48" r="40"
                    fill="none"
                    stroke={project?.ai_health_score > 70 ? '#22c55e' : project?.ai_health_score > 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeDasharray={`${(project?.ai_health_score || 0) * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{project?.ai_health_score || 0}</span>
                </div>
              </div>
              <div>
                <Badge className={
                  project?.ai_health_score > 70 ? 'bg-green-100 text-green-700' :
                  project?.ai_health_score > 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }>
                  {project?.ai_health_score > 70 ? 'Healthy' : project?.ai_health_score > 40 ? 'At Risk' : 'Critical'}
                </Badge>
                <p className="text-sm text-slate-500 mt-2">
                  Based on progress, budget, and timeline analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Risk Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(project?.ai_risk_factors || ['No significant risks detected']).map((risk, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}