import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Link2, Building2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const suggestions = [
  {
    id: 1,
    bankDesc: "TRF - TECHSTART PTE LTD",
    amount: 4500.00,
    date: "Dec 18",
    matchTo: "INV-2024-0892",
    matchVendor: "TechStart Pte Ltd",
    confidence: 98
  },
  {
    id: 2,
    bankDesc: "PYMT - MARINA FOODS",
    amount: 2890.50,
    date: "Dec 17",
    matchTo: "INV-2024-0891",
    matchVendor: "Marina Foods Co.",
    confidence: 95
  },
  {
    id: 3,
    bankDesc: "PAYMENT REF 48291",
    amount: 12400.00,
    date: "Dec 16",
    matchTo: "INV-2024-0885",
    matchVendor: "Urban Retail Group",
    confidence: 92
  }
];

export default function ReconciliationWidget() {
  return (
    <TooltipProvider>
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Link2 className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg">Reconciliation</CardTitle>
            </div>
            <Link to={createPageUrl('BankReconciliation')}>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200">
                {suggestions.length} Suggestions
              </Badge>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions.map((item, index) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{item.bankDesc}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">${item.amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-600">{item.matchTo}</span>
                    <span className="text-xs text-slate-400">({item.matchVendor})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Progress value={item.confidence} className="w-20 h-2" />
                      <span className="text-xs text-slate-500">{item.confidence}% match</span>
                    </div>
                    <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Apply
                    </Button>
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>Click to view transaction details in Bank Reconciliation</TooltipContent>
            </Tooltip>
          ))}
          
          <Link to={createPageUrl('BankReconciliation')}>
            <Button variant="outline" className="w-full mt-2" size="sm">
              View All Suggestions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}