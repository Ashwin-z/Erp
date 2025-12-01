import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ProjectHealthWidget() {
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list()
  });

  const active = projects.filter(p => p.status === 'in_progress');
  const delayed = projects.filter(p => p.status === 'in_progress' && new Date(p.end_date) < new Date());
  
  const totalBudget = active.reduce((s, p) => s + (p.budget || 0), 0);
  const totalSpent = active.reduce((s, p) => s + (p.spent || 0), 0);
  const healthScore = totalBudget > 0 ? Math.max(0, 100 - ((totalSpent / totalBudget) * 100)) : 100;

  return (
    <Card className="border-slate-200 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-600" />Project Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-violet-50 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-violet-700">{active.length}</div>
            <div className="text-xs text-violet-600">Active</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg text-center">
            <div className="text-xl font-bold text-amber-700">{delayed.length}</div>
            <div className="text-xs text-amber-600">Delayed</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Budget Health</span>
            <span className={`font-medium ${healthScore < 20 ? 'text-red-600' : 'text-emerald-600'}`}>
              {healthScore.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${healthScore < 20 ? 'bg-red-500' : 'bg-emerald-500'}`} 
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}