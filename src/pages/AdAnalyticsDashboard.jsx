import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  BarChart3, TrendingUp, MousePointer2, Users, 
  Calendar, Filter, Download, PieChart, Activity 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RePieChart, Pie, Cell } from 'recharts';

export default function AdAnalyticsDashboard() {
  // Mock data for charts (in a real app, this would come from an aggregation API)
  const performanceData = [
    { date: 'Mon', impressions: 12500, clicks: 850, conversions: 45 },
    { date: 'Tue', impressions: 15000, clicks: 920, conversions: 52 },
    { date: 'Wed', impressions: 18200, clicks: 1100, conversions: 68 },
    { date: 'Thu', impressions: 14500, clicks: 880, conversions: 48 },
    { date: 'Fri', impressions: 16800, clicks: 1050, conversions: 60 },
    { date: 'Sat', impressions: 19500, clicks: 1300, conversions: 85 },
    { date: 'Sun', impressions: 17000, clicks: 1150, conversions: 72 },
  ];

  const deviceData = [
    { name: 'Mobile', value: 55 },
    { name: 'Desktop', value: 35 },
    { name: 'Tablet', value: 10 },
  ];

  const COLORS = ['#84cc16', '#3b82f6', '#f59e0b'];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Ad Analytics</h1>
            <p className="text-slate-500 mt-1">Real-time performance insights and campaign metrics</p>
          </div>
          <div className="flex gap-3">
            <Select defaultValue="7d">
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-white">
              <Download className="w-4 h-4 mr-2" /> Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Impressions</CardTitle>
              <Users className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">1.2M</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> +12.5% vs last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Clicks</CardTitle>
              <MousePointer2 className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">45.2K</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> +8.2% vs last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Avg. CTR</CardTitle>
              <Activity className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">3.8%</div>
              <p className="text-xs text-red-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 rotate-180" /> -0.5% vs last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Conversion Rate</CardTitle>
              <BarChart3 className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">1.2%</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" /> +0.3% vs last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="impressions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorImp)" name="Impressions" />
                  <Area type="monotone" dataKey="clicks" stroke="#84cc16" fillOpacity={1} fill="url(#colorClick)" name="Clicks" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Campaigns</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-3">Campaign Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Impressions</th>
                    <th className="px-6 py-3">Clicks</th>
                    <th className="px-6 py-3">CTR</th>
                    <th className="px-6 py-3">Spend</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">Summer Sale 2024</td>
                    <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium">Active</span></td>
                    <td className="px-6 py-4">245,000</td>
                    <td className="px-6 py-4">12,500</td>
                    <td className="px-6 py-4">5.1%</td>
                    <td className="px-6 py-4">$4,500</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">Details</Button>
                    </td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">Black Friday Promo</td>
                    <td className="px-6 py-4"><span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-medium">Paused</span></td>
                    <td className="px-6 py-4">180,000</td>
                    <td className="px-6 py-4">8,200</td>
                    <td className="px-6 py-4">4.5%</td>
                    <td className="px-6 py-4">$3,200</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">Details</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}