import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, Star, Lock, CheckCircle2, Clock } from 'lucide-react';

const milestones = [
  { key: '1%', label: '1% Improvement', reward: 'Recognition Badge', icon: Star, color: 'bg-slate-100' },
  { key: '3%', label: '3% Improvement', reward: '$50 Bonus', icon: Gift, color: 'bg-blue-100' },
  { key: '5%', label: '5% Improvement', reward: '$100 Bonus', icon: Gift, color: 'bg-green-100' },
  { key: '10%', label: '10% Improvement', reward: '$250 Bonus', icon: Trophy, color: 'bg-amber-100' },
  { key: '30%', label: '30% Improvement', reward: '$500 + Training Budget', icon: Trophy, color: 'bg-purple-100' },
  { key: '50%', label: '50% Improvement', reward: '$1000 + Promotion Review', icon: Trophy, color: 'bg-lime-100' }
];

export default function MilestoneRewards({ currentImprovement = 0, achievedMilestones = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Improvement Milestones & Rewards
        </CardTitle>
        <p className="text-sm text-slate-500">100% AI-driven, fair reward system - no human bias</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {milestones.map((milestone) => {
            const achieved = achievedMilestones.includes(milestone.key);
            const progress = parseFloat(milestone.key);
            const isNext = !achieved && currentImprovement < progress;
            const canUnlock = currentImprovement >= progress && !achieved;

            return (
              <div
                key={milestone.key}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  achieved 
                    ? 'border-green-500 bg-green-50' 
                    : canUnlock 
                      ? 'border-lime-500 bg-lime-50 animate-pulse' 
                      : 'border-slate-200 bg-slate-50'
                }`}
              >
                {achieved && (
                  <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-500" />
                )}
                {!achieved && !canUnlock && (
                  <Lock className="absolute top-2 right-2 w-4 h-4 text-slate-300" />
                )}
                
                <div className={`w-10 h-10 rounded-full ${milestone.color} flex items-center justify-center mb-3 mx-auto`}>
                  <milestone.icon className={`w-5 h-5 ${achieved ? 'text-green-600' : 'text-slate-600'}`} />
                </div>
                
                <p className="text-center font-bold text-lg">{milestone.label}</p>
                <p className="text-center text-xs text-slate-500 mt-1">{milestone.reward}</p>
                
                {achieved && (
                  <Badge className="w-full mt-3 justify-center bg-green-500">Achieved!</Badge>
                )}
                {canUnlock && (
                  <Badge className="w-full mt-3 justify-center bg-lime-500 animate-bounce">Claim Now!</Badge>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-slate-900 text-white rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Your Current Improvement</p>
              <p className="text-3xl font-bold text-lime-400">+{currentImprovement.toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Next Milestone</p>
              <p className="text-lg font-medium">
                {milestones.find(m => parseFloat(m.key) > currentImprovement)?.label || 'All Achieved! 🎉'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}