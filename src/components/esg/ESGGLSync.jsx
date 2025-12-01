import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, TrendingUp, FileText, RefreshCw, Loader2, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function ESGGLSync() {
  const [syncing, setSyncing] = useState(false);
  const queryClient = useQueryClient();

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoicenow'],
    queryFn: () => base44.entities.InvoiceNow.filter({ status: 'paid' }) // Sync paid invoices
  });

  const { data: esgLogs = [] } = useQuery({
    queryKey: ['esg-logs'],
    queryFn: () => base44.entities.ESGLog.list('-date')
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      let syncedCount = 0;
      
      // Find invoices not yet logged in ESGLog
      // This is a simplified check. In prod, you'd filter better.
      const loggedIds = new Set(esgLogs.map(l => l.invoice_id));
      const toSync = invoices.filter(inv => !loggedIds.has(inv.id) && inv.esg_details?.carbon_tax_amount > 0);

      for (const inv of toSync) {
        // 1. Create ESG Log
        await base44.entities.ESGLog.create({
          invoice_id: inv.id,
          invoice_number: inv.invoice_number,
          date: inv.issue_date,
          type: 'input', // Assuming input for now, logic can vary
          emissions_tonnes: inv.esg_details.carbon_emissions_tonnes,
          carbon_tax: inv.esg_details.carbon_tax_amount,
          esg_score_impact: -1 * inv.esg_details.carbon_emissions_tonnes, // Simplistic scoring
          description: `Carbon tax for Invoice ${inv.invoice_number}`
        });

        // 2. Create GL Entry (Simulated via entity creation if GeneralLedger existed, or just log)
        // Assuming GeneralLedger entity exists from context snapshot
        if (base44.entities.GeneralLedger) {
          await base44.entities.GeneralLedger.create({
            journal_id: `JE-ESG-${inv.invoice_number}`,
            date: new Date().toISOString().split('T')[0],
            description: `Carbon Tax Provision - ${inv.invoice_number}`,
            account_code: '2050', // Provision for Taxes
            debit: 0,
            credit: inv.esg_details.carbon_tax_amount,
            currency: 'SGD',
            status: 'posted'
          });
           await base44.entities.GeneralLedger.create({
            journal_id: `JE-ESG-${inv.invoice_number}`,
            date: new Date().toISOString().split('T')[0],
            description: `ESG Expense - ${inv.invoice_number}`,
            account_code: '6100', // ESG Expense
            debit: inv.esg_details.carbon_tax_amount,
            credit: 0,
            currency: 'SGD',
            status: 'posted'
          });
        }
        
        syncedCount++;
      }
      return syncedCount;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['esg-logs'] });
      toast.success(`Synced ${count} ESG entries to General Ledger`);
    }
  });

  const handleSync = () => {
    setSyncing(true);
    syncMutation.mutate(undefined, {
      onSettled: () => setSyncing(false)
    });
  };

  return (
    <Card className="border-emerald-200 bg-emerald-50/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-emerald-800">
            <Leaf className="w-5 h-5" />ESG & Finance Sync
          </CardTitle>
          <Button 
            onClick={handleSync} 
            disabled={syncing} 
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Sync to Ledger
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-3 rounded-lg border border-emerald-100 text-center">
            <div className="text-2xl font-bold text-emerald-700">{esgLogs.length}</div>
            <div className="text-xs text-slate-500">Logged Transactions</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-emerald-100 text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {(esgLogs.reduce((s, l) => s + (l.emissions_tonnes || 0), 0)).toFixed(2)}t
            </div>
            <div className="text-xs text-slate-500">Total Emissions</div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-emerald-100 text-center">
            <div className="text-2xl font-bold text-emerald-700">
              S${(esgLogs.reduce((s, l) => s + (l.carbon_tax || 0), 0)).toFixed(2)}
            </div>
            <div className="text-xs text-slate-500">Total Carbon Tax</div>
          </div>
        </div>
        
        {esgLogs.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Recent Sync Activity</p>
            {esgLogs.slice(0, 3).map(log => (
              <div key={log.id} className="flex items-center justify-between text-sm p-2 bg-white rounded border border-slate-100">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px]">{log.invoice_number}</Badge>
                  <span className="text-slate-600">{moment(log.date).format('DD MMM')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{log.emissions_tonnes.toFixed(3)}t CO2e</span>
                  <span className="font-medium text-emerald-700">S${log.carbon_tax.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}