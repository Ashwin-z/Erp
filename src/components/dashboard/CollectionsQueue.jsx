import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const customers = [
  {
    id: 1,
    name: "Marina Foods Co.",
    amount: 8450,
    daysOverdue: 15,
    score: 85,
    action: "Send email reminder",
    priority: "high"
  },
  {
    id: 2,
    name: "TechStart Pte Ltd",
    amount: 4200,
    daysOverdue: 7,
    score: 72,
    action: "Schedule call",
    priority: "medium"
  },
  {
    id: 3,
    name: "Global Logistics SG",
    amount: 12800,
    daysOverdue: 3,
    score: 65,
    action: "Early reminder",
    priority: "low"
  },
  {
    id: 4,
    name: "Skyline Properties",
    amount: 6500,
    daysOverdue: 21,
    score: 92,
    action: "Escalate to manager",
    priority: "high"
  }
];

const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-blue-100 text-blue-700'
};

export default function CollectionsQueue() {
  return (
    <TooltipProvider>
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg">Collections Queue</CardTitle>
            </div>
            <Link to={createPageUrl('AccountsReceivable')}>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 cursor-pointer hover:bg-amber-200">
                ${customers.reduce((sum, c) => sum + c.amount, 0).toLocaleString()} Outstanding
              </Badge>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customers.map((customer, index) => (
              <Tooltip key={customer.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 hover:shadow-md transition-all cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                        {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-slate-900 text-sm truncate">
                          {customer.name}
                        </span>
                        <Badge className={`text-xs ${priorityColors[customer.priority]}`}>
                          {customer.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>${customer.amount.toLocaleString()}</span>
                        <span className="text-red-500">{customer.daysOverdue}d overdue</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                        <Mail className="w-4 h-4 text-slate-400" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                        <Phone className="w-4 h-4 text-slate-400" />
                      </Button>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Click to view {customer.name}'s invoice details</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Link to={createPageUrl('AccountsReceivable')}>
            <Button variant="outline" className="w-full mt-4" size="sm">
              View Full Queue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}