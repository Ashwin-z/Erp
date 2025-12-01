import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Plus, BarChart3, Users, 
  Target, DollarSign, Play, Pause, MoreHorizontal,
  Filter, Download, Search, Activity
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import AdCampaignForm from "@/components/ads/AdCampaignForm";
import RoleGuard from "@/components/auth/RoleGuard";

export default function AdsManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [stats, setStats] = useState({
      revenue: 12450,
      impressions: 854000,
      clicks: 12300,
      ctr: 1.44
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await base44.entities.AdCampaign.list();
      // If no data, use simulated
      if (data.length === 0) {
        setCampaigns([
            { id: 1, name: "Black Friday Promo", advertiser: "Urban Retail", status: "Active", budget_total: 5000, spent: 1200, impressions: 45000, clicks: 800 },
            { id: 2, name: "SaaS B2B Awareness", advertiser: "TechStart", status: "Active", budget_total: 10000, spent: 3400, impressions: 120000, clicks: 1500 },
        ]);
      } else {
        setCampaigns(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (data) => {
    try {
        if (editingCampaign) {
            // Update logic would go here
            // await base44.entities.AdCampaign.update(editingCampaign.id, data);
        } else {
            await base44.entities.AdCampaign.create(data);
        }
        setIsFormOpen(false);
        setEditingCampaign(null);
        loadCampaigns();
    } catch (e) {
        console.error(e);
    }
  };

  const openNew = () => {
      setEditingCampaign(null);
      setIsFormOpen(true);
  };

  const openEdit = (campaign) => {
      setEditingCampaign(campaign);
      setIsFormOpen(true);
  };

  return (
    <RoleGuard allowedRoles={['Advertiser', 'Agency Admin', 'Platform Admin']}>
    <div className="p-6 min-h-screen bg-slate-50/50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ads Manager</h1>
          <p className="text-slate-500">Monetization & Campaign Administration</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export Report</Button>
            <RoleGuard allowedRoles={['Advertiser', 'Agency Admin']}>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={openNew}>
                    <Plus className="w-4 h-4 mr-2" /> New Campaign
                </Button>
            </RoleGuard>
        </div>
      </div>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-[600px] overflow-y-auto sm:max-w-[600px]">
            <SheetHeader>
                <SheetTitle>{editingCampaign ? 'Edit Campaign' : 'New Campaign'}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
                <AdCampaignForm 
                    initialData={editingCampaign} 
                    onSubmit={handleCreate} 
                    onCancel={() => setIsFormOpen(false)} 
                />
            </div>
        </SheetContent>
      </Sheet>

      {/* High-Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-slate-900">${stats.revenue.toLocaleString()}</h3>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                        <Activity className="w-3 h-3 mr-1" /> +12% vs last month
                    </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                    <DollarSign className="w-6 h-6" />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Impressions</p>
                    <h3 className="text-2xl font-bold text-slate-900">{(stats.impressions / 1000).toFixed(1)}k</h3>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                        <Activity className="w-3 h-3 mr-1" /> +5%
                    </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <Users className="w-6 h-6" />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Total Clicks</p>
                    <h3 className="text-2xl font-bold text-slate-900">{(stats.clicks / 1000).toFixed(1)}k</h3>
                    <p className="text-xs text-red-600 flex items-center mt-1">
                        <Activity className="w-3 h-3 mr-1" /> -2%
                    </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                    <Target className="w-6 h-6" />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Avg. CTR</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.ctr}%</h3>
                    <p className="text-xs text-emerald-600 flex items-center mt-1">
                        <Activity className="w-3 h-3 mr-1" /> +0.2%
                    </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                    <BarChart3 className="w-6 h-6" />
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="border-b border-slate-100 bg-white rounded-t-xl">
            <div className="flex justify-between items-center">
                <CardTitle>Campaigns</CardTitle>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search campaigns..." className="pl-9 w-[250px]" />
                    </div>
                    <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Campaign Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Advertiser</th>
                            <th className="px-6 py-4 text-right">Budget</th>
                            <th className="px-6 py-4 text-right">Spent</th>
                            <th className="px-6 py-4 text-right">Impr.</th>
                            <th className="px-6 py-4 text-right">Clicks</th>
                            <th className="px-6 py-4 text-right">CTR</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {campaigns.map((campaign) => (
                            <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{campaign.name}</td>
                                <td className="px-6 py-4">
                                    <Badge className={
                                        campaign.status === 'Active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                                        campaign.status === 'Paused' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                                        'bg-slate-100 text-slate-600 hover:bg-slate-100'
                                    }>
                                        {campaign.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{campaign.advertiser}</td>
                                <td className="px-6 py-4 text-right">${(campaign.budget_total || campaign.budget || 0).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-medium">${(campaign.spent || 0).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-slate-600">{campaign.impressions.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-slate-600">{campaign.clicks.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-medium text-slate-900">
                                    {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEdit(campaign)}>Edit Campaign</DropdownMenuItem>
                                            <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                            <DropdownMenuItem>Pause</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </div>
    </RoleGuard>
  );
}