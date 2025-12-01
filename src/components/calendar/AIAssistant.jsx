import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, Brain, Clock, AlertTriangle, TrendingUp,
  Zap, Calendar, MessageSquare, Lightbulb, Send
} from 'lucide-react';

export default function AIAssistant({ events, onSuggestionAccept }) {
  const [query, setQuery] = useState('');
  const [processing, setProcessing] = useState(false);

  const suggestions = [
    {
      type: 'scheduling',
      icon: Clock,
      title: 'Best time for team meeting',
      description: 'Based on everyone\'s availability, Thursday 2-3pm works best',
      action: 'Schedule Now'
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Schedule overload detected',
      description: 'You have 6 meetings tomorrow. Consider rescheduling 2 non-urgent ones.',
      action: 'Review'
    },
    {
      type: 'insight',
      icon: TrendingUp,
      title: 'Weekly productivity insight',
      description: 'You spend 40% of time in meetings. Industry average is 30%.',
      action: 'See Report'
    },
    {
      type: 'automation',
      icon: Zap,
      title: 'Recurring pattern detected',
      description: 'You schedule "Weekly Standup" every Monday. Create recurring event?',
      action: 'Automate'
    }
  ];

  const quickActions = [
    { label: 'Find free slot', icon: Calendar },
    { label: 'Reschedule meeting', icon: Clock },
    { label: 'Create from text', icon: MessageSquare },
    { label: 'Suggest meeting time', icon: Lightbulb }
  ];

  const typeColors = {
    scheduling: 'bg-blue-100 text-blue-700',
    warning: 'bg-amber-100 text-amber-700',
    insight: 'bg-purple-100 text-purple-700',
    automation: 'bg-green-100 text-green-700'
  };

  const handleQuery = () => {
    if (!query.trim()) return;
    setProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setProcessing(false);
      setQuery('');
    }, 2000);
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="w-5 h-5 text-purple-500" />
          AI Calendar Assistant
          <Badge className="bg-purple-500 text-white text-xs">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Natural Language Input */}
        <div className="flex gap-2">
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: 'Schedule a 30-min call with John next week'"
            className="bg-white"
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
          />
          <Button 
            onClick={handleQuery}
            disabled={processing}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {processing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, i) => (
            <Button key={i} variant="outline" size="sm" className="text-xs">
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* AI Suggestions */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-500">AI Suggestions</p>
          {suggestions.map((suggestion, i) => (
            <div key={i} className="p-3 bg-white rounded-lg border">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${typeColors[suggestion.type]}`}>
                  <suggestion.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{suggestion.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{suggestion.description}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  onClick={() => onSuggestionAccept && onSuggestionAccept(suggestion)}
                >
                  {suggestion.action}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Stats */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t">
          <div className="text-center">
            <p className="text-lg font-bold text-purple-600">15h</p>
            <p className="text-xs text-slate-500">Saved this month</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">23</p>
            <p className="text-xs text-slate-500">Auto-scheduled</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">8</p>
            <p className="text-xs text-slate-500">Conflicts resolved</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}