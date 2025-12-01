import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, TrendingUp, Calculator, Download, Sparkles, 
  CheckCircle2, AlertTriangle, Clock, RefreshCw, Eye,
  ArrowRight, Loader2, BarChart3, PieChart
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const reportTypes = [
  {
    id: 'monthly_summary',
    title: 'Monthly Financial Summary',
    description: 'Comprehensive P&L, balance sheet highlights, and key metrics',
    icon: FileText,
    color: 'violet',
    estimatedTime: '2-3 min',
    features: ['P&L Analysis', 'Balance Sheet Summary', 'Key Ratios', 'Trend Insights']
  },
  {
    id: 'cashflow',
    title: 'Cash Flow Report with Variance',
    description: 'Detailed cash flow analysis with budget variance and forecasting',
    icon: TrendingUp,
    color: 'emerald',
    estimatedTime: '3-4 min',
    features: ['Inflow/Outflow Analysis', 'Budget vs Actual', '90-Day Forecast', 'Variance Alerts']
  },
  {
    id: 'gst_precheck',
    title: 'GST Filing Pre-Check',
    description: 'IRAS compliance validation with error detection and recommendations',
    icon: Calculator,
    color: 'blue',
    estimatedTime: '1-2 min',
    features: ['Input/Output Tax Validation', 'Missing Invoice Detection', 'Rate Verification', 'Filing Readiness Score']
  }
];

const colorClasses = {
  violet: { bg: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
};

export default function ReportGenerator() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedReports, setGeneratedReports] = useState([
    { id: 1, type: 'monthly_summary', period: 'Nov 2024', status: 'ready', issues: 0, date: '2024-12-20' },
    { id: 2, type: 'gst_precheck', period: 'Q4 2024', status: 'issues', issues: 3, date: '2024-12-19' },
  ]);
  const [period, setPeriod] = useState('dec_2024');

  const handleGenerate = async (reportId) => {
    setSelectedReport(reportId);
    setGenerating(true);
    setProgress(0);

    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          // Add to generated reports
          const report = reportTypes.find(r => r.id === reportId);
          const newReport = {
            id: Date.now(),
            type: reportId,
            period: period === 'dec_2024' ? 'Dec 2024' : period === 'nov_2024' ? 'Nov 2024' : 'Q4 2024',
            status: Math.random() > 0.3 ? 'ready' : 'issues',
            issues: Math.random() > 0.3 ? 0 : Math.floor(Math.random() * 5) + 1,
            date: new Date().toISOString().split('T')[0]
          };
          setGeneratedReports(prev => [newReport, ...prev]);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Report Type Selection */}
        <div className="grid lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const colors = colorClasses[report.color];
            const isSelected = selectedReport === report.id && generating;
            
            return (
              <motion.div
                key={report.id}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-2xl border-2 ${isSelected ? colors.border : 'border-slate-200'} p-6 bg-white cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-offset-2 ' + colors.border : ''}`}
              >
                <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center mb-4`}>
                  <report.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                
                <h3 className="font-semibold text-slate-900 mb-2">{report.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{report.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {report.features.map((feature, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {report.estimatedTime}
                  </div>
                  
                  {isSelected ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                      <span className="text-sm text-violet-600">{Math.round(progress)}%</span>
                    </div>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          className={`${colors.bg} hover:opacity-90`}
                          onClick={() => handleGenerate(report.id)}
                          disabled={generating}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Generate
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>AI will analyze your data and generate report</TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-slate-500 mt-2">
                      {progress < 30 ? 'Analyzing transactions...' :
                       progress < 60 ? 'Calculating variances...' :
                       progress < 90 ? 'Generating insights...' : 'Finalizing report...'}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">Report Period:</span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dec_2024">December 2024</SelectItem>
              <SelectItem value="nov_2024">November 2024</SelectItem>
              <SelectItem value="q4_2024">Q4 2024</SelectItem>
              <SelectItem value="q3_2024">Q3 2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Generated Reports */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" />
                Generated Reports
              </CardTitle>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {generatedReports.map((report, index) => {
                  const reportType = reportTypes.find(r => r.id === report.type);
                  const colors = colorClasses[reportType?.color || 'violet'];
                  
                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className={`w-10 h-10 ${colors.light} rounded-lg flex items-center justify-center`}>
                        {reportType && <reportType.icon className={`w-5 h-5 ${colors.text}`} />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{reportType?.title}</span>
                          <Badge variant="outline">{report.period}</Badge>
                        </div>
                        <p className="text-xs text-slate-500">Generated on {report.date}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {report.status === 'ready' ? (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Ready
                          </Badge>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge className="bg-amber-100 text-amber-700">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {report.issues} Issues
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Click to view and resolve issues</TooltipContent>
                          </Tooltip>
                        )}
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Preview Report</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download PDF</TooltipContent>
                        </Tooltip>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}