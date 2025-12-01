import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/shared/PageHeader';
import ClientList from '@/components/clients/ClientList';
import { Users } from 'lucide-react';

export default function Clients() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-[1400px] mx-auto space-y-6"
          >
            <PageHeader
              title="Clients"
              subtitle="Manage your client relationships and track engagement"
              icon={Users}
              iconColor="text-blue-600"
            />
            
            <ClientList />
          </motion.div>
        </main>
      </div>
    </div>
  );
}