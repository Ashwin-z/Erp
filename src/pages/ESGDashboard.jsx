import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ESGGLSync from '@/components/esg/ESGGLSync';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Leaf, Users, Shield, TrendingDown, TrendingUp,
  FileText, CheckCircle2, AlertTriangle, Droplets, Zap, Truck
} from 'lucide-react';
import SupplierEmissionUpload from '@/components/esg/SupplierEmissionUpload';
import ESGImpactReport from '@/components/esg/ESGImpactReport';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ModuleDashboard from '@/components/modules/ModuleDashboard';

const carbonData = [
  { month: 'Jul', emissions: 45 },
  { month: 'Aug', emissions: 42 },
  { month: 'Sep', emissions: 38 },
  { month: 'Oct', emissions: 35 },
  { month: 'Nov', emissions: 32 },
  { month: 'Dec', emissions: 28 }
];

export default function ESGDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('environmental');

  const stats = [
    { label: 'Carbon Footprint', value: '28 tCO2e', icon: Leaf, color: 'bg-green-500', trend: -12 },
    { label: 'Energy Usage', value: '4,500 kWh', icon: Zap, color: 'bg-amber-500', trend: -8 },
    { label: 'Water Usage', value: '120 m³', icon: Droplets, color: 'bg-blue-500', trend: -5 },
    { label: 'ESG Score', value: '78/100', icon: Shield, color: 'bg-purple-500', trend: 15 }
  ];

  const environmentalMetrics = [
    { name: 'Scope 1 Emissions', value: 12, target: 15, unit: 'tCO2e', status: 'on_track' },
    { name: 'Scope 2 Emissions', value: 16, target: 20, unit: 'tCO2e', status: 'on_track' },
    { name: 'Renewable Energy', value: 45, target: 50, unit: '%', status: 'at_risk' },
    { name: 'Waste Recycled', value: 78, target: 80, unit: '%', status: 'on_track' },
    { name: 'Paper Usage', value: 2500, target: 3000, unit: 'sheets', status: 'on_track' }
  ];

  const socialMetrics = [
    { name: 'Employee Satisfaction', value: 85, target: 80, unit: '%', status: 'exceeds' },
    { name: 'Gender Diversity', value: 42, target: 45, unit: '%', status: 'at_risk' },
    { name: 'Training Hours', value: 24, target: 20, unit: 'hrs/employee', status: 'exceeds' },
    { name: 'Community Investment', value: 25000, target: 20000, unit: 'SGD', status: 'exceeds' }
  ];

  const governanceChecklist = [
    { item: 'Board diversity policy', completed: true },
    { item: 'Anti-corruption training', completed: true },
    { item: 'Whistleblower mechanism', completed: true },
    { item: 'ESG committee established', completed: true },
    { item: 'Climate risk assessment', completed: false },
    { item: 'Supply chain audit', completed: false }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'exceeds': return 'text-green-600';
      case 'on_track': return 'text-blue-600';
      case 'at_risk': return 'text-amber-600';
      default: return 'text-slate-600';
    }
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
                <h1 className="text-2xl font-bold text-slate-900">ESG Dashboard</h1>
                <p className="text-slate-500">Environmental, Social & Governance tracking</p>
              </div>
              <Button className="bg-lime-500 hover:bg-lime-600">
                <FileText className="w-4 h-4 mr-2" />
                Generate ESG Report
              </Button>
            </div>

            {/* Sync Panel */}
            <div className="mb-6">
              <ESGGLSync />
            </div>

            {/* Dashboard Stats */}
            <ModuleDashboard stats={stats} />

            {/* Carbon Trend Chart */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  Carbon Emissions Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={carbonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="emissions" stroke="#22c55e" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="environmental" className="gap-2">
                  <Leaf className="w-4 h-4" />
                  Environmental
                </TabsTrigger>
                <TabsTrigger value="social" className="gap-2">
                  <Users className="w-4 h-4" />
                  Social
                </TabsTrigger>
                <TabsTrigger value="governance" className="gap-2">
                  <Shield className="w-4 h-4" />
                  Governance
                </TabsTrigger>
                <TabsTrigger value="supply-chain" className="gap-2">
                  <Truck className="w-4 h-4" />
                  Supply Chain (Scope 3)
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Impact Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="supply-chain">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
                  <SupplierEmissionUpload />
                </div>
              </TabsContent>

              <TabsContent value="reports">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
                  <ESGImpactReport />
                </div>
              </TabsContent>

              <TabsContent value="environmental">
                <Card>
                  <CardHeader>
                    <CardTitle>Environmental Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {environmentalMetrics.map((metric, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{metric.name}</span>
                            <span className={getStatusColor(metric.status)}>
                              {metric.value} / {metric.target} {metric.unit}
                            </span>
                          </div>
                          <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Impact Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {socialMetrics.map((metric, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{metric.name}</span>
                            <span className={getStatusColor(metric.status)}>
                              {metric.value.toLocaleString()} / {metric.target.toLocaleString()} {metric.unit}
                            </span>
                          </div>
                          <Progress value={Math.min((metric.value / metric.target) * 100, 100)} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="governance">
                <Card>
                  <CardHeader>
                    <CardTitle>Governance Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {governanceChecklist.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="font-medium">{item.item}</span>
                          {item.completed ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
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