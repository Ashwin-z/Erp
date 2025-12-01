import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crown, Building2, Shield, Users, AlertTriangle, CheckCircle2,
  Clock, TrendingUp, Activity, FileText, Bell, Zap, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const ROLE_CONFIGS = {
  super_admin: {
    title: 'Super Admin Dashboard',
    icon: Crown,
    color: 'from-red-500 to-pink-600',
    widgets: ['platform_stats', 'security_alerts', 'pending_requests', 'ai_recommendations', 'system_health']
  },
  department_head: {
    title: 'Department Head Dashboard',
    icon: Building2,
    color: 'from-purple-500 to-indigo-600',
    widgets: ['team_stats', 'team_requests', 'default_settings', 'team_activity']
  },
  security_analyst: {
    title: 'Security Analyst Dashboard',
    icon: Shield,
    color: 'from-amber-500 to-orange-600',
    widgets: ['security_alerts', 'audit_summary', 'suspicious_activity', 'compliance_status']
  }
};

export default function RoleDashboard({ role = 'super_admin', data = {} }) {
  const config = ROLE_CONFIGS[role] || ROLE_CONFIGS.super_admin;
  const Icon = config.icon;

  const platformStats = [
    { label: 'Total Users', value: 2340, change: '+12%', icon: Users },
    { label: 'Active Sessions', value: 156, change: '+8%', icon: Activity },
    { label: 'Pending Requests', value: 7, change: '-3', icon: Clock },
    { label: 'Security Score', value: '94%', change: '+2%', icon: Shield }
  ];

  const teamStats = [
    { label: 'Team Members', value: 12, icon: Users },
    { label: 'Pending Approvals', value: 3, icon: Clock },
    { label: 'Active Defaults', value: 4, icon: CheckCircle2 },
    { label: 'Access Requests', value: 2, icon: Bell }
  ];

  const securityAlerts = [
    { id: 1, type: 'critical', message: 'Multiple failed login attempts detected', user: 'unknown@external.com', time: '5 mins ago' },
    { id: 2, type: 'warning', message: 'Unusual permission change pattern', user: 'john@arkfinex.com', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'New device logged in', user: 'sarah@arkfinex.com', time: '2 hours ago' }
  ];

  const pendingRequests = [
    { id: 1, user: 'Mike Johnson', request: 'Access to Finance Module', department: 'HR', time: '30 mins ago' },
    { id: 2, user: 'Anna Lee', request: 'Export permission for Reports', department: 'IT', time: '2 hours ago' },
    { id: 3, user: 'David Chen', request: 'Admin access to CRM', department: 'Sales', time: '1 day ago' }
  ];

  const aiRecommendations = [
    { id: 1, type: 'optimize', message: 'Remove unused Finance access from 3 Sales users', impact: 'Reduce attack surface' },
    { id: 2, type: 'security', message: 'Enable 2FA for all Department Heads', impact: 'Improve security posture' }
  ];

  const renderWidget = (widgetId) => {
    switch (widgetId) {
      case 'platform_stats':
        return (
          <Card key={widgetId} className="col-span-2">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {platformStats.map((stat, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="w-5 h-5 text-slate-400" />
                      <Badge variant="outline" className="text-xs text-green-600">{stat.change}</Badge>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'team_stats':
        return (
          <Card key={widgetId} className="col-span-2">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {teamStats.map((stat, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg text-center">
                    <stat.icon className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'security_alerts':
        return (
          <Card key={widgetId}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Security Alerts
              </CardTitle>
              <Badge className="bg-red-100 text-red-700">{securityAlerts.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {securityAlerts.map(alert => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'critical' ? 'bg-red-50 border-red-500' :
                  alert.type === 'warning' ? 'bg-amber-50 border-amber-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-slate-500">{alert.user} • {alert.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case 'pending_requests':
      case 'team_requests':
        return (
          <Card key={widgetId}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending Requests
              </CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.map(req => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{req.user}</p>
                    <p className="text-xs text-slate-500">{req.request}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 h-7">Approve</Button>
                    <Button size="sm" variant="outline" className="h-7">Deny</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case 'ai_recommendations':
        return (
          <Card key={widgetId}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiRecommendations.map(rec => (
                <div key={rec.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium">{rec.message}</p>
                  <p className="text-xs text-purple-600">Impact: {rec.impact}</p>
                  <Button size="sm" className="mt-2 h-7">Apply</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case 'default_settings':
        return (
          <Card key={widgetId}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Default Access Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-lime-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">New User Defaults</p>
                    <p className="text-xs text-slate-500">4 modules configured</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Role Templates</p>
                    <p className="text-xs text-slate-500">3 templates active</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'system_health':
        return (
          <Card key={widgetId}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['API Services', 'Database', 'Auth Service'].map((service, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{service}</span>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'team_activity':
        return (
          <Card key={widgetId}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Recent Team Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { action: 'Login', user: 'Mike J.', time: '2 mins ago' },
                { action: 'File access', user: 'Sarah C.', time: '15 mins ago' },
                { action: 'Report export', user: 'John S.', time: '1 hour ago' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                  <span>{activity.action} by {activity.user}</span>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case 'audit_summary':
        return (
          <Card key={widgetId}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Audit Summary (7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-xl font-bold text-blue-600">127</p>
                  <p className="text-xs text-slate-500">Total Events</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg text-center">
                  <p className="text-xl font-bold text-amber-600">5</p>
                  <p className="text-xs text-slate-500">Warnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'suspicious_activity':
        return (
          <Card key={widgetId}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-red-500" />
                Suspicious Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium">Unusual login location</p>
                <p className="text-xs text-slate-500">IP: 192.168.x.x • Malaysia</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-sm font-medium">Bulk data export attempt</p>
                <p className="text-xs text-slate-500">User: test@external.com</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'compliance_status':
        return (
          <Card key={widgetId}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['PDPA', 'SOC2', 'ISO 27001'].map((comp, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span className="text-sm">{comp}</span>
                    <Badge className="bg-green-100 text-green-700">Compliant</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Header */}
      <div className={`p-6 rounded-xl bg-gradient-to-r ${config.color} text-white`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{config.title}</h2>
            <p className="text-white/80 text-sm">Tailored view for your role</p>
          </div>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-2 gap-4">
        {config.widgets.map(widgetId => renderWidget(widgetId))}
      </div>
    </div>
  );
}