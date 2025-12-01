import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PieChart, Activity, TrendingUp, BarChart3, 
  AlertTriangle, Download, Eye, Globe, Zap, ArrowUpRight, TrendingDown
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, ReferenceLine } from 'recharts';

const data = [
  { name: 'Jan', value: 4000, risk: 2400, volatility: 12 },
  { name: 'Feb', value: 3000, risk: 1398, volatility: 15 },
  { name: 'Mar', value: 2000, risk: 9800, volatility: 45 },
  { name: 'Apr', value: 2780, risk: 3908, volatility: 22 },
  { name: 'May', value: 1890, risk: 4800, volatility: 28 },
  { name: 'Jun', value: 2390, risk: 3800, volatility: 18 },
  { name: 'Jul', value: 3490, risk: 4300, volatility: 14 },
];

export default function RWAPortfolioAnalytics() {
  return (
    <div className="space-y-6">
        {/* Early Warning System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900/50 border-slate-800 bg-gradient-to-br from-red-500/5 to-transparent">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-xs uppercase font-medium">Liquidity Risk</span>
                        <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">High</Badge>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-white">12.4%</span>
                        <span className="text-red-400 text-xs mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +2.1%</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-2">AI detected potential redemption pressure in Q4.</p>
                </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-xs uppercase font-medium">Asset Depreciation</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">Low</Badge>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-white">0.8%</span>
                        <span className="text-emerald-400 text-xs mb-1 flex items-center"><TrendingDown className="w-3 h-3 mr-1" /> -0.2%</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-2">Real estate portfolio maintaining stable value.</p>
                </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 bg-gradient-to-br from-amber-500/5 to-transparent">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-xs uppercase font-medium">Market Volatility</span>
                        <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">Medium</Badge>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-white">24.5</span>
                        <span className="text-amber-400 text-xs mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> VIX</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-2">AI prediction: Moderate fluctuations expected next week.</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        AI Valuation Forecast
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
                                <ReferenceLine x="Jul" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Forecast', fill: '#f59e0b', fontSize: 10 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        Predictive Risk Heatmap
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                />
                                <Bar dataKey="volatility" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Volatility %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-sm" />
                            <span>AI Predicted Volatility</span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <Globe className="w-4 h-4 text-slate-500" />
                            <span>Cross-Ref: Global Markets</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}