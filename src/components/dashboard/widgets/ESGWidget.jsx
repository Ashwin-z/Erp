import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TrendingDown, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ESGWidget() {
  const { data: esgLogs = [] } = useQuery({
    queryKey: ['esg-logs'],
    queryFn: () => base44.entities.ESGLog.list('-date')
  });

  const totalEmissions = esgLogs.reduce((sum, l) => sum + (l.emissions_tonnes || 0), 0);
  const totalTax = esgLogs.reduce((sum, l) => sum + (l.carbon_tax || 0), 0);

  return (
    <Card className="border-slate-200 h-full bg-gradient-to-br from-emerald-50/50 to-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-emerald-800">
          <Leaf className="w-4 h-4" />ESG Scorecard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-3xl font-bold text-emerald-700">78</span>
          <span className="text-sm text-emerald-600 mb-1">/ 100</span>
          <Badge className="bg-emerald-100 text-emerald-700 mb-1 ml-auto">Good</Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              Carbon
            </div>
            <span className="font-medium">{totalEmissions.toFixed(2)}t</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Zap className="w-4 h-4 text-amber-500" />
              Tax Liability
            </div>
            <span className="font-medium">S${totalTax.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}