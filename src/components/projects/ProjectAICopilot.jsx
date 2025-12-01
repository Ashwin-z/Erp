import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain, Send, Sparkles, Zap, Clock, Users, 
  AlertTriangle, TrendingUp, Calendar, Loader2, Bot
} from 'lucide-react';

const suggestions = [
  { icon: AlertTriangle, text: 'Show tasks that will exceed budget', category: 'analysis' },
  { icon: Users, text: 'Reallocate manpower to finish faster', category: 'optimization' },
  { icon: Calendar, text: 'Create sprint plan for next week', category: 'planning' },
  { icon: Clock, text: 'Predict project completion date', category: 'forecast' },
  { icon: TrendingUp, text: 'Generate weekly status report', category: 'report' },
  { icon: Zap, text: 'Auto-prioritize backlog tasks', category: 'automation' }
];

export default function ProjectAICopilot({ project, tasks, onAction }) {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your AI Project Copilot for "${project?.name || 'this project'}". I can help you with:\n\n• Predicting delays and risks\n• Optimizing resource allocation\n• Generating reports and insights\n• Creating task plans automatically\n\nHow can I assist you today?`
    }
  ]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setMessages([...messages, userMessage]);
    setQuery('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          trigger: 'budget',
          response: `Based on my analysis of ${project?.name || 'this project'}:\n\n📊 **Budget Status**\n• Budget: $${(project?.budget || 50000).toLocaleString()}\n• Spent: $${(project?.actual_cost || 35000).toLocaleString()}\n• Remaining: $${((project?.budget || 50000) - (project?.actual_cost || 35000)).toLocaleString()}\n\n⚠️ **At-Risk Tasks**\n3 tasks are trending over budget. I recommend reviewing the scope of "API Integration" and "Database Migration" tasks.\n\nWould you like me to generate a detailed cost report?`
        },
        {
          trigger: 'manpower|resource|allocat',
          response: `📊 **Resource Analysis**\n\nCurrent team utilization:\n• John Smith: 95% (Overloaded)\n• Sarah Chen: 75% (Optimal)\n• Mike Johnson: 45% (Available)\n\n💡 **Recommendation**\nI suggest reassigning 2 tasks from John to Mike to balance the workload. This could reduce the project timeline by 3 days.\n\nShall I create the reassignment plan?`
        },
        {
          trigger: 'sprint|week',
          response: `📅 **Sprint Plan Generated**\n\n**Sprint 5 (Next Week)**\nGoal: Complete User Authentication Module\n\n**Tasks:**\n1. Login API endpoint (5h) - Sarah\n2. OAuth integration (8h) - John\n3. Session management (4h) - Mike\n4. Security testing (6h) - Anna\n\nTotal: 23 story points\nVelocity match: ✅ (avg. 25 points/sprint)\n\nWould you like me to create these tasks?`
        },
        {
          trigger: 'complet|predict|deadline',
          response: `🔮 **Completion Prediction**\n\nBased on current velocity and remaining work:\n\n• Planned End Date: ${project?.end_date || 'Jan 15, 2025'}\n• Predicted End Date: ${project?.end_date || 'Jan 18, 2025'}\n• Confidence: 78%\n\n⚠️ **Risk Factors:**\n1. 3 blocked tasks affecting timeline\n2. Resource constraints in Week 3\n3. Pending client approvals\n\n💡 **To get back on track:**\n• Resolve blocked tasks (save 2 days)\n• Add 1 developer for Week 3 (save 1 day)`
        },
        {
          trigger: 'report|status',
          response: `📋 **Weekly Status Report Generated**\n\n**Project: ${project?.name || 'Project Alpha'}**\n**Week Ending: Dec 22, 2024**\n\n**Progress:** 65% → 72% (+7%)\n**Tasks Completed:** 8\n**Tasks In Progress:** 5\n\n**Highlights:**\n✅ API integration completed ahead of schedule\n✅ Database migration successful\n\n**Concerns:**\n⚠️ UI testing delayed by 2 days\n⚠️ Client feedback pending\n\n**Next Week:**\n• Complete user authentication\n• Begin performance testing\n\nShall I email this to stakeholders?`
        }
      ];

      let aiResponse = "I understand you're asking about project management. Let me analyze the current project data and provide insights.\n\nBased on the current status:\n• Total Tasks: " + (tasks?.length || 15) + "\n• Completed: " + (tasks?.filter(t => t.status === 'done').length || 8) + "\n• In Progress: " + (tasks?.filter(t => t.status === 'in_progress').length || 4) + "\n\nIs there something specific you'd like me to help with?";

      for (const r of responses) {
        if (new RegExp(r.trigger, 'i').test(query)) {
          aiResponse = r.response;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          AI Project Copilot
          <Badge className="bg-purple-100 text-purple-700 ml-auto">Beta</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-900'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600">AI Copilot</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-lg p-3">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        <div className="p-3 border-t bg-slate-50">
          <p className="text-xs text-slate-500 mb-2">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 3).map((s, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setQuery(s.text);
                }}
              >
                <s.icon className="w-3 h-3 mr-1" />
                {s.text}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI anything about this project..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isProcessing}
            />
            <Button 
              onClick={handleSend} 
              disabled={isProcessing || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}