import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, Clock, AlertCircle, Eye, ArrowRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const documents = [
  {
    id: 1,
    name: "Invoice_TechCorp_Dec2024.pdf",
    type: "Invoice",
    uploadedAt: "2 mins ago",
    status: "processed",
    extracted: { vendor: "TechCorp Ltd", amount: "$4,500", date: "Dec 18" }
  },
  {
    id: 2,
    name: "Receipt_Amazon_Web.pdf",
    type: "Receipt",
    uploadedAt: "15 mins ago",
    status: "processing",
    extracted: null
  },
  {
    id: 3,
    name: "Statement_DBS_Nov.pdf",
    type: "Statement",
    uploadedAt: "1 hour ago",
    status: "review",
    extracted: { transactions: 42, amount: "$128,450" }
  },
  {
    id: 4,
    name: "Invoice_Supplier_2891.pdf",
    type: "Invoice",
    uploadedAt: "2 hours ago",
    status: "processed",
    extracted: { vendor: "ABC Supplies", amount: "$890", date: "Dec 15" }
  }
];

const statusConfig = {
  processed: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100', label: 'Processed' },
  processing: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Processing' },
  review: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-100', label: 'Review' }
};

export default function RecentDocuments() {
  return (
    <TooltipProvider>
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg">Recent Documents</CardTitle>
            </div>
            <Button size="sm" variant="outline">
              Upload New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc, index) => {
              const status = statusConfig[doc.status];
              const linkTo = doc.type === 'Invoice' ? 'AccountsPayable' : doc.type === 'Statement' ? 'BankReconciliation' : 'AccountsPayable';
              return (
                <Tooltip key={doc.id}>
                  <TooltipTrigger asChild>
                    <Link to={createPageUrl(linkTo)}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-transform">
                          <FileText className="w-5 h-5 text-slate-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-slate-900 text-sm truncate">
                              {doc.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{doc.type}</span>
                            <span>•</span>
                            <span>{doc.uploadedAt}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={`${status.bg} ${status.color.replace('text-', 'text-')}`}>
                            <status.icon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Eye className="w-4 h-4 text-slate-400" />
                          </Button>
                        </div>
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Click to view {doc.type.toLowerCase()} in {linkTo === 'AccountsPayable' ? 'Accounts Payable' : 'Bank Reconciliation'}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          <Link to={createPageUrl('AccountsPayable')}>
            <Button variant="outline" className="w-full mt-4" size="sm">
              View All Documents
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}