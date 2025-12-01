import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Sparkles, TrendingUp, Target, MessageSquare, Brain, 
  CheckCircle2, XCircle, RefreshCw, Loader2, Lightbulb, Mail, Phone
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

const stageLabels = {
  prospecting: 'Prospecting', qualification: 'Qualification', proposal: 'Proposal',
  negotiation: 'Negotiation', closed_won: 'Closed Won', closed_lost: 'Closed Lost'
};

export default function OpportunityAIAssistant({ opportunity }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const queryClient = useQueryClient();

  const { data: allOpportunities = [] } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => base44.entities.Opportunity.list()
  });

  const { data: customer } = useQuery({
    queryKey: ['customer', opportunity?.customer_id],
    queryFn: () => base44.entities.Customer.filter({ id: opportunity.customer_id }),
    enabled: !!opportunity?.customer_id
  });

  const updateOpportunityMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Opportunity.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['opportunities'] })
  });

  const analyzeOpportunity = async () => {
    setAnalyzing(true);
    try {
      // Analyze closed deals patterns
      const wonDeals = allOpportunities.filter(o => o.stage === 'closed_won');
      const lostDeals = allOpportunities.filter(o => o.stage === 'closed_lost');
      
      const avgWonValue = wonDeals.length > 0 ? wonDeals.reduce((s, o) => s + (o.value || 0), 0) / wonDeals.length : 0;
      const avgLostValue = lostDeals.length > 0 ? lostDeals.reduce((s, o) => s + (o.value || 0), 0) / lostDeals.length : 0;
      const winRate = allOpportunities.length > 0 ? (wonDeals.length / (wonDeals.length + lostDeals.length) * 100) : 0;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this sales opportunity and provide actionable insights:

OPPORTUNITY DATA:
Name: ${opportunity.name}
Customer: ${opportunity.customer_name}
Stage: ${stageLabels[opportunity.stage]}
Value: $${opportunity.value?.toLocaleString()}
Current Probability: ${opportunity.probability}%
Expected Close: ${opportunity.expected_close_date}
Source: ${opportunity.source || 'Unknown'}
Notes: ${opportunity.notes || 'None'}
Next Action: ${opportunity.next_action || 'Not set'}

HISTORICAL PATTERNS:
- Win Rate: ${winRate.toFixed(1)}%
- Avg Won Deal Size: $${avgWonValue.toLocaleString()}
- Avg Lost Deal Size: $${avgLostValue.toLocaleString()}
- Total Won Deals: ${wonDeals.length}
- Total Lost Deals: ${lostDeals.length}

CUSTOMER INFO:
Industry: ${customer?.[0]?.industry || 'Unknown'}
Previous Projects: Active

Please provide:
1. Predicted win probability (0-100) with reasoning
2. Recommended next steps (3 specific actions)
3. Risk factors to watch
4. Personalized outreach message suggestion
5. Key success factors based on similar won deals
6. Estimated days to close`,
        response_json_schema: {
          type: "object",
          properties: {
            predicted_probability: { type: "number" },
            probability_reasoning: { type: "string" },
            next_steps: { type: "array", items: { type: "object", properties: { action: { type: "string" }, priority: { type: "string" }, timeline: { type: "string" } } } },
            risk_factors: { type: "array", items: { type: "string" } },
            outreach_suggestion: { type: "object", properties: { subject: { type: "string" }, message: { type: "string" }, channel: { type: "string" } } },
            success_factors: { type: "array", items: { type: "string" } },
            estimated_days_to_close: { type: "number" }
          }
        }
      });

      setAnalysis(result);
      toast.success('AI analysis complete');
    } catch (error) {
      toast.error('Analysis failed');
    }
    setAnalyzing(false);
  };

  const applyRecommendation = async () => {
    if (!analysis) return;
    await updateOpportunityMutation.mutateAsync({
      id: opportunity.id,
      data: {
        probability: analysis.predicted_probability,
        next_action: analysis.next_steps?.[0]?.action,
        next_action_date: moment().add(analysis.estimated_days_to_close || 7, 'days').format('YYYY-MM-DD'),
        notes: `${opportunity.notes || ''}\n\n[AI Analysis ${moment().format('DD MMM')}]\n${analysis.probability_reasoning}`
      }
    });
    toast.success('Recommendations applied');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-500" />AI Sales Assistant
        </h3>
        <Button onClick={analyzeOpportunity} disabled={analyzing} size="sm">
          {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Analyze
        </Button>
      </div>

      {!analysis ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Click Analyze to get AI-powered insights</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="prediction">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
            <TabsTrigger value="actions">Next Steps</TabsTrigger>
            <TabsTrigger value="risks">Risks</TabsTrigger>
            <TabsTrigger value="outreach">Outreach</TabsTrigger>
          </TabsList>

          <TabsContent value="prediction" className="mt-4 space-y-4">
            <Card className="bg-gradient-to-br from-violet-50 to-blue-50 border-violet-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-600">Win Probability</span>
                  <Badge className={analysis.predicted_probability >= 70 ? 'bg-emerald-100 text-emerald-700' : analysis.predicted_probability >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>
                    {analysis.predicted_probability}%
                  </Badge>
                </div>
                <Progress value={analysis.predicted_probability} className="h-3 mb-3" />
                <p className="text-sm text-slate-600">{analysis.probability_reasoning}</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Success Factors</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.success_factors?.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Button onClick={applyRecommendation} className="w-full">
              <Target className="w-4 h-4 mr-2" />Apply AI Recommendations
            </Button>
          </TabsContent>

          <TabsContent value="actions" className="mt-4">
            <Card className="border-slate-200">
              <CardContent className="p-4 space-y-3">
                {analysis.next_steps?.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${step.priority === 'high' ? 'bg-red-500' : step.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{step.action}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{step.priority}</Badge>
                        <span className="text-xs text-slate-500">{step.timeline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="mt-4">
            <Card className="border-red-100 bg-red-50/30">
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {analysis.risk_factors?.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outreach" className="mt-4">
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {analysis.outreach_suggestion?.channel === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  Suggested {analysis.outreach_suggestion?.channel} Outreach
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500">Subject</p>
                  <p className="font-medium">{analysis.outreach_suggestion?.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Message</p>
                  <p className="text-sm bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">{analysis.outreach_suggestion?.message}</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />Use This Template
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}