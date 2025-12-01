import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, AlertTriangle, TrendingUp, CheckCircle2, 
  X, ChevronRight, Zap, DollarSign 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const alerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Cash risk detected',
    description: 'Projected shortfall of $12,430 in 18 days based on current burn rate and expected collections.',
    action: 'View Details',
    icon: AlertTriangle,
    color: 'red',
    link: 'CashflowForecast',
    tooltip: 'View detailed cashflow forecast'
  },
  {
    id: 2,
    type: 'recommendation',
    title: '3 invoices ready for auto-reconciliation',
    description: 'AI has matched transactions with 98% confidence. Review and apply with one click.',
    action: 'Apply Now',
    icon: Zap,
    color: 'lime',
    link: 'BankReconciliation',
    tooltip: 'Go to bank reconciliation'
  },
  {
    id: 3,
    type: 'insight',
    title: 'Collect from Marina Foods Co.',
    description: '$8,450 overdue by 15 days. High-priority based on payment history and account value.',
    action: 'Send Reminder',
    icon: DollarSign,
    color: 'amber',
    link: 'AccountsReceivable',
    tooltip: 'View accounts receivable'
  }
];

const colorClasses = {
  red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', badge: 'bg-red-100 text-red-700' },
  lime: { bg: 'bg-lime-50', border: 'border-lime-200', icon: 'text-lime-600', badge: 'bg-lime-100 text-lime-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', badge: 'bg-amber-100 text-amber-700' }
};

export default function AIAlerts() {
  return (
    <TooltipProvider>
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg">AI Insights & Actions</CardTitle>
            </div>
            <Link to={createPageUrl('AIInsights')}>
              <Badge variant="secondary" className="bg-violet-100 text-violet-700 cursor-pointer hover:bg-violet-200">
                {alerts.length} Active
              </Badge>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.map((alert, index) => {
            const colors = colorClasses[alert.color];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${colors.bg} border ${colors.border} rounded-xl p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to={createPageUrl(alert.link)}>
                        <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm cursor-pointer hover:scale-110 transition-transform`}>
                          <alert.icon className={`w-5 h-5 ${colors.icon}`} />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>{alert.tooltip}</TooltipContent>
                  </Tooltip>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900 text-sm">{alert.title}</h4>
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{alert.description}</p>
                    <div className="flex items-center gap-2">
                      <Link to={createPageUrl(alert.link)}>
                        <Button size="sm" className="h-8 text-xs bg-slate-900 hover:bg-slate-800">
                          {alert.action}
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-slate-600">
                        Dismiss
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-slate-600">
                        Explain
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}