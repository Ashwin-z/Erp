import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, DollarSign, Info, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ESGInvoicePanel({ invoice, taxConfig }) {
  // Default fallback config if not provided
  const config = taxConfig || { carbon_tax_rate: 25.00 };
  
  const esgData = invoice.esg_details || {
    carbon_emissions_tonnes: 0,
    carbon_tax_rate: config.carbon_tax_rate,
    carbon_tax_amount: 0,
    esg_compliance_cost: 0
  };

  // Calculate visual indicators
  const emissionLevel = esgData.carbon_emissions_tonnes > 1 ? 'high' : esgData.carbon_emissions_tonnes > 0.1 ? 'medium' : 'low';
  const colorMap = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    low: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  };

  return (
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/30 to-white">
      <CardHeader className="pb-2 border-b border-emerald-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-800">
            <Leaf className="w-4 h-4" />
            Singapore Green Plan 2030 Compliance
          </CardTitle>
          <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
            Tax Rate: S${esgData.carbon_tax_rate.toFixed(2)}/tCO2e
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg border ${colorMap[emissionLevel]}`}>
            <div className="text-xs opacity-80 mb-1">Carbon Footprint</div>
            <div className="text-lg font-bold flex items-baseline gap-1">
              {esgData.carbon_emissions_tonnes.toFixed(4)}
              <span className="text-xs font-normal">tonnes</span>
            </div>
            <div className="text-[10px] mt-1 opacity-75 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Based on MAS Scope 3 factors
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-white border-slate-200">
            <div className="text-xs text-slate-500 mb-1">Carbon Tax Payable</div>
            <div className="text-lg font-bold text-slate-900 flex items-baseline gap-1">
              S${esgData.carbon_tax_amount.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {esgData.carbon_tax_amount === 0 ? 'Below taxable threshold' : 'Included in invoice total'}
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-white border-slate-200">
            <div className="text-xs text-slate-500 mb-1">ESG Compliance Cost</div>
            <div className="text-lg font-bold text-slate-900 flex items-baseline gap-1">
              S${esgData.esg_compliance_cost.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Processing & Reporting
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-500 flex items-start gap-2 bg-white p-2 rounded border border-slate-100">
          <AlertCircle className="w-3 h-3 mt-0.5 text-blue-500" />
          <p>
            This invoice includes mandatory carbon emissions reporting data in accordance with IRAS and MAS guidelines. 
            Carbon tax is calculated at S$25.00/tonne (2024-2025 rate). 
            <span className="font-medium text-slate-700"> Zero payment is stated if emissions are negligible.</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}