import React from 'react';
import { Package } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import AppManagerDashboard from '@/components/installer/AppManagerDashboard';

export default function AppManager() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <PageHeader 
          title="App Manager" 
          subtitle="Manage installed apps, updates, and rollbacks"
          icon={Package}
          showBack={true}
          backTo="Dashboard"
        />
        <AppManagerDashboard />
      </div>
    </div>
  );
}