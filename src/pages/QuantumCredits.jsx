import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import QuantumCreditsHub from '@/components/loyalty/QuantumCreditsHub';
import TierJourney from '@/components/loyalty/TierJourney';
import ReferralProgram from '@/components/loyalty/ReferralProgram';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { Sparkles, Map, Users, Gift, Settings } from 'lucide-react';

export default function QuantumCredits() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('credits');

  // Sample user tier data
  const userTier = {
    tier: 'gold',
    total_points_earned: 18500,
    current_balance: 12500,
    multiplier: 1.5,
    referral_code: 'ARKQ-GOLD123',
    referral_count: 5
  };

  const handleRedeem = (reward) => {
    console.log('Redeeming:', reward);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Quantum Credits™</h1>
                  <p className="text-slate-500">ARKFinex Loyalty & Rewards Program</p>
                </div>
              </div>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="credits" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Credits Hub
                </TabsTrigger>
                <TabsTrigger value="journey" className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Tier Journey
                </TabsTrigger>
                <TabsTrigger value="referral" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Referral Program
                </TabsTrigger>
                <TabsTrigger value="rewards" className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Rewards Catalog
                </TabsTrigger>
              </TabsList>

              <TabsContent value="credits">
                <QuantumCreditsHub 
                  userTier={userTier} 
                  onRedeem={handleRedeem}
                />
              </TabsContent>

              <TabsContent value="journey">
                <TierJourney 
                  currentTier={userTier.tier} 
                  totalPoints={userTier.total_points_earned}
                />
              </TabsContent>

              <TabsContent value="referral">
                <ReferralProgram 
                  referralCode={userTier.referral_code}
                />
              </TabsContent>

              <TabsContent value="rewards">
                <div className="text-center py-12 text-slate-500">
                  <Gift className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Full rewards catalog coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Legal Disclaimer */}
            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500">
                <strong>Disclaimer:</strong> Quantum Credits™ is a loyalty and rewards program. Credits are redeemable for service discounts, feature upgrades, and partner rewards only. 
                Credits have no cash value and cannot be exchanged for currency. Revenue-share eligibility for Quantum tier members is provided through service credits and partner opportunities, 
                not as equity or profit distribution. Terms and conditions apply. ARKFinex reserves the right to modify the program at any time.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}