import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Copy, Share2, Gift, TrendingUp, CheckCircle2, 
  Clock, Mail, MessageSquare, Linkedin, Twitter
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ReferralProgram({ referralCode = 'ARKQ-USER123', referrals = [] }) {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://arkfinex.com/join?ref=${referralCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const shareOptions = [
    { icon: Mail, label: 'Email', action: () => window.open(`mailto:?subject=Join ARKFinex&body=Use my referral code ${referralCode} to get started!`) },
    { icon: Linkedin, label: 'LinkedIn', action: () => toast.info('Opening LinkedIn...') },
    { icon: Twitter, label: 'Twitter', action: () => toast.info('Opening Twitter...') },
    { icon: MessageSquare, label: 'WhatsApp', action: () => window.open(`https://wa.me/?text=Join ARKFinex with my code: ${referralCode}`) }
  ];

  const sampleReferrals = referrals.length ? referrals : [
    { name: 'TechCorp Pte Ltd', status: 'active', points: 1000, date: '2025-01-20' },
    { name: 'Marina Ventures', status: 'pending', points: 0, date: '2025-01-22' },
    { name: 'Global Trade SG', status: 'active', points: 1000, date: '2025-01-15' }
  ];

  const tierBonuses = [
    { tier: 'Bronze', bonus: '1,000 QC', color: 'from-amber-600 to-amber-800' },
    { tier: 'Silver', bonus: '1,250 QC', color: 'from-slate-400 to-slate-600' },
    { tier: 'Gold', bonus: '1,500 QC', color: 'from-yellow-400 to-amber-500' },
    { tier: 'Platinum', bonus: '2,000 QC', color: 'from-slate-300 to-slate-500' },
    { tier: 'Quantum', bonus: '3,000 QC', color: 'from-purple-500 to-pink-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white overflow-hidden">
        <CardContent className="p-8 relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Referral Program</h2>
                <p className="text-white/80">Earn rewards for every business you refer</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{sampleReferrals.length}</p>
                <p className="text-sm text-white/70">Total Referrals</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{sampleReferrals.filter(r => r.status === 'active').length}</p>
                <p className="text-sm text-white/70">Active</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{sampleReferrals.reduce((sum, r) => sum + r.points, 0).toLocaleString()}</p>
                <p className="text-sm text-white/70">Points Earned</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Your Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-500" />
              Your Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Input 
                value={referralCode} 
                readOnly 
                className="font-mono text-lg font-bold text-center"
              />
              <Button onClick={copyCode} variant="outline">
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-lg mb-4">
              <p className="text-sm text-slate-500 mb-2">Or share your link:</p>
              <div className="flex items-center gap-2">
                <Input value={referralLink} readOnly className="text-xs" />
                <Button size="sm" onClick={copyLink}><Copy className="w-3 h-3" /></Button>
              </div>
            </div>

            <p className="text-sm font-medium mb-3">Share via:</p>
            <div className="flex gap-2">
              {shareOptions.map((opt, i) => (
                <Button key={i} variant="outline" size="sm" onClick={opt.action}>
                  <opt.icon className="w-4 h-4 mr-1" />
                  {opt.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tier Bonuses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-lime-500" />
              Referral Bonuses by Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tierBonuses.map((tier, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {tier.tier[0]}
                    </div>
                    <span className="font-medium">{tier.tier}</span>
                  </div>
                  <Badge className="bg-lime-100 text-lime-700">{tier.bonus} per referral</Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              Your friend also receives 500 QC bonus when they sign up!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sampleReferrals.map((ref, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    ref.status === 'active' ? 'bg-green-100' : 'bg-amber-100'
                  }`}>
                    {ref.status === 'active' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{ref.name}</p>
                    <p className="text-xs text-slate-500">Referred on {ref.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={ref.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                    {ref.status}
                  </Badge>
                  {ref.points > 0 && (
                    <p className="text-sm font-bold text-green-600 mt-1">+{ref.points.toLocaleString()} QC</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}