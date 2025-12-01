import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Sparkles, AlertTriangle, CheckCircle2, Info, Shield, 
  Zap, Brain, Lightbulb, XCircle, ChevronRight, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

const AI_RECOMMENDATIONS = [
  {
    id: '1',
    type: 'optimization',
    severity: 'info',
    title: 'Optimize Finance Team Access',
    description: 'Sarah Chen has Compliance access but rarely uses it. Consider removing for least-privilege compliance.',
    user: 'sarah@arkfinex.com',
    action: 'Remove Compliance module access',
    impact: 'Reduces attack surface, improves audit posture'
  },
  {
    id: '2',
    type: 'warning',
    severity: 'warning',
    title: 'Overly Broad Access Detected',
    description: 'John Smith (Sales Dept Head) has access to HR module which is unusual for Sales department.',
    user: 'john@arkfinex.com',
    action: 'Review HR module necessity',
    impact: 'Potential data privacy concern'
  },
  {
    id: '3',
    type: 'inconsistency',
    severity: 'warning',
    title: 'Permission Inconsistency',
    description: 'Mike Johnson has Manager role but lacks Operations access that other Managers have.',
    user: 'mike@arkfinex.com',
    action: 'Add Operations module access',
    impact: 'Align with role-based access policy'
  },
  {
    id: '4',
    type: 'security',
    severity: 'critical',
    title: 'High-Risk Permission Pattern',
    description: 'User anna@arkfinex.com has both Delete and Export permissions on sensitive Finance data.',
    user: 'anna@arkfinex.com',
    action: 'Separate delete and export permissions',
    impact: 'Reduce data exfiltration risk'
  },
  {
    id: '5',
    type: 'suggestion',
    severity: 'info',
    title: 'New User Onboarding',
    description: 'IT department has 3 new users without Tools module access. This is standard for IT roles.',
    user: 'IT Department',
    action: 'Apply IT Default Template',
    impact: 'Faster onboarding, consistent access'
  }
];

const ROLE_RECOMMENDATIONS = {
  'super_admin': {
    modules: ['overview', 'operations', 'finance', 'compliance', 'hr', 'tools', 'manage', 'account'],
    explanation: 'Super Admins require full platform access to manage all aspects of the system.'
  },
  'department_head': {
    modules: ['overview', 'hr', 'tools', 'account'],
    explanation: 'Department Heads need HR for team management, Tools for workflows, plus standard access.'
  },
  'manager': {
    modules: ['overview', 'operations', 'account'],
    explanation: 'Managers focus on operational tasks and team oversight within their domain.'
  },
  'finance_user': {
    modules: ['overview', 'finance', 'compliance', 'account'],
    explanation: 'Finance users need Finance module access plus Compliance for regulatory requirements.'
  },
  'sales_user': {
    modules: ['overview', 'operations', 'account'],
    explanation: 'Sales users primarily work with CRM and Sales modules within Operations.'
  }
};

const PERMISSION_EXPLANATIONS = {
  'overview': 'Dashboard and AI Insights for monitoring KPIs and system health.',
  'operations': 'CRM, Sales, Marketing, Procurement, Inventory - core business operations.',
  'finance': 'General Ledger, Bank Reconciliation, Budgets, GST - financial management.',
  'compliance': 'Blockchain Audit, ESG, PDPA, Cybersecurity - regulatory compliance.',
  'hr': 'HR Management, KPI tracking - human resources and performance.',
  'tools': 'Documents, Calendar, Workflows, Service Desk - productivity tools.',
  'manage': 'Clients, Settings, Super Admin - administrative functions.',
  'account': 'Personal Dashboard and Mobile App - user-specific features.'
};

export default function PermissionAIAssistant({ users, onApplyRecommendation }) {
  const [recommendations, setRecommendations] = useState(AI_RECOMMENDATIONS);
  const [analyzing, setAnalyzing] = useState(false);
  const [dismissedIds, setDismissedIds] = useState([]);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      toast.success('AI analysis complete - 5 recommendations found');
    }, 2000);
  };

  const dismissRecommendation = (id) => {
    setDismissedIds(prev => [...prev, id]);
    toast.info('Recommendation dismissed');
  };

  const applyRecommendation = (rec) => {
    if (onApplyRecommendation) {
      onApplyRecommendation(rec);
    }
    setDismissedIds(prev => [...prev, rec.id]);
    toast.success('Recommendation applied');
  };

  const activeRecommendations = recommendations.filter(r => !dismissedIds.includes(r.id));

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityBorder = (severity) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500';
      case 'warning': return 'border-l-amber-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Permission Assistant
          </CardTitle>
          <Button 
            variant="outline" 
            onClick={runAnalysis}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <p className="text-xl font-bold text-red-600">
                {activeRecommendations.filter(r => r.severity === 'critical').length}
              </p>
              <p className="text-xs text-slate-500">Critical</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-center">
              <p className="text-xl font-bold text-amber-600">
                {activeRecommendations.filter(r => r.severity === 'warning').length}
              </p>
              <p className="text-xs text-slate-500">Warnings</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-xl font-bold text-blue-600">
                {activeRecommendations.filter(r => r.severity === 'info').length}
              </p>
              <p className="text-xs text-slate-500">Suggestions</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <p className="text-xl font-bold text-green-600">{dismissedIds.length}</p>
              <p className="text-xs text-slate-500">Resolved</p>
            </div>
          </div>

          {/* Recommendations List */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {activeRecommendations.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>All recommendations addressed!</p>
                  <p className="text-sm">Run analysis to check for new issues.</p>
                </div>
              ) : (
                activeRecommendations.map(rec => (
                  <div 
                    key={rec.id} 
                    className={`p-4 border-l-4 ${getSeverityBorder(rec.severity)} bg-white rounded-lg shadow-sm`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(rec.severity)}
                        <div>
                          <p className="font-medium">{rec.title}</p>
                          <p className="text-sm text-slate-500 mt-1">{rec.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{rec.user}</Badge>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge className="bg-purple-100 text-purple-700 text-xs cursor-help">
                                  <Lightbulb className="w-3 h-3 mr-1" />
                                  Impact
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{rec.impact}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => dismissRecommendation(rec.id)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-lime-500 hover:bg-lime-600"
                          onClick={() => applyRecommendation(rec)}
                        >
                          Apply
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Permission Explanations */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Module Access Explanations (Hover for details)
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PERMISSION_EXPLANATIONS).map(([key, explanation]) => (
                <Tooltip key={key}>
                  <TooltipTrigger>
                    <Badge variant="outline" className="cursor-help capitalize">
                      {key}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="max-w-xs">{explanation}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

// Export helper for tooltip explanations
export const getPermissionExplanation = (moduleId) => {
  return PERMISSION_EXPLANATIONS[moduleId] || 'Access to this module.';
};

export const getRoleRecommendation = (role) => {
  return ROLE_RECOMMENDATIONS[role] || null;
};