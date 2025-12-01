import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Factory, Truck, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function SupplierEmissionUpload() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: supplierData = [] } = useQuery({
    queryKey: ['supplier-emissions'],
    queryFn: () => base44.entities.SupplierEmissionData.list()
  });

  const handleUpload = () => {
    setUploading(true);
    // Mock upload process
    setTimeout(() => setUploading(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Upload Panel */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5" /> Upload Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-medium">Drop CSV or Excel file</p>
              <p className="text-xs text-slate-500 mt-1">Supports GHG Protocol templates</p>
            </div>
            
            <div className="space-y-2">
              <Label>Manual Entry</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select Supplier" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sup1">Logistics Partner A</SelectItem>
                  <SelectItem value="sup2">Raw Material Co.</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Scope 3 Emissions (tCO2e)" />
              <Input type="number" placeholder="Reporting Year" />
            </div>
            
            <Button className="w-full" onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Processing...' : 'Add Record'}
            </Button>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <Card className="bg-slate-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-slate-900">Supply Chain Coverage</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">64%</p>
              <p className="text-sm text-slate-500">of spend has emission data</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Factory className="w-5 h-5 text-emerald-600" />
                <h3 className="font-medium text-emerald-900">Scope 3 Intensity</h3>
              </div>
              <p className="text-3xl font-bold text-emerald-900">0.45</p>
              <p className="text-sm text-emerald-700">kgCO2e per $ spend (Avg)</p>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Supplier Data Registry</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Emissions (tCO2e)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Global Logistics Ltd</TableCell>
                    <TableCell>2024</TableCell>
                    <TableCell>1,240.5</TableCell>
                    <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tech Components Inc</TableCell>
                    <TableCell>2024</TableCell>
                    <TableCell>450.2</TableCell>
                    <TableCell><Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Self-Declared</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}