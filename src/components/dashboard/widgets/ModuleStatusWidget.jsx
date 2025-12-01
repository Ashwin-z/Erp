import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const modules = [
  { name: 'CRM', status: 'active', href: 'CRM' },
  { name: 'Sales', status: 'active', href: 'Sales' },
  { name: 'Projects', status: 'active', href: 'Projects' },
  { name: 'Finance', status: 'active', href: 'GeneralLedger' },
  { name: 'HR', status: 'active', href: 'HRManagement' },
  { name: 'Inventory', status: 'active', href: 'Inventory' },
  { name: 'Gov API', status: 'active', href: 'GovIntegration', new: true },
  { name: 'ESG', status: 'active', href: 'ESGDashboard', new: true },
  { name: 'RWA', status: 'active', href: 'RWADashboard' },
  { name: 'InvoiceNow', status: 'active', href: 'InvoiceNow' }
];

export default function ModuleStatusWidget() {
  return (
    <Card className="border-slate-200 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">System Modules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {modules.map((mod) => (
            <Link 
              key={mod.name} 
              to={createPageUrl(mod.href)}
              className="flex items-center justify-between p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900">{mod.name}</span>
              </div>
              {mod.new && <Badge className="text-[10px] px-1 py-0 h-4 bg-blue-100 text-blue-700">New</Badge>}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}