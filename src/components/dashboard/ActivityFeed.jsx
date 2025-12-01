import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Activity, FileText, CheckCircle2, User, 
  DollarSign, Mail, AlertTriangle, Clock 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const activities = [
  {
    id: 1,
    type: 'reconciliation',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100',
    title: 'Auto-reconciled 3 transactions',
    description: 'AI matched bank transactions to invoices',
    time: '2 mins ago',
    user: 'System',
    link: 'BankReconciliation'
  },
  {
    id: 2,
    type: 'document',
    icon: FileText,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
    title: 'Invoice uploaded',
    description: 'Invoice_TechCorp_Dec2024.pdf processed',
    time: '5 mins ago',
    user: 'Sarah Chen',
    link: 'AccountsPayable'
  },
  {
    id: 3,
    type: 'payment',
    icon: DollarSign,
    color: 'text-lime-500',
    bg: 'bg-lime-100',
    title: 'Payment received',
    description: '$4,500 from TechStart Pte Ltd',
    time: '1 hour ago',
    user: 'System',
    link: 'AccountsReceivable'
  },
  {
    id: 4,
    type: 'email',
    icon: Mail,
    color: 'text-violet-500',
    bg: 'bg-violet-100',
    title: 'Reminder sent',
    description: 'Payment reminder to Marina Foods',
    time: '2 hours ago',
    user: 'AI Collections',
    link: 'AccountsReceivable'
  },
  {
    id: 5,
    type: 'alert',
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-100',
    title: 'Cash alert generated',
    description: 'Projected shortfall in 18 days',
    time: '3 hours ago',
    user: 'AI Forecast',
    link: 'CashflowForecast'
  }
];

export default function ActivityFeed() {
  return (
    <TooltipProvider>
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg">Activity Feed</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />

            <div className="space-y-4">
              {activities.map((activity, index) => (
                <Tooltip key={activity.id}>
                  <TooltipTrigger asChild>
                    <Link to={createPageUrl(activity.link)}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 relative cursor-pointer hover:bg-slate-50 rounded-lg p-2 -ml-2 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center flex-shrink-0 z-10`}>
                          <activity.icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0 pb-4">
                          <p className="font-medium text-slate-900 text-sm">{activity.title}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{activity.time}</span>
                            <span>•</span>
                            <span>{activity.user}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Click to view details</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}