import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/shared/PageHeader';
import CustomerFormModal from '@/components/customers/CustomerFormModal';
import CustomerDetailModal from '@/components/customers/CustomerDetailModal';
import CustomerCard from '@/components/customers/CustomerCard';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Users, Plus, Search, Grid3X3, List, Building2, UserCheck, UserX, Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function Customers() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list('-created_date')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Customer.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted');
      setDeleteConfirm(null);
    }
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    birthdaysThisMonth: customers.filter(c => {
      if (!c.birthday) return false;
      return moment(c.birthday).month() === moment().month();
    }).length
  };

  const openEdit = (customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingCustomer(null);
    setFormOpen(true);
  };

  const openView = (customer) => {
    setViewingCustomer(customer);
    setDetailOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1400px] mx-auto space-y-6">
            
            <PageHeader
              title="Customers"
              subtitle="Manage your customer relationships"
              icon={Users}
              iconColor="text-blue-600"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-slate-500">Total Customers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                      <p className="text-sm text-slate-500">Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <UserX className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-500">{stats.inactive}</p>
                      <p className="text-sm text-slate-500">Inactive</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-pink-600">{stats.birthdaysThisMonth}</p>
                      <p className="text-sm text-slate-500">Birthdays This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex border rounded-lg overflow-hidden">
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-slate-900' : ''}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-slate-900' : ''}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Customer
                </Button>
              </div>
            </div>

            {/* Customer Grid/List */}
            {isLoading ? (
              <div className="text-center py-12 text-slate-500">Loading customers...</div>
            ) : filteredCustomers.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="py-12 text-center">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No customers found</h3>
                  <p className="text-slate-500 mb-4">Add your first customer to get started</p>
                  <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />Add Customer
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onView={openView}
                    onEdit={openEdit}
                    onDelete={setDeleteConfirm}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingCustomer(null); }}
        customer={editingCustomer}
      />

      {/* Customer Detail Modal */}
      <CustomerDetailModal
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setViewingCustomer(null); }}
        customer={viewingCustomer}
        onEdit={openEdit}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteMutation.mutate(deleteConfirm.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}