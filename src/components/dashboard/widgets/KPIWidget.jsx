import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Lock, Share2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function KPIWidget({ widget, onShare, isOwner }) {
  const { title, config, data } = widget;
  const value = data?.value || 0;
  const trend = data?.trend || 0;
  const target = data?.target || 0;
  const isPrivate = widget.visibility === 'private';

  return (
    <Card className="h-full hover:shadow-lg transition-all">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">{title}</span>
          <div className="flex items-center gap-1">
            {isPrivate && <Lock className="w-3 h-3 text-slate-400" />}
            {widget.visibility !== 'private' && (
              <Badge variant="outline" className="text-[10px]">
                <Share2 className="w-2 h-2 mr-1" />
                Shared
              </Badge>
            )}
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <span className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 text-sm ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-slate-500'
          }`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : 
             trend < 0 ? <TrendingDown className="w-4 h-4" /> : 
             <Minus className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
          {target > 0 && (
            <span className="text-xs text-slate-500">Target: {target.toLocaleString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}