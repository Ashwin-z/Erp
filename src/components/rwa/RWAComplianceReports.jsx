import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, Shield, Download, Globe, Users,
  Calendar, CheckCircle2, Send, Loader2, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export default function RWAComplianceReports() {
    const [generating, setGenerating] = useState(false);
    const [reports, setReports] = useState([
        { id: 1, name: 'Quarterly Token Issuer Compliance', type: 'Regulatory', status: 'Ready', date: '2024-11-28' },
        { id: 2, name: 'AML / KYC Audit Log', type: 'Audit', status: 'Processing', date: '2024-11-28' },
        { id: 3, name: 'Investor Accreditation Report', type: 'Internal', status: 'Ready', date: '2024-11-25' },
        { id: 4, name: 'Transaction Monitoring (SARs)', type: 'Regulatory', status: 'Ready', date: '2024-11-20' },
    ]);

    const handleGenerate = () => {
        setGenerating(true);
        toast.info("AI analyzing transaction patterns and investor data...");
        
        setTimeout(() => {
            setGenerating(false);
            const newReport = {
                id: Date.now(),
                name: `AI Risk Assessment - ${new Date().toLocaleDateString()}`,
                type: 'AI Generated',
                status: 'Ready',
                date: new Date().toISOString().split('T')[0]
            };
            setReports([newReport, ...reports]);
            toast.success("AI Report Generated Successfully");
        }, 2000);
    };

    const handleSubmit = (id) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: 'Submitting to Regulatory Gateway...',
                success: 'Report submitted successfully',
                error: 'Submission failed'
            }
        );
    };

    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-violet-400" />
                    Regulatory & Compliance Reports
                </CardTitle>
                <Button 
                    size="sm" 
                    className="bg-violet-500/20 text-violet-300 hover:bg-violet-500/30"
                    onClick={handleGenerate}
                    disabled={generating}
                >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Generate AI Report
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700 rounded-lg hover:border-violet-500/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                    <FileCheck className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">{report.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px]">
                                            {report.type}
                                        </Badge>
                                        <span className="text-slate-500 text-xs flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {report.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className={report.status === 'Ready' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                                    {report.status === 'Ready' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : null}
                                    {report.status}
                                </Badge>
                                {report.status === 'Ready' && (
                                    <div className="flex gap-1">
                                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white h-8 w-8 p-0">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="text-slate-400 hover:text-emerald-400 h-8 w-8 p-0"
                                            onClick={() => handleSubmit(report.id)}
                                            title="Submit to Regulator"
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}