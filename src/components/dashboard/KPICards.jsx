import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const kpis = [
  {
    title: "Cash Runway",
    value: "87 days",
    change: "+12 days",
    trend: "up",
    icon: Clock,
    color: "lime",
    link: "CashflowForecast",
    tooltip: "Click to view 90-day cashflow forecast"
  },
  {
    title: "Bank Balance",
    value: "S$248,520",
    change: "+8.3%",
    trend: "up",
    icon: DollarSign,
    color: "emerald",
    link: "BankReconciliation",
    tooltip: "Click to view bank reconciliation"
  },
  {
    title: "AR Overdue",
    value: "S$32,450",
    change: "-S$5,200",
    trend: "down",
    icon: AlertTriangle,
    color: "amber",
    link: "AccountsReceivable",
    tooltip: "Click to view overdue invoices"
  },
  {
    title: "AP Due",
    value: "S$18,900",
    change: "Due in 7 days",
    trend: "neutral",
    icon: CreditCard,
    color: "blue",
    link: "AccountsPayable",
    tooltip: "Click to view payables"
  },
  {
    title: "Monthly Burn",
    value: "S$42,800",
    change: "-3.2%",
    trend: "down",
    icon: TrendingDown,
    color: "violet",
    link: "CashflowForecast",
    tooltip: "Click to view expense breakdown"
  }
];

const colorMap = {
  lime: { bg: 'bg-lime-50', icon: 'bg-lime-500', text: 'text-lime-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-50', icon: 'bg-amber-500', text: 'text-amber-600' },
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-500', text: 'text-blue-600' },
  violet: { bg: 'bg-violet-50', icon: 'bg-violet-500', text: 'text-violet-600' }
};

export default function KPICards() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => {
          const colors = colorMap[kpi.color];
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={createPageUrl(kpi.link)}>
                    <Card className="p-5 shadow-sm hover:shadow-xl hover:border-lime-400/50 hover:ring-2 hover:ring-lime-400/20 transition-all cursor-pointer border-slate-200 group bg-white/80 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-3">
                        <motion.div 
                          className={`w-10 h-10 rounded-xl ${colors.icon} flex items-center justify-center shadow-md`}
                          whileHover={{ rotate: 15, scale: 1.1 }}
                        >
                          <kpi.icon className="w-5 h-5 text-white" />
                        </motion.div>
                        {kpi.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                        {kpi.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      </div>
                      <p className="text-sm text-slate-500 mb-1">{kpi.title}</p>
                      <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                      <p className={`text-xs mt-1 ${
                        kpi.trend === 'up' ? 'text-emerald-600' : 
                        kpi.trend === 'down' && kpi.title !== 'Monthly Burn' ? 'text-red-600' : 
                        kpi.trend === 'down' && kpi.title === 'Monthly Burn' ? 'text-emerald-600' :
                        'text-slate-500'
                      }`}>
                        {kpi.change}
                      </p>
                    </Card>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{kpi.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}