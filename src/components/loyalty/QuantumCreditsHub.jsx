import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, Zap, Crown, Gift, TrendingUp, Users, ArrowRight,
  Star, Diamond, Award, Gem, Target, Wallet, History, Send
} from 'lucide-react';
import { motion } from 'framer-motion';

const TIERS = {
  bronze: { name: 'Bronze', color: 'from-amber-600 to-amber-800', icon: Star, multiplier: 1, minPoints: 0 },
  silver: { name: 'Silver', color: 'from-slate-400 to-slate-600', icon: Award, multiplier: 1.25, minPoints: 5000 },
  gold: { name: 'Gold', color: 'from-yellow-400 to-amber-500', icon: Crown, multiplier: 1.5, minPoints: 15000 },
  platinum: { name: 'Platinum', color: 'from-slate-300 to-slate-500', icon: Diamond, multiplier: 2, minPoints: 50000 },
  quantum: { name: 'Quantum', color: 'from-purple-500 via-pink-500 to-cyan-500', icon: Gem, multiplier: 3, minPoints: 150000 }
};

const BENEFITS = {
  bronze: ['Basic service discounts', 'Monthly newsletter'],
  silver: ['5% service discount', 'Priority email support', 'Early feature access'],
  gold: ['10% service discount', 'Priority phone support', 'Beta features access', 'Quarterly strategy call'],
  platinum: ['15% service discount', 'Dedicated account manager', 'Custom integrations', 'Annual business review'],
  quantum: ['20% service discount', 'White-glove support', 'Co-development opportunities', 'Executive networking events', 'Revenue-share eligibility*']
};

