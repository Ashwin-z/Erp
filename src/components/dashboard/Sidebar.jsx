import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, FileText, Receipt, CreditCard, 
  Building2, Link2, TrendingUp, Users, Settings,
  HelpCircle, Sparkles, ChevronLeft, BookOpen, Smartphone,
  ChevronDown, ChevronRight, Coins, Blocks, Wallet, Gift, Shield, BarChart3, Car, Package, Files,
  BrainCircuit, Megaphone, HeartHandshake, Rocket, Globe, AlertCircle,
  Trophy, Activity, Bell, Radar
  } from 'lucide-react';
// Receipt icon for Invoices
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SupportModal from '@/components/support/SupportModal';
import useUserRole from '@/components/hooks/useUserRole';

const menuItems = [
  { section: 'Overview', items: [
    { icon: LayoutDashboard, label: 'Dashboard', href: 'Dashboard', description: 'Overview of all KPIs and AI insights' },
    { icon: Sparkles, label: 'AI Insights', href: 'AIInsights', badge: '5', description: 'AI recommendations and automation' }
  ]},
  { section: 'Finance', items: [
    { icon: BookOpen, label: 'Accounting & Finance', href: 'GeneralLedger', description: 'Global Accounting, GL & Reporting' },
    { icon: BrainCircuit, label: 'AI Reporting', href: 'AIReporting', description: 'AI-driven Financial Intelligence' },
    { icon: Radar, label: 'Predictive Analytics', href: 'PredictiveAnalytics', badge: 'NEW', description: 'Forecasting & Opportunities' },
    { icon: CreditCard, label: 'Payment Sim', href: 'PaymentSimulator', description: 'Test Gateway Transactions' },
    { icon: Link2, label: 'Bank Reconciliation', href: 'BankReconciliation', description: 'AI-powered transaction matching' },
    { icon: CreditCard, label: 'Wallet', href: 'WalletManagement', description: 'Multi-wallet and crypto' },
    { icon: TrendingUp, label: 'Cashflow Forecast', href: 'CashflowForecast', description: '90-day AI cashflow prediction' },
    { icon: TrendingUp, label: 'Budgets', href: 'BudgetPlanning', description: 'Budget planning and variance' },
    { icon: FileText, label: 'Contracts', href: 'ContractManagement', description: 'Contract lifecycle management' },
    { icon: Receipt, label: 'Assets', href: 'AssetManagement', description: 'Asset tracking and depreciation' },
    { icon: Building2, label: 'GST Reports', href: 'GSTReports', description: 'IRAS-compliant GST filing' }
  ]},
  { section: 'Advertising', items: [
    { icon: BarChart3, label: 'Ad Analytics', href: 'AdAnalyticsDashboard', description: 'Real-time performance metrics' },
    { icon: Megaphone, label: 'Ads Manager', href: 'AdsManager', description: 'Manage campaigns and inventory' },
    { icon: LayoutDashboard, label: 'Advertiser Portal', href: 'AdvertiserPortal', description: 'Vendor self-service portal' }
  ]},
  { section: 'Operations', items: [
    { icon: Car, label: 'High-Value Deal', href: 'HighValueDealFlow', badge: 'SIM', description: 'End-to-end deal simulator' },
    { icon: Users, label: 'CRM', href: 'CRM', description: 'Customer relationship management' },
    { icon: Users, label: 'Customers', href: 'Customers', description: 'Manage customer database' },
    { icon: TrendingUp, label: 'Sales Dashboard', href: 'SalesDashboard', description: 'Sales performance metrics' },
    { icon: FileText, label: 'Sales', href: 'Sales', description: 'Sales orders, quotations & invoices' },
    { icon: TrendingUp, label: 'Pipeline', href: 'Opportunities', description: 'Sales pipeline & opportunities' },
    { icon: Receipt, label: 'InvoiceNow', href: 'InvoiceNow', description: 'IMDA Peppol e-invoicing' },
    { icon: FileText, label: 'Projects', href: 'Projects', description: 'Manage client projects' },
    { icon: TrendingUp, label: 'Project Reports', href: 'ProjectReports', description: 'Project analytics & insights' },
    { icon: Receipt, label: 'Marketing', href: 'Marketing', description: 'Campaigns and promotions' },
    { icon: Building2, label: 'Vendors', href: 'VendorManagement', description: 'Vendor management and RFQs' },
    { icon: Receipt, label: 'Procurement', href: 'Procurement', description: 'Purchase orders' },
    { icon: Receipt, label: 'GRN', href: 'GRN', description: 'Goods receipt notes' },
    { icon: Building2, label: 'Inventory', href: 'Inventory', description: 'Stock and warehouse management' },
    { icon: FileText, label: 'Projects', href: 'ProjectHub', description: 'AI-powered project management' },
    { icon: CreditCard, label: 'POS', href: 'POS', description: 'Point of sale terminal' }
  ]},
  { section: 'RWA Engine', items: [
    { icon: Rocket, label: 'Revenue Engine', href: 'RWADashboard', description: 'AI Command Center' },
    { icon: Coins, label: 'RWA Dashboard', href: 'RWADashboard', description: 'RVU overview and rewards' },
    { icon: Globe, label: 'Crowdfunding', href: 'CrowdfundProject', description: 'Project Launchpad' },
    { icon: Megaphone, label: 'Ad Campaigns', href: 'AdCampaigns', description: 'Auto-Marketing' },
    { icon: Users, label: 'Affiliate Center', href: 'AffiliateCenter', description: 'Partner Management' },
    { icon: Blocks, label: 'Blockchain', href: 'RWABlockchain', description: 'Permissioned audit ledger' },
    { icon: Wallet, label: 'Multi-Wallet', href: 'RWAWallets', description: 'Wallet management' },
    { icon: Users, label: 'Memberships', href: 'RWAMembership', description: 'Member tiers & KYC' },
    { icon: Gift, label: 'Distribution', href: 'RWADistribution', description: 'Reward distribution engine' },
    { icon: Settings, label: 'RVU Weights', href: 'RWAWeights', description: 'Configure activity rates' },
    { icon: Settings, label: 'RWA Settings', href: 'RWASettings', description: 'Payout & transaction rules' },
    { icon: Shield, label: 'AI Modules', href: 'RWAAIModules', description: 'Fraud detection & scoring' },
    { icon: BarChart3, label: 'AI Performance', href: 'AIPerformanceDashboard', badge: 'NEW', description: 'Consolidated AI metrics' },
    { icon: Shield, label: 'RWA Shield', href: 'RWAShield', badge: 'NEW', description: 'Investor protection' },
    { icon: Link2, label: 'Partners', href: 'RWAPartnerIntegrations', description: 'PSP & bank integrations' },
    { icon: FileText, label: 'Reports', href: 'RWAReports', description: 'Automated reporting' },
    { icon: TrendingUp, label: 'Investor Portal', href: 'InvestorDashboard', description: 'Portfolio & opportunities' },
    { icon: Coins, label: 'Tokenisation', href: 'RWATokenisation', description: 'Mint RWA tokens' }
  ]},
  { section: 'Compliance', items: [
    { icon: Link2, label: 'Gov Integration', href: 'GovIntegration', badge: 'NEW', description: 'IRAS, CPF, ACRA APIs' },
    { icon: Link2, label: 'Blockchain Audit', href: 'BlockchainAudit', description: 'Immutable transaction anchoring' },
    { icon: Sparkles, label: 'ESG', href: 'ESGDashboard', description: 'Sustainability tracking' },
    { icon: Users, label: 'PDPA', href: 'PDPACompliance', description: 'Data protection compliance' },
    { icon: AlertCircle, label: 'AI Governance', href: 'AIPerformanceDashboard', description: 'Model Ethics & Drift' },
    { icon: Activity, label: 'Auto-Fix Monitor', href: 'SystemHealth', description: 'Self-healing Infra' },
    { icon: FileText, label: 'Audit Logs', href: 'AuditLogs', description: 'System Traceability' },
    { icon: Settings, label: 'Cybersecurity', href: 'Cybersecurity', description: 'Security monitoring and controls' }
  ]},
  { section: 'Human Resource', items: [
    { icon: Users, label: 'HR Management', href: 'HRManagement', description: 'Employee management' },
    { icon: Wallet, label: 'Payroll', href: 'Payroll', description: 'Payslips & Salary Processing' },
    { icon: TrendingUp, label: 'My KPI', href: 'HRKPIDashboard', description: 'AI-powered performance tracking' },
    { icon: TrendingUp, label: 'KPI Admin', href: 'KPIAdminDashboard', badge: 'CEO', description: 'AI reward approvals (CEO only)' }
  ]},
  { section: 'AI Marketing', items: [
    { icon: BrainCircuit, label: 'AI-CMO', href: 'MarketingDashboard', description: 'Marketing Command Center' },
    { icon: Users, label: 'Customer 360', href: 'CustomerProfile360', description: 'LTV & Segmentation' },
    { icon: Megaphone, label: 'Campaigns', href: 'CampaignBuilder', description: 'AI Campaign Generator' },
    { icon: Gift, label: 'Gifts & Loyalty', href: 'GiftManager', description: 'Surprise & Delight Engine' },
    { icon: HeartHandshake, label: 'CSR Portal', href: 'CSRPortal', description: 'Corporate Social Responsibility' },
  ]},
  { section: 'Tools', items: [
    { icon: FileText, label: 'Documents', href: 'Documents', description: 'File management with cloud storage' },
    { icon: Files, label: 'Smart DMS', href: 'SmartDMS', badge: 'AI', description: 'OCR scanning and file management' },
    { icon: LayoutDashboard, label: 'ARKSchedule', href: 'ARKSchedule', description: 'AI-powered calendar system' },
    { icon: Sparkles, label: 'Workflows', href: 'WorkflowAutomation', description: 'Advanced automation engine' },
    { icon: Trophy, label: 'Rewards & KPI', href: 'Gamification', description: 'Loyalty & Gamification' },
    { icon: HelpCircle, label: 'Service Desk', href: 'ServiceDesk', description: 'IT service management' },
    { icon: Building2, label: 'Web Builder', href: 'WebBuilder', description: 'Drag-and-drop page builder' },
    { icon: Users, label: 'Affiliates', href: 'Affiliate', description: '3-tier affiliate program' }
  ]},
  { section: 'Manage', items: [
    { icon: Users, label: 'Clients', href: 'Clients', description: 'Manage client relationships' },
    { icon: FileText, label: 'Blog', href: 'Blog', description: 'Manage blog posts and articles' },
    { icon: Settings, label: 'Settings', href: 'Settings', description: 'System configuration' },
    { icon: Bell, label: 'Notifications', href: 'NotificationSettings', badge: 'NEW', description: 'Alert configuration' },
    { icon: Settings, label: 'Super Admin', href: 'SuperAdmin', description: 'System administration' },
    { icon: Users, label: 'User Access', href: 'UserManagement', description: 'User roles & CRUD permissions' },
    { icon: Settings, label: 'App Installer', href: 'AppInstaller', badge: 'SYS', description: 'System installation & updates' },
    { icon: Package, label: 'App Manager', href: 'AppManager', description: 'Manage installed apps and updates' },
  ]},
  { section: 'Account', items: [
    { icon: Users, label: 'My Dashboard', href: 'DynamicDashboard', description: 'Your personal dashboard' },
    { icon: Sparkles, label: 'Quantum Credits', href: 'QuantumCredits', badge: 'NEW', description: 'Loyalty rewards program' },
    { icon: Smartphone, label: 'Mobile App', href: 'MobileApp', description: 'iOS & Android companion app' }
  ]}
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [supportOpen, setSupportOpen] = useState(false);
  const { role, loading } = useUserRole();
  
  // Initialize all sections as expanded
  const [expandedSections, setExpandedSections] = useState(() => {
    const initial = {};
    menuItems.forEach(section => {
      initial[section.section] = true;
    });
    return initial;
  });

  // Filter menu items based on role
  const filteredMenuItems = menuItems.map(section => {
    // Platform Admin sees everything
    if (role === 'Platform Admin') return section;

    // Filter items
    const allowedItems = section.items.filter(item => {
      // Role-specific visibility logic
      if (role === 'Advertiser') {
        // Advertisers only see specific modules
        const allowed = ['Ads Manager', 'Advertiser Portal', 'Ad Campaigns', 'Ad Analytics', 'Dashboard', 'Settings', 'Support'];
        return allowed.includes(item.label) || item.href === 'AdAnalyticsDashboard'; 
      }
      if (role === 'Agency Admin' || role === 'Agency Member') {
        // Agencies see more but maybe not Super Admin stuff
        const restricted = ['Super Admin', 'App Installer', 'App Manager'];
        return !restricted.includes(item.label);
      }
      return true;
    });

    return { ...section, items: allowedItems };
  }).filter(section => section.items.length > 0); // Remove empty sections

  const isActive = (href) => {
    return currentPath.toLowerCase().includes(href.toLowerCase());
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const expandAll = () => {
    const all = {};
    menuItems.forEach(section => {
      all[section.section] = true;
    });
    setExpandedSections(all);
  };

  const collapseAll = () => {
    const all = {};
    menuItems.forEach(section => {
      all[section.section] = false;
    });
    setExpandedSections(all);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside 
        className={cn(
          "bg-slate-900 h-screen flex flex-col transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
        initial={false}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <Link to={createPageUrl('Landing')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <span className="text-slate-900 font-bold text-lg">A</span>
            </div>
            {!collapsed && <span className="text-white font-bold text-lg">ARKFinex</span>}
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {/* Expand/Collapse All Buttons */}
          {!collapsed && (
            <div className="px-4 mb-3 flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={expandAll}
              >
                Expand All
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={collapseAll}
              >
                Collapse All
              </Button>
            </div>
          )}

          {filteredMenuItems.map((section, sectionIdx) => (
            <div key={section.section} className={cn("mb-2", sectionIdx > 0 && "mt-2")}>
              {!collapsed && (
                <button
                  onClick={() => toggleSection(section.section)}
                  className="w-full px-4 py-1.5 flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
                >
                  <span>{section.section}</span>
                  {expandedSections[section.section] ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              )}
              <AnimatePresence initial={false}>
                {(collapsed || expandedSections[section.section]) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 px-3">
                      {section.items.map((item) => {
                        const active = isActive(item.href);
                        const linkContent = (
                          <Link
                            to={createPageUrl(item.href)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                              active 
                                ? "bg-lime-500/10 text-lime-400" 
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                          >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", active && "text-lime-400")} />
                            {!collapsed && (
                              <>
                                <span className="flex-1 text-sm font-medium">{item.label}</span>
                                {item.badge && (
                                  <span className="bg-lime-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </>
                            )}
                          </Link>
                        );

                        if (collapsed) {
                          return (
                            <Tooltip key={item.label}>
                              <TooltipTrigger asChild>
                                {linkContent}
                              </TooltipTrigger>
                              <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                                <div>
                                  <p className="font-medium">{item.label}</p>
                                  <p className="text-xs text-slate-400">{item.description}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        }

                        return (
                          <Tooltip key={item.label}>
                            <TooltipTrigger asChild>
                              {linkContent}
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                              <p className="text-xs">{item.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Help */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-lime-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Need Help?</p>
                  <p className="text-slate-400 text-xs">24/7 Support</p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                onClick={() => setSupportOpen(true)}
              >
                Contact Support
              </Button>
            </div>
          </div>
        )}
        
        <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      </motion.aside>
    </TooltipProvider>
  );
}