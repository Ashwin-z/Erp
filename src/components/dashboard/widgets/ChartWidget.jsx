import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Share2, MoreHorizontal } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#84cc16', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function ChartWidget({ widget, onSettings }) {
  const { title, widget_type, config, data } = widget;
  const chartData = data?.series || [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 }
  ];
  const isPrivate = widget.visibility === 'private';

  const renderChart = () => {
    switch (widget_type) {
      case 'line_chart':
        return (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#84cc16" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar_chart':
        return (
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#84cc16" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie_chart':
      case 'donut_chart':
        return (
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={widget_type === 'donut_chart' ? 30 : 0}
                outerRadius={60}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {title}
          {isPrivate && <Lock className="w-3 h-3 text-slate-400" />}
          {widget.visibility !== 'private' && (
            <Badge variant="outline" className="text-[10px]">Shared</Badge>
          )}
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onSettings}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {renderChart()}
      </CardContent>
    </Card>
  );
}