import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Phone, Mail, Brain, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import moment from 'moment';

export default function CommunicationAIAnalysis({ customerId, opportunityId }) {
  const [analyzing, setAnalyzing] = useState(false);

  // Mock data for communication logs
  const logs = [
    { id: 1, type: 'email', direction: 'inbound', subject: "Re: Proposal Details", content: "The pricing looks a bit high compared to competitors. Can we discuss the terms?", date: "2024-01-15T10:30:00", sentiment: "negative" },
    { id: 2, type: 'call', direction: 'outbound', subject: "Discovery Call", content: "Client mentioned budget approval is pending board meeting next Tuesday.", date: "2024-01-12T14:00:00", sentiment: "neutral" },
    { id: 3, type: 'email', direction: 'inbound', subject: "Project Scope", content: "We are excited about the features you showed us. Especially the AI reporting.", date: "2024-01-10T09:15:00", sentiment: "positive" }
  ];

  const [aiSuggestions, setAiSuggestions] = useState([
    { type: 'action', title: "Address Pricing Concerns", description: "Prepare a value comparison sheet highlighting ROI to counter pricing objections.", priority: "high" },
    { type: 'action', title: "Follow-up on Board Meeting", description: "Schedule a check-in call for Wednesday morning (post-board meeting).", priority: "medium" }
  ]);

  const handleAnalyze = () => {
    setAnalyzing(true);
    // Simulate AI call
    setTimeout(() => {
      setAnalyzing(false);
      // In a real app, this would update suggestions based on new logs
    }, 2000);
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return <span className="text-green-500">😊</span>;
    if (sentiment === 'negative') return <span className="text-red-500">😟</span>;
    return <span className="text-slate-500">😐</span>;
  };

  const getIcon = (type) => {
    if (type === 'email') return <Mail className="w-4 h-4" />;
    if (type === 'call') return <Phone className="w-4 h-4" />;
    return <MessageSquare className="w-4 h-4" />;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 h-[500px]">
      {/* Left: Communication Log */}
      <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <h3 className="font-medium text-sm">Communication History</h3>
          <Badge variant="outline" className="text-xs">{logs.length} Interactions</Badge>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log.id} className="flex gap-3">
                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.direction === 'inbound' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                  {getIcon(log.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">{log.subject}</p>
                    <span className="text-xs text-slate-400">{moment(log.date).fromNow()}</span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                    "{log.content}"
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{log.direction === 'inbound' ? 'Received' : 'Sent'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">Sentiment: {getSentimentIcon(log.sentiment)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right: AI Analysis */}
      <Card className="h-full flex flex-col bg-violet-50/50 border-violet-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-violet-700">
            <Sparkles className="w-5 h-5" /> AI Opportunity Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <div className="p-4 bg-white rounded-lg border border-violet-100 shadow-sm">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Overall Sentiment Analysis</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 w-full opacity-80" />
                {/* Indicator would go here */}
              </div>
              <span className="text-xs font-bold text-slate-600">Mixed-Positive</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Client shows strong interest in features but has reservations about pricing. Trust building is key.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-500" /> Suggested Next Actions
            </h4>
            {aiSuggestions.map((suggestion, i) => (
              <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 hover:border-violet-300 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm text-slate-800">{suggestion.title}</span>
                  <Badge className={
                    suggestion.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }>{suggestion.priority}</Badge>
                </div>
                <p className="text-xs text-slate-500 mb-2">{suggestion.description}</p>
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="ghost" className="h-6 text-violet-600 text-xs">
                    Execute <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={analyzing}
            className="bg-violet-600 hover:bg-violet-700 w-full mt-auto"
          >
            {analyzing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-bounce" /> Analyzing Logs...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" /> Re-Analyze Context
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}