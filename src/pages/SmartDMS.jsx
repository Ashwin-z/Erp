import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, Upload, Scan, CheckCircle2, AlertTriangle, 
  Search, MoreHorizontal, Loader2
} from 'lucide-react';

export default function SmartDMS() {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            Smart DMS
          </h1>
          <p className="text-slate-400">AI-OCR Pipeline & Document Repository</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Pipeline Status */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Queued', count: 12, icon: FileText, color: 'text-slate-400' },
          { label: 'Processing', count: 5, icon: Loader2, color: 'text-blue-400 animate-spin' },
          { label: 'Human Review', count: 3, icon: AlertTriangle, color: 'text-amber-400' },
          { label: 'Completed', count: 128, icon: CheckCircle2, color: 'text-emerald-400' },
        ].map((status, idx) => (
          <Card key={idx} className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase">{status.label}</p>
                <p className="text-2xl font-bold">{status.count}</p>
              </div>
              <status.icon className={`w-6 h-6 ${status.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document List */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Documents</CardTitle>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Search files..."
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {[
              { name: 'INV-2024-001.pdf', type: 'Invoice', size: '1.2 MB', status: 'Completed', conf: 99, date: '10 mins ago' },
              { name: 'Contract_Vendor_A.pdf', type: 'Contract', size: '4.5 MB', status: 'Human Review', conf: 85, date: '1 hour ago' },
              { name: 'Receipt_Lunch.jpg', type: 'Receipt', size: '240 KB', status: 'Processing', conf: 0, date: 'Just now' },
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right w-24">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Confidence</span>
                      <span className={doc.conf > 90 ? 'text-emerald-400' : 'text-amber-400'}>{doc.conf}%</span>
                    </div>
                    <Progress value={doc.conf} className="h-1.5 bg-slate-800" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium
                    ${doc.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                    ${doc.status === 'Human Review' ? 'bg-amber-500/10 text-amber-400' : ''}
                    ${doc.status === 'Processing' ? 'bg-blue-500/10 text-blue-400' : ''}
                  `}>
                    {doc.status}
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}