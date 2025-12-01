import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, Calendar, Trophy, ShoppingBag, Truck, 
  AlertCircle, CheckCircle2, Clock
} from 'lucide-react';

export default function GiftManager() {
  const pendingGifts = [
    { id: 1, user: 'Alice Chen', trigger: 'Birthday', gift: 'Premium Notebook', status: 'Pending', date: 'Today' },
    { id: 2, user: 'Marcus Low', trigger: 'Tier Upgrade (Gold)', gift: 'Welcome Kit', status: 'Allocated', date: 'Yesterday' },
    { id: 3, user: 'Sarah Smith', trigger: 'High Spender', gift: 'Champagne Bottle', status: 'Processing', date: '2 days ago' },
  ];

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gift className="w-8 h-8 text-pink-400" />
            Gifts & Loyalty Engine
          </h1>
          <p className="text-slate-400">Automated surprise & delight for high-value customers</p>
        </div>
        <div className="flex gap-3">
          <Card className="bg-slate-900 border-slate-800 px-4 py-2 flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-500">Gift Inventory</p>
              <p className="font-bold">450 Items</p>
            </div>
          </Card>
          <Button className="bg-pink-600 hover:bg-pink-700">
            <Gift className="w-4 h-4 mr-2" />
            Manual Gift
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Triggers & Rules */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="w-5 h-5 text-amber-400" />
                Active Triggers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Birthday Surprise', count: 12, color: 'bg-blue-500' },
                { name: 'Tier Upgrade (Gold)', count: 5, color: 'bg-amber-500' },
                { name: 'Recovery (Apology)', count: 2, color: 'bg-red-500' },
                { name: 'Anniversary', count: 8, color: 'bg-pink-500' },
              ].map((rule, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${rule.color}`} />
                    <span className="text-sm font-medium">{rule.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">{rule.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Allocated</span>
                  <span>$5,000</span>
                </div>
                <Progress value={65} className="h-2 bg-slate-800" />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Used: $3,250</span>
                  <span>Remaining: $1,750</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main List */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Recent Allocations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {pendingGifts.map((gift) => (
                  <div key={gift.id} className="flex items-center justify-between p-4 hover:bg-slate-800/50 rounded-lg transition-colors border-b border-slate-800/50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                        <Gift className="w-5 h-5 text-pink-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{gift.user}</h4>
                        <p className="text-xs text-slate-400">Trigger: {gift.trigger}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-200">{gift.gift}</p>
                        <p className="text-xs text-slate-500">{gift.date}</p>
                      </div>
                      <Badge className={`
                        ${gift.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' : ''}
                        ${gift.status === 'Allocated' ? 'bg-blue-500/20 text-blue-400' : ''}
                        ${gift.status === 'Processing' ? 'bg-purple-500/20 text-purple-400' : ''}
                      `}>
                        {gift.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}