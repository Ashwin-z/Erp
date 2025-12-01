import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Building2, Plus, Search, Star, Truck, ShieldCheck,
  FileText, Send, Eye, Edit, Phone, Mail, MapPin,
  Clock, DollarSign, TrendingUp, AlertTriangle
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SOPGuide from '../components/modules/SOPGuide';
import ModuleDashboard from '../components/modules/ModuleDashboard';

const vendorSOP = {
  title: "Vendor Management Workflow",
  description: "Onboard → Qualify → Engage → Rate → Review",
  steps: [
    { name: "Onboard", description: "Register and verify new vendors.", checklist: ["Collect vendor info", "Verify documents", "Check certifications", "Approve vendor"] },
    { name: "Qualify", description: "Assess vendor capabilities and compliance.", checklist: ["Review portfolio", "Check references", "Assess capacity", "Set credit terms"] },
    { name: "Engage", description: "Send RFQs and receive quotations.", checklist: ["Create RFQ", "Send to vendors", "Collect quotes", "Compare pricing"] },
    { name: "Rate", description: "Evaluate vendor performance after orders.", checklist: ["Rate delivery", "Rate quality", "Rate pricing", "Add comments"] },
    { name: "Review", description: "Periodic vendor performance review.", checklist: ["Analyze metrics", "Compare vendors", "Renew or suspend", "Update status"] }
  ]
};

