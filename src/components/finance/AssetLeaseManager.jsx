import React from 'react';
import { 
  Building, Landmark, Calculator, Truck, Box 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function AssetLeaseManager() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-600" /> Fixed Assets & IFRS 16
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="assets">
            <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="assets">Fixed Assets</TabsTrigger>
                <TabsTrigger value="leases">Lease Accounting (IFRS 16)</TabsTrigger>
            </TabsList>

            <TabsContent value="assets" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-slate-50">
                        <div className="flex items-center gap-2 mb-2">
                            <Calculator className="w-4 h-4 text-indigo-500" />
                            <h4 className="font-medium text-sm">Depreciation Run</h4>
                        </div>
                        <div className="text-2xl font-bold text-slate-800">$12,450</div>
                        <div className="text-xs text-slate-500">Posted for Nov 2024</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-slate-50">
                        <div className="flex items-center gap-2 mb-2">
                            <Box className="w-4 h-4 text-emerald-500" />
                            <h4 className="font-medium text-sm">Asset Count</h4>
                        </div>
                        <div className="text-2xl font-bold text-slate-800">142</div>
                        <div className="text-xs text-slate-500">Total Active Assets</div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="leases" className="space-y-4">
                 <div className="p-4 border rounded-lg bg-indigo-50 border-indigo-100">
                    <h4 className="font-semibold text-indigo-900 mb-2">Right-of-Use Asset Schedule</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Office HQ Lease (5 Yr)</span>
                            <span className="font-mono">$450,000</span>
                        </div>
                        <Progress value={45} className="h-2 bg-indigo-200" />
                        <div className="flex justify-between text-xs text-indigo-600">
                            <span>Remaining: 32 Months</span>
                            <span>Liability: $280,000</span>
                        </div>
                    </div>
                 </div>
                 
                 <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <Truck className="w-4 h-4 text-slate-500" />
                        <h5 className="font-medium text-sm">Fleet Vehicles</h5>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between py-1 border-b">
                            <span>Vehicle A (Toyota Hiace)</span>
                            <span>Active</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                            <span>Vehicle B (Nissan NV200)</span>
                            <span>Active</span>
                        </div>
                    </div>
                 </div>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}