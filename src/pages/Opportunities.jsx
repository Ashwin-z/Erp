import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/shared/PageHeader';
import SalesPipeline from '@/components/pipeline/SalesPipeline';
import { Target } from 'lucide-react';

export default function Opportunities() {
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
            className="max-w-[1600px] mx-auto space-y-6"
          >
            <PageHeader
              title="Sales Pipeline"
              subtitle="Manage opportunities and track deals through stages"
              icon={Target}
              iconColor="text-violet-600"
            />
            
            <SalesPipeline />
          </motion.div>
        </main>
      </div>
    </div>
  );
}