export default function QuantumCreditsHub({ userTier = {}, credits = [], onRedeem }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tier = userTier.tier || 'bronze';
  const tierConfig = TIERS[tier];
  const TierIcon = tierConfig.icon;
  const currentPoints = userTier.current_balance || 0;
  const totalEarned = userTier.total_points_earned || 0;
  
  // Calculate progress to next tier
  const tierOrder = ['bronze', 'silver', 'gold', 'platinum', 'quantum'];
  const currentIndex = tierOrder.indexOf(tier);
  const nextTier = currentIndex < 4 ? tierOrder[currentIndex + 1] : null;
  const nextTierConfig = nextTier ? TIERS[nextTier] : null;
  const progressToNext = nextTierConfig 
    ? Math.min(100, ((totalEarned - tierConfig.minPoints) / (nextTierConfig.minPoints - tierConfig.minPoints)) * 100)
    : 100;

  const recentActivity = [
    { type: 'earn', amount: 500, source: 'Invoice Payment', date: '2 hours ago' },
    { type: 'earn', amount: 1000, source: 'Referral Bonus', date: '1 day ago' },
    { type: 'redeem', amount: -200, source: '10% Discount Voucher', date: '3 days ago' },
    { type: 'earn', amount: 250, source: 'Milestone: 6 months', date: '1 week ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${tierConfig.color} p-8 text-white`}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <TierIcon className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Quantum Credits™</h1>
                  <p className="text-white/80">{tierConfig.name} Member</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">Current Balance</p>
              <p className="text-4xl font-bold">{currentPoints.toLocaleString()}</p>
              <p className="text-sm text-white/70">QC Points</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{tierConfig.multiplier}x</p>
              <p className="text-xs text-white/70">Earn Rate</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalEarned.toLocaleString()}</p>
              <p className="text-xs text-white/70">Lifetime Earned</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{userTier.referral_count || 0}</p>
              <p className="text-xs text-white/70">Referrals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Gift className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-white/70">Rewards Available</p>
            </div>
          </div>

          {nextTier && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Progress to {TIERS[nextTier].name}</span>
                <span className="text-sm font-medium">
                  {(nextTierConfig.minPoints - totalEarned).toLocaleString()} points to go
                </span>
              </div>
              <Progress value={progressToNext} className="h-3 bg-white/20" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="earn">Earn</TabsTrigger>
          <TabsTrigger value="redeem">Redeem</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Tier Benefits */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  Your {tierConfig.name} Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {BENEFITS[tier].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-lime-100 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-lime-600" />
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                {tier !== 'quantum' && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <p className="text-sm text-purple-700">
                      <strong>Upgrade to {TIERS[nextTier].name}</strong> to unlock {BENEFITS[nextTier].length - BENEFITS[tier].length} more benefits!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-lime-500 hover:bg-lime-600">
                  <Gift className="w-4 h-4 mr-2" />
                  Browse Rewards
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Send className="w-4 h-4 mr-2" />
                  Refer a Friend
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <History className="w-4 h-4 mr-2" />
                  View Statement
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Set Goals
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === 'earn' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {activity.type === 'earn' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <Gift className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.source}</p>
                        <p className="text-xs text-slate-500">{activity.date}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${activity.amount > 0 ? 'text-green-600' : 'text-blue-600'}`}>
                      {activity.amount > 0 ? '+' : ''}{activity.amount.toLocaleString()} QC
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earn" className="mt-6">
          <EarnSection tier={tier} multiplier={tierConfig.multiplier} />
        </TabsContent>

        <TabsContent value="redeem" className="mt-6">
          <RedeemSection currentPoints={currentPoints} tier={tier} onRedeem={onRedeem} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <HistorySection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EarnSection({ tier, multiplier }) {
  const earnMethods = [
    { icon: Wallet, title: 'Invoice Payments', description: 'Earn 1 QC per $1 spent on services', base: '1 QC / $1', boosted: `${multiplier} QC / $1` },
    { icon: Users, title: 'Referrals', description: 'Invite businesses to join ARKFinex', base: '1,000 QC', boosted: `${1000 * multiplier} QC` },
    { icon: Target, title: 'Milestones', description: 'Reach usage milestones for bonuses', base: 'Up to 5,000 QC', boosted: `Up to ${5000 * multiplier} QC` },
    { icon: Star, title: 'Reviews & Feedback', description: 'Share your experience and suggestions', base: '100 QC', boosted: `${100 * multiplier} QC` },
    { icon: Award, title: 'Certifications', description: 'Complete ARKFinex training modules', base: '500 QC', boosted: `${500 * multiplier} QC` },
    { icon: Zap, title: 'Early Adopter', description: 'Try new features first', base: '250 QC', boosted: `${250 * multiplier} QC` }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {earnMethods.map((method, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center">
                  <method.icon className="w-6 h-6 text-lime-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{method.title}</h3>
                  <p className="text-sm text-slate-500 mb-3">{method.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{method.base}</Badge>
                    {multiplier > 1 && (
                      <>
                        <ArrowRight className="w-4 h-4 text-lime-500" />
                        <Badge className="bg-lime-100 text-lime-700">{method.boosted}</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function RedeemSection({ currentPoints, tier, onRedeem }) {
  const rewards = [
    { id: 1, name: '10% Service Discount', points: 500, category: 'discount', minTier: 'bronze', value: '$50' },
    { id: 2, name: '25% Service Discount', points: 1000, category: 'discount', minTier: 'silver', value: '$125' },
    { id: 3, name: 'Priority Support (1 Month)', points: 750, category: 'service', minTier: 'bronze', value: '$100' },
    { id: 4, name: 'Custom Report Template', points: 1500, category: 'feature', minTier: 'gold', value: '$200' },
    { id: 5, name: 'Strategy Consultation (1 Hour)', points: 3000, category: 'experience', minTier: 'platinum', value: '$500' },
    { id: 6, name: 'Partner Reward: AWS Credits', points: 5000, category: 'partner', minTier: 'gold', value: '$250' }
  ];

  const tierOrder = ['bronze', 'silver', 'gold', 'platinum', 'quantum'];
  const currentTierIndex = tierOrder.indexOf(tier);

  return (
    <div className="grid grid-cols-3 gap-4">
      {rewards.map((reward, i) => {
        const rewardTierIndex = tierOrder.indexOf(reward.minTier);
        const isUnlocked = currentTierIndex >= rewardTierIndex;
        const canAfford = currentPoints >= reward.points;

        return (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`h-full ${!isUnlocked ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="capitalize">{reward.category}</Badge>
                  <Badge className={`${TIERS[reward.minTier].color} text-white text-[10px]`}>
                    {TIERS[reward.minTier].name}+
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">{reward.name}</h3>
                <p className="text-sm text-slate-500 mb-4">Value: {reward.value}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{reward.points.toLocaleString()} QC</span>
                  <Button 
                    size="sm"
                    disabled={!isUnlocked || !canAfford}
                    className="bg-lime-500 hover:bg-lime-600"
                    onClick={() => onRedeem?.(reward)}
                  >
                    {!isUnlocked ? 'Locked' : !canAfford ? 'Need More' : 'Redeem'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function HistorySection() {
  const history = [
    { date: '2025-01-25', type: 'earn', amount: 500, description: 'Invoice Payment #INV-2025-001', balance: 12500 },
    { date: '2025-01-24', type: 'earn', amount: 1000, description: 'Referral Bonus - TechCorp Pte Ltd', balance: 12000 },
    { date: '2025-01-22', type: 'redeem', amount: -500, description: '10% Service Discount Voucher', balance: 11000 },
    { date: '2025-01-20', type: 'earn', amount: 250, description: 'Feature Feedback Bonus', balance: 11500 },
    { date: '2025-01-15', type: 'earn', amount: 2000, description: '6-Month Milestone Bonus', balance: 11250 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((tx, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  tx.type === 'earn' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {tx.type === 'earn' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <Gift className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-blue-600'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} QC
                </p>
                <p className="text-xs text-slate-500">Balance: {tx.balance.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}