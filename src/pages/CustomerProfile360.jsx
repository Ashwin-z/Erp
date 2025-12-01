import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, Search, Filter, Star, Wallet, TrendingUp, 
  Mail, Phone, Calendar, MoreHorizontal 
} from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerProfile360() {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['customerProfiles'],
    queryFn: () => base44.entities.CustomerProfile.list(),
    initialData: []
  });

  // Mock data if empty
  const displayProfiles = profiles.length > 0 ? profiles : [
    { id: 1, user_email: 'sarah@example.com', name: 'Sarah Jenkins', segment: 'VIP', ltv: 12500, purchase_prob: 92, loyalty_points: 4500, token_balance: 120, last_active: '2 mins ago' },
    { id: 2, user_email: 'mike@example.com', name: 'Mike Ross', segment: 'At Risk', ltv: 3400, purchase_prob: 35, loyalty_points: 120, token_balance: 0, last_active: '5 days ago' },
    { id: 3, user_email: 'jess@example.com', name: 'Jessica Pearson', segment: 'High Spender', ltv: 45000, purchase_prob: 88, loyalty_points: 12000, token_balance: 500, last_active: '1 hour ago' },
  ];

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            Customer 360
          </h1>
          <p className="text-slate-400">AI-driven segmentation and LTV prediction</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input 
              className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500" 
              placeholder="Search customers..."
            />
          </div>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Filter className="w-4 h-4 mr-2" />
            Segments
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProfiles.map((profile) => (
          <Card key={profile.id} className="bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-colors group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-slate-700 group-hover:border-purple-500/50 transition-colors">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_email}`} />
                    <AvatarFallback>{profile.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{profile.name || profile.user_email.split('@')[0]}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {profile.user_email}
                    </p>
                  </div>
                </div>
                <Badge className={`
                  ${profile.segment === 'VIP' ? 'bg-purple-500/20 text-purple-400' : ''}
                  ${profile.segment === 'At Risk' ? 'bg-red-500/20 text-red-400' : ''}
                  ${profile.segment === 'High Spender' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                `}>
                  {profile.segment}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">LTV</p>
                  <p className="font-bold text-emerald-400">${profile.ltv?.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">Points</p>
                  <p className="font-bold text-amber-400">{profile.loyalty_points?.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2">
                  <p className="text-xs text-slate-500 mb-1">Prob.</p>
                  <p className={`font-bold ${profile.purchase_prob > 70 ? 'text-green-400' : 'text-slate-300'}`}>
                    {profile.purchase_prob}%
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Wallet className="w-3 h-3" />
                  <span>{profile.token_balance} Tokens</span>
                </div>
                <div className="flex gap-2">
                   <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-800 text-slate-400">
                     <Phone className="w-4 h-4" />
                   </Button>
                   <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-800 text-slate-400">
                     <Calendar className="w-4 h-4" />
                   </Button>
                   <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-800 text-slate-400">
                     <MoreHorizontal className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}