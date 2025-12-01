import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, Download, Save, Plus, Table as TableIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function CustomReportBuilder() {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    module: 'projects',
    columns: [],
    format: 'pdf'
  });

  const availableColumns = {
    projects: ['Project Name', 'Status', 'Progress', 'Budget', 'Spent', 'Manager', 'Start Date', 'End Date'],
    finance: ['Invoice #', 'Date', 'Amount', 'Customer', 'Status', 'Due Date'],
    esg: ['Metric', 'Value', 'Unit', 'Date', 'Scope', 'Source']
  };

  const handleColumnToggle = (col) => {
    const current = reportConfig.columns;
    const updated = current.includes(col) 
      ? current.filter(c => c !== col)
      : [...current, col];
    setReportConfig({ ...reportConfig, columns: updated });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Configuration Panel */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Report Name</Label>
            <Input 
              placeholder="e.g. Monthly Project Status" 
              value={reportConfig.name}
              onChange={e => setReportConfig({...reportConfig, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Module Source</Label>
            <Select 
              value={reportConfig.module} 
              onValueChange={v => setReportConfig({...reportConfig, module: v, columns: []})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="projects">Projects & Tasks</SelectItem>
                <SelectItem value="finance">Finance & Invoices</SelectItem>
                <SelectItem value="esg">ESG & Sustainability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="flex gap-2">
              <Button 
                variant={reportConfig.format === 'pdf' ? 'default' : 'outline'}
                onClick={() => setReportConfig({...reportConfig, format: 'pdf'})}
                className="flex-1"
              >
                PDF
              </Button>
              <Button 
                variant={reportConfig.format === 'csv' ? 'default' : 'outline'}
                onClick={() => setReportConfig({...reportConfig, format: 'csv'})}
                className="flex-1"
              >
                CSV
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Label className="mb-2 block">Select Columns</Label>
            <div className="space-y-2 h-48 overflow-y-auto border rounded p-2">
              {availableColumns[reportConfig.module].map(col => (
                <div key={col} className="flex items-center space-x-2">
                  <Checkbox 
                    id={col} 
                    checked={reportConfig.columns.includes(col)}
                    onCheckedChange={() => handleColumnToggle(col)}
                  />
                  <label htmlFor={col} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {col}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" /> Generate Report
          </Button>
        </CardContent>
      </Card>

      {/* Preview Panel */}
      <Card className="md:col-span-2 bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-500" /> Report Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px] border-2 border-dashed border-slate-200 rounded-lg m-4 bg-white">
          <div className="text-center text-slate-400">
            <TableIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select parameters to generate a preview</p>
            <div className="mt-4 flex gap-2 justify-center">
              {reportConfig.columns.map(col => (
                <Badge key={col} variant="secondary">{col}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}