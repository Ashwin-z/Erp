import React, { useState } from 'react';
import { 
  BookOpen, Download, Layers, Eye, BarChart 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function IFRSReporter() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> IFRS Financial Statements
            </CardTitle>
            <div className="flex gap-2">
                <Button size="sm" variant="outline">
                    <Layers className="w-4 h-4 mr-2" /> Consolidate
                </Button>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Download className="w-4 h-4 mr-2" /> Export XBRL
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bs">
            <TabsList className="mb-4">
                <TabsTrigger value="bs">Balance Sheet</TabsTrigger>
                <TabsTrigger value="pl">Profit & Loss</TabsTrigger>
                <TabsTrigger value="cf">Cash Flow</TabsTrigger>
                <TabsTrigger value="notes">Disclosure Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="bs" className="space-y-4">
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <h3 className="font-serif font-bold text-center text-lg mb-1">Consolidated Statement of Financial Position</h3>
                    <p className="text-center text-xs text-slate-500 mb-6">As at 31 December 2024 (Currency: USD)</p>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between font-bold bg-slate-50 p-2 rounded">
                            <span>Assets</span>
                        </div>
                        <div className="flex justify-between pl-4">
                            <span>Non-current assets</span>
                            <span>1,245,000</span>
                        </div>
                        <div className="flex justify-between pl-8 text-slate-500 text-xs">
                            <span>Property, plant and equipment (Note 5)</span>
                            <span>850,000</span>
                        </div>
                         <div className="flex justify-between pl-8 text-slate-500 text-xs">
                            <span>Right-of-use assets (Note 6)</span>
                            <span>395,000</span>
                        </div>
                    </div>
                </div>
            </TabsContent>
            
            <TabsContent value="notes">
                <div className="p-4 bg-slate-50 border rounded-lg">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Eye className="w-4 h-4" /> AI-Generated Disclosures
                    </h4>
                    <div className="space-y-3">
                        <div className="p-3 bg-white border rounded text-sm">
                            <div className="font-medium mb-1">Note 23: Financial Risk Management</div>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                The Group is exposed to market risk, credit risk and liquidity risk. 
                                The Group's senior management oversees the management of these risks...
                                <Badge variant="outline" className="ml-2">Auto-Generated</Badge>
                            </p>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}