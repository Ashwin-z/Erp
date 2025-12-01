import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, BarChart3, Wand2, Play, Pause, 
  Target, Users, MousePointer 
} from 'lucide-react';

export default function AdCampaigns() {
  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-purple-400" />
            Ad Campaign Manager
          </h1>
          <p className="text-slate-400">AI-Driven Marketing Automation</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Wand2 className="w-4 h-4 mr-2" />
          AI Auto-Create
        </Button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {[
          { name: 'Solar Farm Launch', status: 'Running', budget: '$50/day', roas: '4.2x', channels: ['FB', 'LI'] },
          { name: 'Luxury Villa Retargeting', status: 'Paused', budget: '$20/day', roas: '2.1x', channels: ['Google'] },
          { name: 'SME Lead Gen', status: 'Running', budget: '$100/day', roas: '5.5x', channels: ['LI', 'Email'] },
        ].map((camp, idx) => (
          <Card key={idx} className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${camp.status === 'Running' ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
                  {camp.status === 'Running' ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{camp.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {camp.channels.map(c => <Badge key={c} variant="outline" className="text-xs border-slate-600">{c}</Badge>)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 text-right">
                <div>
                  <p className="text-xs text-slate-500">Budget</p>
                  <p className="font-bold">{camp.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">ROAS</p>
                  <p className="font-bold text-emerald-400">{camp.roas}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-slate-700">Edit</Button>
                  <Button size="sm" variant="ghost" className="text-slate-400"><BarChart3 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insight */}
      <div className="mt-8 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl flex items-start gap-4">
        <Wand2 className="w-6 h-6 text-purple-400 mt-1" />
        <div>
          <h4 className="font-bold text-purple-200">Growth Agent Insight</h4>
          <p className="text-sm text-slate-300 mt-1">
            "SME Lead Gen" campaign on LinkedIn is outperforming others by 40%. 
            I recommend shifting $20/day from "Luxury Villa" to scale this campaign.
          </p>
          <div className="flex gap-3 mt-3">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 h-8 text-xs">Apply Changes</Button>
            <Button size="sm" variant="ghost" className="text-slate-400 h-8 text-xs hover:text-white">Dismiss</Button>
          </div>
        </div>
      </div>
    </div>
  );
}