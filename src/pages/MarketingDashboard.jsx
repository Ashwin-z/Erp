import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BrainCircuit, TrendingUp, Users, Gift, HeartHandshake, 
  Megaphone, Zap, Activity, ArrowUpRight, AlertCircle 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: "Active Campaigns", value: "12", change: "+2", icon: Megaphone, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Predicted Revenue", value: "$1.2M", change: "+15%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Customer LTV", value: "$850", change: "+5%", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "AI Actions", value: "1,450", change: "+120", icon: BrainCircuit, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  const recommendations = [
    { id: 1, type: 'Campaign', title: 'Launch "Summer Glow" Bundle', confidence: 94, impact: 'High' },
    { id: 2, type: 'Retention', title: 'Gift 500 VIPs (Spending Drop)', confidence: 88, impact: 'Medium' },
    { id: 3, type: 'CSR', title: 'Approve Ocean Cleanup Fund', confidence: 98, impact: 'Brand' },
  ];

  const data = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ];

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-lime-400" />
            AI-CMO Command Center
          </h1>
          <p className="text-slate-400">Orchestrating 6 AI Agents for Market Domination</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Activity className="w-4 h-4 mr-2" />
            Live Signals
          </Button>
          <Button className="bg-lime-500 hover:bg-lime-600 text-slate-900 font-bold">
            <Zap className="w-4 h-4 mr-2" />
            Auto-Pilot: ON
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <span className="text-xs text-emerald-400 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader>
              <CardTitle>Revenue Forecast (AI Model v4.2)</CardTitle>
              <CardDescription>Predicted vs Actual performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#84cc16" strokeWidth={3} dot={{fill: '#84cc16'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Feed */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-lime-500/50 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                    {rec.type}
                  </Badge>
                  <span className="text-lime-400 text-xs font-bold">{rec.confidence}% Conf.</span>
                </div>
                <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-slate-500">Impact: {rec.impact}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-7 text-xs hover:text-red-400">Dismiss</Button>
                    <Button size="sm" className="h-7 text-xs bg-lime-500 hover:bg-lime-600 text-slate-900">Approve</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Agents Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { name: "Market Spider", status: "Crawling", color: "bg-blue-500" },
          { name: "Nurturing Coach", status: "Generating", color: "bg-purple-500" },
          { name: "Loyalty Engine", status: "Idle", color: "bg-emerald-500" },
          { name: "Sales Closer", status: "Active (3 chats)", color: "bg-amber-500" },
          { name: "Rev Multiplier", status: "Optimizing", color: "bg-cyan-500" },
          { name: "CSR Officer", status: "Pending", color: "bg-pink-500" },
        ].map((agent, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${agent.color} animate-pulse`} />
            <div>
              <p className="text-xs font-bold text-slate-300">{agent.name}</p>
              <p className="text-[10px] text-slate-500">{agent.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}