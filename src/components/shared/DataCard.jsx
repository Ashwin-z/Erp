import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DataCard({ 
  label, 
  value, 
  change, 
  trend = 'up', 
  sub,
  icon: Icon,
  iconBg = 'bg-lime-500',
  linkTo,
  tooltip,
  alert = false,
  onClick
}) {
  const content = (
    <Card className={`border-slate-200 transition-all duration-200 ${linkTo || onClick ? 'cursor-pointer hover:shadow-lg hover:border-lime-300' : ''} ${alert ? 'border-red-200 bg-red-50' : ''}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${alert ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
            {change && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${
                trend === 'up' ? 'text-emerald-600' : 
                trend === 'down' ? 'text-red-500' : 'text-slate-500'
              }`}>
                {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                {change}
              </p>
            )}
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
          </div>
          {Icon && (
            <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
          {linkTo && (
            <ExternalLink className="w-4 h-4 text-slate-300 ml-2" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  const wrappedContent = tooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : content;

  if (linkTo) {
    return (
      <Link to={createPageUrl(linkTo)}>
        {wrappedContent}
      </Link>
    );
  }

  if (onClick) {
    return <div onClick={onClick}>{wrappedContent}</div>;
  }

  return wrappedContent;
}