export default function VendorManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('vendors');
  const [selectedVendor, setSelectedVendor] = useState(null);

  const { data: vendors = [] } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => base44.entities.Vendor.list('-created_date', 100)
  });

  const stats = [
    { label: 'Total Vendors', value: 156, icon: Building2, color: 'bg-blue-500', trend: 8 },
    { label: 'Active Vendors', value: 124, icon: ShieldCheck, color: 'bg-green-500', trend: 5 },
    { label: 'Pending RFQs', value: 12, icon: FileText, color: 'bg-amber-500', trend: -3 },
    { label: 'Avg Rating', value: '4.2', icon: Star, color: 'bg-purple-500', trend: 2 }
  ];

  const sampleVendors = vendors.length > 0 ? vendors : [
    { id: 1, vendor_code: 'VND-001', company_name: 'Ace Supplies Pte Ltd', category: 'Electronics', status: 'active', rating: 4.5, on_time_delivery: 96, quality_score: 92, total_orders: 45, total_spend: 125000, main_contact: { name: 'John Lim', email: 'john@acesupplies.com', phone: '+65 6123 4567' }, office_address: { city: 'Singapore', country: 'Singapore' } },
    { id: 2, vendor_code: 'VND-002', company_name: 'TechSource Singapore', category: 'Technology', status: 'active', rating: 4.8, on_time_delivery: 98, quality_score: 95, total_orders: 32, total_spend: 280000, main_contact: { name: 'Sarah Tan', email: 'sarah@techsource.sg', phone: '+65 6234 5678' }, office_address: { city: 'Singapore', country: 'Singapore' } },
    { id: 3, vendor_code: 'VND-003', company_name: 'Global Parts Co', category: 'Components', status: 'active', rating: 3.8, on_time_delivery: 85, quality_score: 80, total_orders: 67, total_spend: 89000, main_contact: { name: 'Mike Wong', email: 'mike@globalparts.com', phone: '+65 6345 6789' }, office_address: { city: 'Singapore', country: 'Singapore' } },
    { id: 4, vendor_code: 'VND-004', company_name: 'Prime Materials Ltd', category: 'Raw Materials', status: 'pending', rating: 0, on_time_delivery: 0, quality_score: 0, total_orders: 0, total_spend: 0, main_contact: { name: 'Lisa Chen', email: 'lisa@primematerials.com', phone: '+65 6456 7890' }, office_address: { city: 'Johor Bahru', country: 'Malaysia' } },
    { id: 5, vendor_code: 'VND-005', company_name: 'Eastern Trading', category: 'General', status: 'suspended', rating: 2.5, on_time_delivery: 65, quality_score: 60, total_orders: 23, total_spend: 45000, main_contact: { name: 'David Ng', email: 'david@eastern.com', phone: '+65 6567 8901' }, office_address: { city: 'Singapore', country: 'Singapore' } }
  ];

  const rfqs = [
    { id: 1, rfq_number: 'RFQ-2024-056', title: 'Office Equipment Q1 2025', status: 'sent', vendors: 5, quotes: 3, due_date: '2024-12-25', value: 45000 },
    { id: 2, rfq_number: 'RFQ-2024-055', title: 'IT Hardware Refresh', status: 'evaluating', vendors: 4, quotes: 4, due_date: '2024-12-20', value: 120000 },
    { id: 3, rfq_number: 'RFQ-2024-054', title: 'Warehouse Supplies', status: 'awarded', vendors: 6, quotes: 5, due_date: '2024-12-15', value: 28000 }
  ];

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    suspended: 'bg-red-100 text-red-700',
    blacklisted: 'bg-slate-100 text-slate-700',
    draft: 'bg-slate-100 text-slate-700',
    sent: 'bg-blue-100 text-blue-700',
    received_quotes: 'bg-purple-100 text-purple-700',
    evaluating: 'bg-amber-100 text-amber-700',
    awarded: 'bg-green-100 text-green-700'
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating > 0 ? rating.toFixed(1) : '-'}</span>
      </div>
    );
  };

  const filteredVendors = sampleVendors.filter(v =>
    v.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vendor_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Vendor Management</h1>
                <p className="text-slate-500">Manage vendors, RFQs, quotations, and performance ratings</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  New RFQ
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vendor
                </Button>
              </div>
            </div>

            <SOPGuide {...vendorSOP} />
            <ModuleDashboard stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
                <TabsTrigger value="rfqs">RFQs</TabsTrigger>
                <TabsTrigger value="quotes">Quotations</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
              </TabsList>

              <TabsContent value="vendors">
                <div className="mb-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search vendors..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  {filteredVendors.map((vendor) => (
                    <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-slate-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{vendor.company_name}</h3>
                                <Badge className={statusColors[vendor.status]}>{vendor.status}</Badge>
                              </div>
                              <p className="text-sm text-slate-500">{vendor.vendor_code} • {vendor.category}</p>
                              
                              <div className="flex items-center gap-6 mt-3 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  {vendor.main_contact?.email}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {vendor.main_contact?.phone}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {vendor.office_address?.city}, {vendor.office_address?.country}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="mb-1">{renderStars(vendor.rating)}</div>
                              <p className="text-xs text-slate-500">Rating</p>
                            </div>
                            <div className="text-center">
                              <p className={`text-lg font-bold ${vendor.on_time_delivery >= 90 ? 'text-green-600' : vendor.on_time_delivery >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                                {vendor.on_time_delivery || 0}%
                              </p>
                              <p className="text-xs text-slate-500">On-Time</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-slate-900">{vendor.total_orders}</p>
                              <p className="text-xs text-slate-500">Orders</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-slate-900">${(vendor.total_spend / 1000).toFixed(0)}K</p>
                              <p className="text-xs text-slate-500">Spend</p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </div>

                        {vendor.status === 'active' && (
                          <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Delivery Score</p>
                              <Progress value={vendor.on_time_delivery} className="h-2" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Quality Score</p>
                              <Progress value={vendor.quality_score} className="h-2" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Price Score</p>
                              <Progress value={85} className="h-2" />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rfqs">
                <Card>
                  <CardHeader>
                    <CardTitle>Request for Quotations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>RFQ #</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Vendors Invited</TableHead>
                          <TableHead>Quotes Received</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Est. Value</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rfqs.map((rfq) => (
                          <TableRow key={rfq.id}>
                            <TableCell className="font-mono">{rfq.rfq_number}</TableCell>
                            <TableCell className="font-medium">{rfq.title}</TableCell>
                            <TableCell>{rfq.vendors}</TableCell>
                            <TableCell>
                              <span className={rfq.quotes === rfq.vendors ? 'text-green-600' : 'text-amber-600'}>
                                {rfq.quotes}/{rfq.vendors}
                              </span>
                            </TableCell>
                            <TableCell>{rfq.due_date}</TableCell>
                            <TableCell>${rfq.value.toLocaleString()}</TableCell>
                            <TableCell><Badge className={statusColors[rfq.status]}>{rfq.status}</Badge></TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">View Quotes</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quotes">
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Vendor Quotations</h3>
                    <p className="text-slate-500 mb-4">View and compare quotes from vendors for active RFQs</p>
                    <Button variant="outline">Select an RFQ to view quotes</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ratings">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sampleVendors.filter(v => v.rating > 0).map((vendor) => (
                    <Card key={vendor.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium">{vendor.company_name}</p>
                            <p className="text-sm text-slate-500">{vendor.total_orders} orders</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Overall</span>
                            {renderStars(vendor.rating)}
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-600">Delivery</span>
                              <span>{vendor.on_time_delivery}%</span>
                            </div>
                            <Progress value={vendor.on_time_delivery} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-600">Quality</span>
                              <span>{vendor.quality_score}%</span>
                            </div>
                            <Progress value={vendor.quality_score} className="h-1.5" />
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full mt-4">
                          <Star className="w-4 h-4 mr-2" />
                          Add Rating
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}