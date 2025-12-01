import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Users, UserPlus, Search, Filter, TrendingUp, Star,
  Phone, Mail, Building2, Calendar, Sparkles, Camera,
  MoreVertical, Eye, Edit, Trash2, Target
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SOPGuide from '@/components/modules/SOPGuide';
import ModuleDashboard from '@/components/modules/ModuleDashboard';

const crmSOP = {
  title: "CRM Workflow Guide",
  description: "Lead capture → Qualification → Conversion → Retention",
  steps: [
    { name: "Lead Capture", description: "Capture leads from various sources including web forms, business cards, referrals, and campaigns.", checklist: ["Scan business card", "Fill contact details", "Assign to sales rep", "Set follow-up date"] },
    { name: "Qualification", description: "AI scores leads based on engagement, company size, and conversion probability.", checklist: ["Review AI lead score", "Verify contact info", "Identify decision makers", "Assess budget & timeline"] },
    { name: "Engagement", description: "Active outreach and relationship building with qualified leads.", checklist: ["Initial outreach", "Send proposal", "Schedule demo", "Address objections"] },
    { name: "Conversion", description: "Convert qualified leads into paying customers.", checklist: ["Negotiate terms", "Create sales order", "Get approval", "Send invoice"] },
    { name: "Retention", description: "Ongoing customer success and relationship management.", checklist: ["Onboarding", "Regular check-ins", "Upsell opportunities", "Collect feedback"] }
  ]
};

export default function CRM() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list('-created_date', 100)
  });

  const stats = [
    { label: 'Total Contacts', value: contacts.length || 247, icon: Users, color: 'bg-blue-500', trend: 12 },
    { label: 'Active Leads', value: contacts.filter(c => c.status === 'lead').length || 89, icon: Target, color: 'bg-lime-500', trend: 8 },
    { label: 'Customers', value: contacts.filter(c => c.status === 'active').length || 156, icon: Star, color: 'bg-purple-500', trend: 5 },
    { label: 'Avg Lead Score', value: '72', icon: Sparkles, color: 'bg-amber-500', trend: 15 }
  ];

  const statusColors = {
    lead: 'bg-blue-100 text-blue-700',
    prospect: 'bg-amber-100 text-amber-700',
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-slate-100 text-slate-700',
    churned: 'bg-red-100 text-red-700'
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.contact_person?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || c.type === activeTab || c.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1800px] mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">CRM - Customer Relationship</h1>
                <p className="text-slate-500">Manage leads, customers, and vendors with AI insights</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Card
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </div>

            {/* SOP Guide */}
            <SOPGuide {...crmSOP} />

            {/* Dashboard Stats */}
            <ModuleDashboard stats={stats} />

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search contacts..."
                  className="pl-10"
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="customer">Customers</TabsTrigger>
                  <TabsTrigger value="vendor">Vendors</TabsTrigger>
                  <TabsTrigger value="lead">Leads</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Contacts Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>AI Score</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(filteredContacts.length > 0 ? filteredContacts : [
                      { id: 1, contact_person: 'John Tan', company_name: 'TechStart Pte Ltd', type: 'customer', status: 'active', ai_lead_score: 85, assigned_to: 'Sarah', last_contact_date: '2024-12-20', industry: 'Technology' },
                      { id: 2, contact_person: 'Lisa Wong', company_name: 'Marina Foods', type: 'customer', status: 'active', ai_lead_score: 92, assigned_to: 'Michael', last_contact_date: '2024-12-19', industry: 'F&B' },
                      { id: 3, contact_person: 'David Lee', company_name: 'Global Logistics', type: 'lead', status: 'lead', ai_lead_score: 67, assigned_to: 'Sarah', last_contact_date: '2024-12-18', industry: 'Logistics' },
                      { id: 4, contact_person: 'Emily Chen', company_name: 'Urban Retail', type: 'lead', status: 'prospect', ai_lead_score: 78, assigned_to: 'John', last_contact_date: '2024-12-17', industry: 'Retail' },
                      { id: 5, contact_person: 'Robert Lim', company_name: 'Skyline Properties', type: 'vendor', status: 'active', ai_lead_score: 45, assigned_to: 'Michael', last_contact_date: '2024-12-16', industry: 'Real Estate' }
                    ]).map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                              <span className="text-sm font-medium">{contact.contact_person?.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium">{contact.contact_person}</p>
                              <p className="text-xs text-slate-500">{contact.industry}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            {contact.company_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{contact.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[contact.status]}>{contact.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              contact.ai_lead_score >= 80 ? 'bg-green-100 text-green-700' :
                              contact.ai_lead_score >= 60 ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {contact.ai_lead_score}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{contact.assigned_to}</TableCell>
                        <TableCell>{contact.last_contact_date}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}