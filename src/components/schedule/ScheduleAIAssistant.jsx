import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain, Send, Sparkles, Calendar, Users, Clock,
  AlertTriangle, TrendingUp, Loader2, Bot, Zap
} from 'lucide-react';

const quickActions = [
  { icon: Calendar, text: 'Arrange my next 7 days', category: 'schedule' },
  { icon: Users, text: 'Who is free to handle Ticket #1234?', category: 'assign' },
  { icon: TrendingUp, text: 'Optimize project timelines', category: 'optimize' },
  { icon: AlertTriangle, text: 'Show overbooked staff next week', category: 'workload' },
  { icon: Clock, text: 'Find meeting slot for team', category: 'meeting' },
  { icon: Zap, text: 'Auto-schedule pending tasks', category: 'automation' }
];

export default function ScheduleAIAssistant({ user, tasks, events, onAction }) {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your ARKSchedule AI Assistant. I can help you:\n\n• Auto-schedule your tasks\n• Find available team members\n• Optimize workload distribution\n• Set up delegation plans\n• Predict scheduling conflicts\n\nWhat would you like me to help with?`
    }
  ]);

  const handleSend = async () => {
    if (!query.trim()) return;

    setMessages([...messages, { role: 'user', content: query }]);
    setQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      const responses = [
        {
          trigger: 'next 7 days|arrange|schedule my',
          response: `📅 **Your Week Optimized**\n\nI've analyzed your tasks and calendar. Here's the suggested schedule:\n\n**Monday**\n• 9:00 - API Documentation (2h)\n• 14:00 - Team Standup (30m)\n• 15:00 - Client Call Prep (1h)\n\n**Tuesday**\n• 9:30 - Sprint Planning (2h)\n• 14:00 - Code Reviews (3h)\n\n**Wednesday**\n• 10:00 - Project Meeting (1h)\n• 14:00 - Feature Development (4h)\n\n**Thursday**\n• 9:00 - Testing & QA (3h)\n• 14:00 - Documentation (2h)\n\n**Friday**\n• 10:00 - Retrospective (1h)\n• 14:00 - Planning Next Sprint (2h)\n\nWould you like me to add these to your calendar?`
        },
        {
          trigger: 'who is free|available|assign|ticket',
          response: `👥 **Team Availability Analysis**\n\nFor Ticket #1234 (Login Issue - High Priority):\n\n**Best Match:**\n1. **Mike Johnson** ✨\n   • 45% workload (Most Available)\n   • Has resolved 12 similar tickets\n   • Available immediately\n\n**Alternatives:**\n2. Sarah Chen - 65% workload\n3. Anna Lee - 80% workload (Limited)\n\n💡 **Recommendation:** Assign to Mike Johnson. He has the bandwidth and experience with authentication issues.\n\nShall I assign this ticket to Mike?`
        },
        {
          trigger: 'optimi|timeline|project',
          response: `📊 **Project Timeline Optimization**\n\n**Current Status:**\n• 8 tasks at risk of delay\n• 2 resource conflicts detected\n• 3 tasks can be parallelized\n\n**Recommended Changes:**\n\n1. **Move "Database Migration" to Week 2**\n   Reason: Dependency on API completion\n   Impact: Saves 2 days\n\n2. **Reassign "UI Testing" to Anna**\n   Reason: John is overloaded\n   Impact: On-time delivery\n\n3. **Parallelize "Docs + Testing"**\n   Impact: Saves 3 days\n\n**Projected Improvement:**\n• 5 days earlier completion\n• 0 resource conflicts\n\nApply these optimizations?`
        },
        {
          trigger: 'overbook|workload|staff',
          response: `⚠️ **Workload Alert - Next Week**\n\n**Overbooked Staff:**\n\n🔴 **John Smith** - 120% capacity\n   • 15 tasks assigned\n   • 5 meetings scheduled\n   • Recommendation: Reassign 3 tasks\n\n🟡 **Anna Lee** - 95% capacity\n   • 12 tasks assigned\n   • At risk of overload\n\n🟢 **Mike Johnson** - 60% capacity\n   • Can take on 5 more tasks\n\n🟢 **Sarah Chen** - 55% capacity\n   • Available for high-priority items\n\n**Auto-Balance Option:**\nI can redistribute 4 tasks from John to Mike and Sarah to balance the team.\n\nShall I rebalance?`
        },
        {
          trigger: 'meeting|slot|find time',
          response: `📅 **Meeting Slot Finder**\n\nBest available slots for team meeting (1 hour):\n\n**This Week:**\n1. ✅ **Wed 2:00 PM** - All 5 members free\n2. ✅ **Thu 10:00 AM** - All members free\n3. ⚠️ **Fri 3:00 PM** - 4/5 members (Mike has conflict)\n\n**Next Week:**\n1. ✅ **Mon 11:00 AM** - All members free\n2. ✅ **Tue 2:00 PM** - All members free\n\n💡 **Recommendation:** Wednesday 2:00 PM has the best availability and energy levels (post-lunch productivity peak).\n\nShall I create the meeting invite?`
        }
      ];

      let aiResponse = "I can help you with scheduling and task management. Based on your current workload:\n\n• You have " + (tasks?.length || 8) + " pending tasks\n• " + (events?.length || 5) + " events this week\n• 2 high-priority items need attention\n\nWould you like me to optimize your schedule or help with something specific?";

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
      <CardHeader className="py-3 border-b bg-gradient-to-r from-lime-50 to-emerald-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-500 to-emerald-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          ARKSchedule AI
          <Badge className="bg-lime-100 text-lime-700 ml-auto">Smart</Badge>
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
                      <Bot className="w-4 h-4 text-lime-600" />
                      <span className="text-xs font-medium text-lime-600">AI Assistant</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-lg p-3">
                  <Loader2 className="w-5 h-5 animate-spin text-lime-600" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="p-3 border-t bg-slate-50">
          <p className="text-xs text-slate-500 mb-2">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.slice(0, 3).map((action, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setQuery(action.text)}
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.text.slice(0, 25)}...
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
              placeholder="Ask AI to schedule, optimize, or find..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isProcessing}
            />
            <Button 
              onClick={handleSend} 
              disabled={isProcessing || !query.trim()}
              className="bg-lime-500 hover:bg-lime-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}