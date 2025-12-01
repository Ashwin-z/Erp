import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KPICards from '@/components/dashboard/KPICards';
import AIAlerts from '@/components/dashboard/AIAlerts';
import ReconciliationWidget from '@/components/dashboard/ReconciliationWidget';
import CollectionsQueue from '@/components/dashboard/CollectionsQueue';
import RecentDocuments from '@/components/dashboard/RecentDocuments';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import GovComplianceWidget from '@/components/dashboard/widgets/GovComplianceWidget';
import ESGWidget from '@/components/dashboard/widgets/ESGWidget';
import ProjectHealthWidget from '@/components/dashboard/widgets/ProjectHealthWidget';
import ModuleStatusWidget from '@/components/dashboard/widgets/ModuleStatusWidget';
import RWAInsightsWidget from '@/components/dashboard/widgets/RWAInsightsWidget';
import AdZone from '@/components/ads/AdZone';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader 
          activeCompany={activeCompany} 
          setActiveCompany={setActiveCompany} 
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1800px] mx-auto space-y-6"
          >
            {/* Top Ad Banner Placement */}
            <AdZone zoneCode="DASH_TOP" size="Banner" rotate={true} rotationInterval={6000} className="mb-6 h-48" />

            {/* Page Title */}
            <div className="mb-2 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Command Center</h1>
                <p className="text-slate-500 text-sm">Unified view of Finance, Operations, Compliance & ESG</p>
              </div>
              <div className="text-sm text-emerald-600 font-medium flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                System Operational
              </div>
            </div>

            {/* KPI Cards */}
            <KPICards />

            {/* Native Ad Placement - In-between content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdZone zoneCode="DASH_MID_NATIVE_1" size="Native" />
                <AdZone zoneCode="DASH_MID_NATIVE_2" size="Native" />
            </div>

            {/* Quick Access - Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              {[
                { 
                  to: "/AdsManager", 
                  icon: "📢", 
                  title: "Ads Manager", 
                  desc: "Campaign Admin",
                  classes: {
                    hoverBorder: "hover:border-indigo-300",
                    hoverRing: "hover:ring-indigo-100",
                    splash: "bg-indigo-500/5 group-hover:bg-indigo-500/10",
                    iconBg: "bg-indigo-50 border-indigo-100 group-hover:bg-indigo-100",
                    arrow: "text-indigo-500"
                  }
                },
                { 
                  to: "/AdvertiserPortal", 
                  icon: "🏪", 
                  title: "Advertiser Portal", 
                  desc: "Vendor Self-Service",
                  classes: {
                    hoverBorder: "hover:border-orange-300",
                    hoverRing: "hover:ring-orange-100",
                    splash: "bg-orange-500/5 group-hover:bg-orange-500/10",
                    iconBg: "bg-orange-50 border-orange-100 group-hover:bg-orange-100",
                    arrow: "text-orange-500"
                  }
                },
                { 
                  to: "/WorkflowAutomation", 
                  icon: "⚡", 
                  title: "Workflow Engine", 
                  desc: "Visual Designer & Automation",
                  classes: {
                    hoverBorder: "hover:border-yellow-300",
                    hoverRing: "hover:ring-yellow-100",
                    splash: "bg-yellow-500/5 group-hover:bg-yellow-500/10",
                    iconBg: "bg-yellow-50 border-yellow-100 group-hover:bg-yellow-100",
                    arrow: "text-yellow-500"
                  }
                },
                { 
                  to: "/AIReporting", 
                  icon: "🧠", 
                  title: "AI Reporting", 
                  desc: "Financial Intelligence & P&L",
                  classes: {
                    hoverBorder: "hover:border-violet-300",
                    hoverRing: "hover:ring-violet-100",
                    splash: "bg-violet-500/5 group-hover:bg-violet-500/10",
                    iconBg: "bg-violet-50 border-violet-100 group-hover:bg-violet-100",
                    arrow: "text-violet-500"
                  }
                },
                { 
                  to: "/SystemHealth", 
                  icon: "🛡️", 
                  title: "Auto-Fix Monitor", 
                  desc: "Self-Healing Infrastructure",
                  classes: {
                    hoverBorder: "hover:border-emerald-300",
                    hoverRing: "hover:ring-emerald-100",
                    splash: "bg-emerald-500/5 group-hover:bg-emerald-500/10",
                    iconBg: "bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100",
                    arrow: "text-emerald-500"
                  }
                },
                { 
                  to: "/PaymentSimulator", 
                  icon: "💳", 
                  title: "Payment Sim", 
                  desc: "Test Gateway Transactions",
                  classes: {
                    hoverBorder: "hover:border-blue-300",
                    hoverRing: "hover:ring-blue-100",
                    splash: "bg-blue-500/5 group-hover:bg-blue-500/10",
                    iconBg: "bg-blue-50 border-blue-100 group-hover:bg-blue-100",
                    arrow: "text-blue-500"
                  }
                }
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={item.to} className="block h-full">
                    <div className={`
                      p-4 h-full bg-white rounded-xl shadow-sm border border-slate-200 
                      hover:shadow-xl hover:ring-2 transition-all flex items-center gap-4 group relative overflow-hidden
                      ${item.classes.hoverBorder} ${item.classes.hoverRing}
                    `}>
                      {/* Background Gradient Splash */}
                      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-all ${item.classes.splash}`} />
                      
                      <motion.div 
                        className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors z-10 ${item.classes.iconBg}`}
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      >
                        <span className="text-2xl filter drop-shadow-sm">{item.icon}</span>
                      </motion.div>
                      
                      <div className="z-10">
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-800">{item.title}</h3>
                        <p className="text-xs text-slate-500 group-hover:text-slate-600">{item.desc}</p>
                      </div>

                      <div className={`absolute right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all ${item.classes.arrow}`}>
                        →
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Module Status & Health Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GovComplianceWidget />
              <ESGWidget />
              <RWAInsightsWidget />
              <ModuleStatusWidget />
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - AI Alerts */}
              <div className="lg:col-span-2">
                <AIAlerts />
              </div>

              {/* Right Column - Reconciliation */}
              <div>
                <ReconciliationWidget />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Collections Queue */}
              <div>
                <CollectionsQueue />
              </div>

              {/* Recent Documents */}
              <div>
                <RecentDocuments />
              </div>

              {/* Activity Feed */}
              <div>
                <ActivityFeed />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}