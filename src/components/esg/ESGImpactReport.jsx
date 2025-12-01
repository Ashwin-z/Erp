import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, Share2, Globe, Target } from 'lucide-react';

export default function ESGImpactReport() {
  const data = [
    { name: 'Scope 1', actual: 45, target: 40 },
    { name: 'Scope 2', actual: 30, target: 25 },
    { name: 'Scope 3', actual: 150, target: 120 },
    { name: 'Waste', actual: 20, target: 15 },
    { name: 'Water', actual: 10, target: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Sustainability Impact Report</h3>
          <p className="text-sm text-slate-500">Performance against 2030 targets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Emissions vs Targets (tCO2e)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="actual" name="Actual" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="target" name="Target" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" /> 2030 Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">Carbon Neutrality</span>
                <span className="text-emerald-400 font-bold">65%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full">
                <div className="h-full w-[65%] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">Supply Chain Audit</span>
                <span className="text-blue-400 font-bold">40%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full">
                <div className="h-full w-[40%] bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full" />
              </div>
            </div>

            <div className="p-4 bg-slate-800 rounded-lg mt-4">
              <p className="text-xs text-slate-400 mb-1">Projected Tax Savings</p>
              <p className="text-2xl font-bold text-white">$12,450</p>
              <p className="text-xs text-emerald-400 mt-1">via carbon reduction</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}