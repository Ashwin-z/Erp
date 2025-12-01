import React, { useState } from 'react';
import { 
  FileText, Download, Globe, ShieldCheck, Printer 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TaxFormGenerator() {
  const [region, setRegion] = useState('SG');

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" /> Statutory Reporting
            </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
            <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="SG">Singapore (IRAS)</SelectItem>
                    <SelectItem value="US">United States (IRS)</SelectItem>
                    <SelectItem value="UK">United Kingdom (HMRC)</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-red-600" />
                        <span className="font-semibold">GST F5 Return</span>
                    </div>
                    <Badge variant="outline">Quarterly</Badge>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                    Goods and Services Tax Return for reporting period Q3 2024.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                    <ShieldCheck className="w-3 h-3 mr-2 text-emerald-500" /> Verify & Generate
                </Button>
            </div>

            <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">IR8A Form</span>
                    </div>
                    <Badge variant="outline">Annual</Badge>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                    Employee Earnings Return for YA 2025. Includes auto-inclusion.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                    <Printer className="w-3 h-3 mr-2" /> Print Preview
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}