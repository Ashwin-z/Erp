import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const initialData = [
  { name: '1', value: 4000 },
  { name: '2', value: 3000 },
  { name: '3', value: 2000 },
  { name: '4', value: 2780 },
  { name: '5', value: 1890 },
  { name: '6', value: 2390 },
  { name: '7', value: 3490 },
  { name: '8', value: 2900 },
  { name: '9', value: 3100 },
  { name: '10', value: 3800 },
];

export default function RWAInsightsWidget() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => {
        const newData = [...currentData];
        const firstItem = newData.shift();
        // Generate a slightly random next value based on the last one
        const lastValue = newData[newData.length - 1].value;
        const variance = (Math.random() - 0.5) * 1000; 
        let nextValue = lastValue + variance;
        // Keep within bounds
        nextValue = Math.max(1500, Math.min(4500, nextValue));
        
        newData.push({
            name: (parseInt(newData[newData.length - 1].name) + 1).toString(),
            value: nextValue
        });
        return newData;
      });
    }, 2000); // Update every 2 seconds for a "moving" feel

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white border-slate-200 shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-800 text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            RWA Predictive Insights
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            AI Watch Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {/* Early Warnings */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-red-600 uppercase">Liquidity Risk</span>
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                    </div>
                    <div className="text-lg font-bold text-slate-900">12.4%</div>
                    <div className="text-xs text-red-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> +2.1% (Q4 Forecast)
                    </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-emerald-600 uppercase">Asset Value</span>
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="text-lg font-bold text-slate-900">+4.5%</div>
                    <div className="text-xs text-emerald-600 flex items-center">
                        Stable Outlook
                    </div>
                </div>
            </div>

            {/* Mini Chart */}
            <div className="h-[120px] w-full mt-2">
                <p className="text-xs text-slate-500 mb-2 font-medium">Valuation Volatility Forecast</p>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValueLight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#1e293b', fontSize: '12px' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#f59e0b" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#colorValueLight)" 
                            isAnimationActive={true}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}