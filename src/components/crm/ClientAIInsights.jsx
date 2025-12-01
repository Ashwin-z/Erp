import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, TrendingUp, MessageSquare, Heart, AlertTriangle, 
  CheckCircle2, XCircle, RefreshCw, Loader2, Lightbulb, DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

const insightTypeConfig = {
  follow_up: { icon: MessageSquare, color: 'bg-blue-100 text-blue-700', label: 'Follow-up' },
  upsell: { icon: DollarSign, color: 'bg-emerald-100 text-emerald-700', label: 'Upsell Opportunity' },
  sentiment: { icon: Heart, color: 'bg-pink-100 text-pink-700', label: 'Sentiment' },
  summary: { icon: Lightbulb, color: 'bg-amber-100 text-amber-700', label: 'Summary' },
  engagement: { icon: TrendingUp, color: 'bg-violet-100 text-violet-700', label: 'Engagement' }
};

const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600'
};

export default function ClientAIInsights({ customer }) {
  const [generating, setGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['client-insights', customer?.id],
    queryFn: () => base44.entities.ClientAIInsight.filter({ customer_id: customer.id }, '-created_date'),
    enabled: !!customer?.id
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ['customer-quotes', customer?.id],
    queryFn: () => base44.entities.Quotation.filter({ customer_id: customer.id }),
    enabled: !!customer?.id
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['customer-projects', customer?.id],
    queryFn: () => base44.entities.Project.filter({ customer_id: customer.id }),
    enabled: !!customer?.id
  });

  const createInsightMutation = useMutation({
    mutationFn: (data) => base44.entities.ClientAIInsight.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['client-insights', customer?.id] })
  });

  const updateInsightMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ClientAIInsight.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['client-insights', customer?.id] })
  });

  const generateInsights = async () => {
    setGenerating(true);
    try {
      const context = `
Customer: ${customer.name}
Company: ${customer.company_name || 'N/A'}
Industry: ${customer.industry || 'N/A'}
Status: ${customer.status}
Family Notes: ${customer.family_notes || 'None'}
Office Notes: ${customer.office_notes || 'None'}
Total Quotes: ${quotes.length}
Accepted Quotes: ${quotes.filter(q => q.status === 'accepted').length}
Total Projects: ${projects.length}
Active Projects: ${projects.filter(p => p.status === 'in_progress').length}
Last Contact: ${customer.updated_date}
      `;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this customer data and provide actionable insights:
${context}

Generate 3-4 insights in these categories:
1. Follow-up action needed
2. Upsell opportunity based on history
3. Overall sentiment/engagement assessment
4. Summary of key relationship notes

For each insight provide: type (follow_up/upsell/sentiment/engagement), title, description, suggested_action, priority (high/medium/low), confidence_score (0-1), engagement_level (cold/warm/hot)`,
        response_json_schema: {
          type: "object",
          properties: {
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  suggested_action: { type: "string" },
                  priority: { type: "string" },
                  confidence_score: { type: "number" },
                  engagement_level: { type: "string" }
                }
              }
            }
          }
        }
      });

      for (const insight of result.insights || []) {
        await createInsightMutation.mutateAsync({
          customer_id: customer.id,
          customer_name: customer.name,
          ...insight,
          data_sources: ['quotes', 'projects', 'notes']
        });
      }
      toast.success('AI insights generated');
    } catch (error) {
      toast.error('Failed to generate insights');
    }
    setGenerating(false);
  };

  const handleAction = async (insight, action) => {
    const user = await base44.auth.me();
    await updateInsightMutation.mutateAsync({
      id: insight.id,
      data: { status: action, actioned_by: user.email, actioned_date: new Date().toISOString() }
    });
    toast.success(action === 'actioned' ? 'Marked as actioned' : 'Insight dismissed');
  };

  const newInsights = insights.filter(i => i.status === 'new');
  const avgEngagement = insights.length > 0 
    ? insights.filter(i => i.confidence_score).reduce((sum, i) => sum + i.confidence_score, 0) / insights.length 
    : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-500" />AI Insights
        </h3>
        <Button onClick={generateInsights} disabled={generating} size="sm" variant="outline">
          {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Generate Insights
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-violet-50 border-violet-200">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-violet-700">{newInsights.length}</p>
            <p className="text-xs text-violet-600">New Insights</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-emerald-700">{(avgEngagement * 100).toFixed(0)}%</p>
            <p className="text-xs text-emerald-600">AI Confidence</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-700 capitalize">
              {insights.find(i => i.engagement_level)?.engagement_level || 'N/A'}
            </p>
            <p className="text-xs text-blue-600">Engagement</p>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : insights.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-3">No AI insights yet</p>
            <Button onClick={generateInsights} disabled={generating}>
              {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Generate First Insights
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => {
            const config = insightTypeConfig[insight.insight_type] || insightTypeConfig.summary;
            const Icon = config.icon;
            return (
              <Card key={insight.id} className={`border-slate-200 ${insight.status !== 'new' ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{insight.title}</p>
                        <Badge className={priorityColors[insight.priority]}>{insight.priority}</Badge>
                        {insight.status !== 'new' && (
                          <Badge variant="outline">{insight.status}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                      {insight.suggested_action && (
                        <div className="bg-slate-50 rounded-lg p-2 mb-2">
                          <p className="text-xs text-slate-500">Suggested Action:</p>
                          <p className="text-sm font-medium">{insight.suggested_action}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>Confidence: {((insight.confidence_score || 0) * 100).toFixed(0)}%</span>
                          <span>{moment(insight.created_date).fromNow()}</span>
                        </div>
                        {insight.status === 'new' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleAction(insight, 'dismissed')}>
                              <XCircle className="w-3 h-3 mr-1" />Dismiss
                            </Button>
                            <Button size="sm" onClick={() => handleAction(insight, 'actioned')}>
                              <CheckCircle2 className="w-3 h-3 mr-1" />Action
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}