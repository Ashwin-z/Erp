import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Crown, Diamond, Gem, Check, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const TIERS = [
  { id: 'bronze', name: 'Bronze', icon: Star, color: 'from-amber-600 to-amber-800', minPoints: 0, benefits: ['Basic discounts', 'Newsletter'] },
  { id: 'silver', name: 'Silver', icon: Award, color: 'from-slate-400 to-slate-600', minPoints: 5000, benefits: ['5% discount', 'Priority email', 'Early access'] },
  { id: 'gold', name: 'Gold', icon: Crown, color: 'from-yellow-400 to-amber-500', minPoints: 15000, benefits: ['10% discount', 'Priority phone', 'Beta features', 'Quarterly call'] },
  { id: 'platinum', name: 'Platinum', icon: Diamond, color: 'from-slate-300 to-slate-500', minPoints: 50000, benefits: ['15% discount', 'Account manager', 'Custom integrations', 'Annual review'] },
  { id: 'quantum', name: 'Quantum', icon: Gem, color: 'from-purple-500 via-pink-500 to-cyan-500', minPoints: 150000, benefits: ['20% discount', 'White-glove support', 'Co-development', 'Executive events', 'Revenue-share eligibility*'] }
];

export default function TierJourney({ currentTier = 'bronze', totalPoints = 0 }) {
  const currentIndex = TIERS.findIndex(t => t.id === currentTier);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold mb-6">Your Tier Journey</h3>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200 rounded-full" />
          <div 
            className="absolute top-8 left-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentIndex / (TIERS.length - 1)) * 100}%` }}
          />

          {/* Tier Nodes */}
          <div className="relative flex justify-between">
            {TIERS.map((tier, i) => {
              const Icon = tier.icon;
              const isUnlocked = i <= currentIndex;
              const isCurrent = i === currentIndex;

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 ${
                      isUnlocked 
                        ? `bg-gradient-to-br ${tier.color} text-white shadow-lg` 
                        : 'bg-slate-100 text-slate-400'
                    } ${isCurrent ? 'ring-4 ring-lime-400 ring-offset-2' : ''}`}
                  >
                    <Icon className="w-8 h-8" />
                    {isUnlocked && i < currentIndex && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {!isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className={`mt-3 font-semibold ${isCurrent ? 'text-lime-600' : isUnlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                    {tier.name}
                  </p>
                  <p className="text-xs text-slate-500">{tier.minPoints.toLocaleString()} pts</p>
                  
                  {/* Benefits Preview */}
                  <div className="mt-3 space-y-1 max-w-[120px] text-center">
                    {tier.benefits.slice(0, 2).map((benefit, j) => (
                      <Badge 
                        key={j} 
                        variant="outline" 
                        className={`text-[9px] ${isUnlocked ? '' : 'opacity-50'}`}
                      >
                        {benefit}
                      </Badge>
                    ))}
                    {tier.benefits.length > 2 && (
                      <p className="text-[10px] text-slate-400">+{tier.benefits.length - 2} more</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-xl">
          <p className="text-sm text-slate-600">
            <strong className="text-slate-900">Quantum Tier</strong> members gain eligibility for our exclusive revenue-share program* through service credits and partner opportunities.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            *Subject to terms and conditions. Revenue-share benefits are provided as service credits, not cash dividends.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}