import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, TrendingUp, TrendingDown, PieChart, Target, 
  ArrowUpRight, ArrowDownRight, Download, RefreshCw, Sparkles,
  DollarSign, ShoppingCart, Users, Building2, Calendar
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

// Singapore dummy data
const revenueData = [
  { month: 'Jul', actual: 145000, forecast: 140000, budget: 135000 },
  { month: 'Aug', actual: 158000, forecast: 155000, budget: 150000 },
  { month: 'Sep', actual: 162000, forecast: 160000, budget: 155000 },
  { month: 'Oct', actual: 175000, forecast: 170000, budget: 165000 },
  { month: 'Nov', actual: 188000, forecast: 185000, budget: 180000 },
  { month: 'Dec', actual: 195000, forecast: 200000, budget: 190000 },
];

const expenseBreakdown = [
  { name: 'Payroll', value: 85000, color: '#8b5cf6' },
  { name: 'Rent & Utilities', value: 25000, color: '#06b6d4' },
  { name: 'Marketing', value: 18000, color: '#f59e0b' },
  { name: 'Software & IT', value: 12000, color: '#10b981' },
  { name: 'Professional Services', value: 8500, color: '#ec4899' },
  { name: 'Others', value: 6500, color: '#6b7280' },
];

const varianceData = [
  { category: 'Revenue', actual: 195000, budget: 190000, variance: 5000, percentage: 2.6 },
  { category: 'Cost of Sales', actual: 78000, budget: 76000, variance: -2000, percentage: -2.6 },
  { category: 'Gross Profit', actual: 117000, budget: 114000, variance: 3000, percentage: 2.6 },
  { category: 'Operating Expenses', actual: 155000, budget: 150000, variance: -5000, percentage: -3.3 },
  { category: 'Net Profit', actual: 62000, budget: 64000, variance: -2000, percentage: -3.1 },
];

const predictiveTrends = [
  { month: 'Jan 25', revenue: 205000, expenses: 162000, profit: 43000 },
  { month: 'Feb 25', revenue: 198000, expenses: 158000, profit: 40000 },
  { month: 'Mar 25', revenue: 215000, expenses: 165000, profit: 50000 },
  { month: 'Apr 25', revenue: 225000, expenses: 170000, profit: 55000 },
  { month: 'May 25', revenue: 235000, expenses: 175000, profit: 60000 },
  { month: 'Jun 25', revenue: 248000, expenses: 180000, profit: 68000 },
];

const kpiMetrics = [
  { label: 'Gross Margin', value: '60%', trend: 'up', change: '+2.3%', target: '58%' },
  { label: 'Operating Margin', value: '31.8%', trend: 'down', change: '-1.2%', target: '35%' },
  { label: 'Current Ratio', value: '2.4', trend: 'up', change: '+0.3', target: '2.0' },
  { label: 'Debt/Equity', value: '0.45', trend: 'up', change: '-0.05', target: '0.5' },
  { label: 'DSO', value: '32 days', trend: 'down', change: '-3 days', target: '30 days' },
  { label: 'DPO', value: '28 days', trend: 'up', change: '+2 days', target: '30 days' },
];

export default function AdvancedAnalytics() {
  const [period, setPeriod] = useState('dec_2024');
  const [chartType, setChartType] = useState('revenue');

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dec_2024">December 2024</SelectItem>
                <SelectItem value="q4_2024">Q4 2024</SelectItem>
                <SelectItem value="fy_2024">FY 2024</SelectItem>
              </SelectContent>
            </Select>
            <Badge className="bg-emerald-100 text-emerald-700">
              <RefreshCw className="w-3 h-3 mr-1" />
              Synced 2 mins ago
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Analysis
            </Button>
          </div>
        </div>

        {/* KPI Metrics */}
        <div className="grid grid-cols-6 gap-4">
          {kpiMetrics.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                      <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs flex items-center ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {kpi.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {kpi.change}
                        </span>
                        <span className="text-xs text-slate-400">Target: {kpi.target}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>Click for detailed breakdown</TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue vs Budget vs Forecast */}
          <Card className="lg:col-span-2 border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-500" />
                  Revenue Analysis
                </CardTitle>
                <Tabs value={chartType} onValueChange={setChartType}>
                  <TabsList className="h-8">
                    <TabsTrigger value="revenue" className="text-xs px-3">Revenue</TabsTrigger>
                    <TabsTrigger value="comparison" className="text-xs px-3">Comparison</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                  <Bar dataKey="actual" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Actual" />
                  <Bar dataKey="forecast" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Forecast" />
                  <Bar dataKey="budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Budget" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-500" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPie>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {expenseBreakdown.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variance Analysis */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" />
              Variance Analysis (Actual vs Budget)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {varianceData.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
                >
                  <div className="w-32">
                    <span className="font-medium text-slate-900">{item.category}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Actual</p>
                      <p className="font-semibold">${item.actual.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Budget</p>
                      <p className="font-semibold">${item.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Variance</p>
                      <p className={`font-semibold ${item.variance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {item.variance >= 0 ? '+' : ''}${item.variance.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={Math.abs(item.percentage) * 10} 
                        className={`h-2 flex-1 ${item.variance >= 0 ? '' : '[&>div]:bg-red-500'}`}
                      />
                      <span className={`text-sm font-medium ${item.variance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {item.percentage >= 0 ? '+' : ''}{item.percentage}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictive Trends */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                AI Predictive Trends (6-Month Forecast)
              </CardTitle>
              <Badge className="bg-blue-100 text-blue-700">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={predictiveTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Revenue" />
                <Area type="monotone" dataKey="expenses" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Expenses" />
                <Area type="monotone" dataKey="profit" stackId="3" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Profit" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800">
                <Sparkles className="w-4 h-4 inline mr-2" />
                <strong>AI Insight:</strong> Based on current trends, revenue is projected to grow 27% over the next 6 months. 
                Consider increasing inventory for Q1 2025 to meet demand.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}