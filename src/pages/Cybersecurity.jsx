import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Shield, AlertTriangle, Activity, Users, Eye, Lock,
  Download, Settings, Bell, Search, Filter, RefreshCw,
  Globe, Database, FileText, Sparkles, BarChart3
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SecurityDashboardStats from '../components/security/SecurityDashboardStats';
import LiveActivityFeed from '../components/security/LiveActivityFeed';
import ThreatAlerts from '../components/security/ThreatAlerts';
import UserActivityTracker from '../components/security/UserActivityTracker';
import AlertRecipientSettings from '../components/security/AlertRecipientSettings';
import DataFlowMonitor from '../components/security/DataFlowMonitor';

export default function Cybersecurity() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAlertAction = (alert, action) => {
    console.log(`Alert ${alert.id} action: ${action}`);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Cybersecurity Command Center</h1>
                  <p className="text-slate-500">AI-powered fraud detection & real-time security monitoring</p>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  Protected
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync
                </Button>
                <Button className="bg-red-500 hover:bg-red-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergency Response
                </Button>
              </div>
            </div>

            {/* Stats */}
            <SecurityDashboardStats />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Overview
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Live Activity
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Alerts
                    <Badge className="bg-red-500 text-white ml-1">3</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> User Tracking
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex items-center gap-2">
                    <Database className="w-4 h-4" /> Data Flow
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Settings
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search logs, users, IPs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="overview">
                <div className="grid lg:grid-cols-2 gap-6">
                  <ThreatAlerts onAction={handleAlertAction} />
                  <LiveActivityFeed />
                </div>
                <div className="mt-6">
                  <DataFlowMonitor />
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <LiveActivityFeed />
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        AI Security Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-purple-700">Pattern Detected</p>
                        <p className="text-sm text-slate-600 mt-1">Unusual data export activity from user john@techstart.com. 5x higher than normal.</p>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <p className="text-sm font-medium text-amber-700">Risk Assessment</p>
                        <p className="text-sm text-slate-600 mt-1">3 users accessing from new locations today. Recommend 2FA verification.</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-700">Security Score</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-green-500 rounded-full" />
                          </div>
                          <span className="font-bold text-green-600">85/100</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts">
                <ThreatAlerts onAction={handleAlertAction} />
              </TabsContent>

              <TabsContent value="users">
                <UserActivityTracker />
              </TabsContent>

              <TabsContent value="data">
                <DataFlowMonitor />
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  <AlertRecipientSettings />
                  
                  {/* Security Policies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-500" />
                        Security Policies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { name: 'Brute Force Protection', description: 'Block after 5 failed login attempts', enabled: true },
                        { name: 'Unusual Location Alert', description: 'Alert when user logs in from new country', enabled: true },
                        { name: 'Large Data Export Block', description: 'Block exports > 1000 records without approval', enabled: true },
                        { name: 'After Hours Access Alert', description: 'Alert for access outside business hours', enabled: false },
                        { name: 'VPN Detection', description: 'Flag connections through known VPN IPs', enabled: true }
                      ].map((policy, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium">{policy.name}</p>
                            <p className="text-sm text-slate-500">{policy.description}</p>
                          </div>
                          <Badge className={policy.enabled ? 'bg-green-500' : 'bg-slate-400'}>
                            {policy.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Blocked Entities */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-red-500" />
                        Blocked Entities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[
                          { type: 'IP Address', value: '45.33.12.99', reason: 'Multiple brute force attempts', blocked: '2 hours ago' },
                          { type: 'Domain', value: 'suspicious-site.com', reason: 'Phishing attempt detected', blocked: '1 day ago' },
                          { type: 'User Agent', value: 'sqlmap/1.4', reason: 'SQL injection tool detected', blocked: '3 days ago' }
                        ].map((entity, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                            <div>
                              <Badge variant="outline" className="mb-1">{entity.type}</Badge>
                              <p className="font-mono text-sm">{entity.value}</p>
                              <p className="text-xs text-slate-500">{entity.reason}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-400">Blocked {entity.blocked}</p>
                              <Button variant="ghost" size="sm" className="mt-1">Unblock</Button>
                            </div>
                          </div>
                        ))}
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