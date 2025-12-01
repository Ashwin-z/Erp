import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Megaphone, Sparkles, Target, Calendar, DollarSign, 
  Wand2, Image as ImageIcon, Send, PlayCircle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function CampaignBuilder() {
  const [step, setStep] = useState(1);
  
  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-blue-400" />
              AI Campaign Builder
            </h1>
            <p className="text-slate-400">Create multi-channel campaigns in minutes</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-slate-600'}`} />
              <span className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-slate-600'}`} />
              <span className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-slate-600'}`} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Campaign Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Campaign Name</label>
                  <Input className="bg-slate-950 border-slate-800" placeholder="e.g., Summer Flash Sale" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Objective</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Awareness', 'Conversion', 'Retention'].map(obj => (
                      <button key={obj} className="px-4 py-3 rounded-lg border border-slate-800 hover:border-blue-500 hover:bg-blue-500/10 text-sm transition-all text-left">
                        {obj}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Target Segment (AI Recommended)</label>
                  <div className="flex flex-wrap gap-2">
                    {['Recent Churn Risk', 'High LTV > $1k', 'Cart Abandoners (24h)'].map(seg => (
                      <Badge key={seg} variant="outline" className="cursor-pointer hover:bg-blue-500/20 border-slate-700">
                        {seg}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  AI Content Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Key Message / Offer</label>
                  <Textarea className="bg-slate-950 border-slate-800" placeholder="Describe your offer (e.g., 20% off for VIPs this weekend)" />
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Creatives
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Preview */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Live Preview</h3>
              
              {/* Email Preview */}
              <div className="bg-white rounded-lg overflow-hidden mb-4">
                <div className="bg-slate-100 p-2 border-b flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div className="p-4 text-slate-900">
                  <div className="h-32 bg-slate-200 rounded-lg mb-3 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Unlock Your VIP Status 🌟</h4>
                  <p className="text-sm text-slate-600 mb-4">Hey Sarah, we noticed you've been eyeing the new collection. Here's an exclusive 20% off just for you.</p>
                  <Button size="sm" className="w-full bg-blue-600 text-white">Shop Now</Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Estimated Reach</span>
                  <span className="text-white font-bold">12,450</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Predicted ROI</span>
                  <span className="text-emerald-400 font-bold">4.2x</span>
                </div>
              </div>

              <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 font-bold">
                <PlayCircle className="w-4 h-4 mr-2" />
                Launch Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}