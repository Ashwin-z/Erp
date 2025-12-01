import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  TrendingUp, FileText, CheckCircle2, XCircle, Clock, DollarSign,
  ArrowUpRight, ArrowDownRight, Calendar, Users, Target
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const COLORS = ['#84cc16', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function SalesDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [dateRange, setDateRange] = useState('30');

  const { data: quotations = [] } = useQuery({
    queryKey: ['quotations'],
    queryFn: () => base44.entities.Quotation.list('-created_date')
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list()
  });

  // Filter by date range
  const filterByDate = (items) => {
    const days = parseInt(dateRange);
    const startDate = subDays(new Date(), days);
    return items.filter(item => new Date(item.created_date) >= startDate);
  };

  const filteredQuotes = filterByDate(quotations);

  // Calculate metrics
  const totalQuotes = filteredQuotes.length;
  const acceptedQuotes = filteredQuotes.filter(q => q.status === 'accepted').length;
  const rejectedQuotes = filteredQuotes.filter(q => q.status === 'rejected').length;
  const pendingQuotes = filteredQuotes.filter(q => ['sent', 'viewed', 'draft'].includes(q.status)).length;
  const conversionRate = totalQuotes > 0 ? ((acceptedQuotes / totalQuotes) * 100).toFixed(1) : 0;
  
  const totalValue = filteredQuotes.reduce((sum, q) => sum + (q.total || 0), 0);
  const acceptedValue = filteredQuotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + (q.total || 0), 0);

  // Monthly chart data
  const getMonthlyData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthQuotes = quotations.filter(q => {
        const qDate = new Date(q.created_date);
        return isWithinInterval(qDate, { start: monthStart, end: monthEnd });
      });

      months.push({
        name: format(date, 'MMM'),
        issued: monthQuotes.length,
        accepted: monthQuotes.filter(q => q.status === 'accepted').length,
        value: monthQuotes.reduce((sum, q) => sum + (q.total || 0), 0) / 1000
      });
    }
    return months;
  };

  // Status breakdown for pie chart
  const statusData = [
    { name: 'Accepted', value: acceptedQuotes, color: '#10b981' },
    { name: 'Pending', value: pendingQuotes, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedQuotes, color: '#ef4444' }
  ].filter(d => d.value > 0);

  // Top products/services (mock data since we don't have product entity yet)
  const topProducts = [
    { name: 'Software License', value: 45000, count: 12 },
    { name: 'Implementation', value: 32000, count: 8 },
    { name: 'Support Package', value: 18000, count: 15 },
    { name: 'Training', value: 12000, count: 6 },
    { name: 'Custom Dev', value: 8500, count: 4 }
  ];

  // Recent activity
  const recentQuotes = filteredQuotes.slice(0, 5);

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    viewed: 'bg-purple-100 text-purple-700',
    accepted: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    expired: 'bg-amber-100 text-amber-700'
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto space-y-6">
            
            <div className="flex items-center justify-between">
              <PageHeader
                title="Sales Dashboard"
                subtitle="Track your quotation performance and sales metrics"
                icon={TrendingUp}
                iconColor="text-lime-600"
              />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Total Quotes</p>
                      <p className="text-3xl font-bold">{totalQuotes}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Accepted</p>
                      <p className="text-3xl font-bold text-emerald-600">{acceptedQuotes}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Pending</p>
                      <p className="text-3xl font-bold text-amber-600">{pendingQuotes}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Conversion Rate</p>
                      <p className="text-3xl font-bold text-lime-600">{conversionRate}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center">
                      <Target className="w-6 h-6 text-lime-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Total Value</p>
                      <p className="text-3xl font-bold">${(totalValue / 1000).toFixed(1)}K</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-violet-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Monthly Quotes Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getMonthlyData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar dataKey="issued" name="Quotes Issued" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="accepted" name="Accepted" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Quote Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-slate-400">
                      No data available
                    </div>
                  )}
                  <div className="flex justify-center gap-4 mt-4">
                    {statusData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Products/Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          >
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-slate-500">{product.count} quotes</p>
                          </div>
                        </div>
                        <span className="font-bold">${product.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentQuotes.length > 0 ? (
                    <div className="space-y-3">
                      {recentQuotes.map((quote, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium">{quote.customer_name || 'Unknown'}</p>
                            <p className="text-sm text-slate-500">
                              {quote.quote_number || `QT-${quote.id?.slice(-6)}`} • {format(new Date(quote.created_date), 'MMM d')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${(quote.total || 0).toLocaleString()}</p>
                            <Badge className={statusColors[quote.status] || statusColors.draft}>
                              {quote.status || 'draft'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      No recent quotes
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}