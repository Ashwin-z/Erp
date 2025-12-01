import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Settings, Search, ChevronDown, Building2, 
  Plus, Download, Calendar, RefreshCw, Loader2, Smartphone,
  X, FileText, CreditCard, Users, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardHeader({ activeCompany, setActiveCompany, darkMode = false }) {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('2 mins ago');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Dec 2024');
  const [isExporting, setIsExporting] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSync = () => {
    setSyncing(true);
    toast.info("Syncing data with external banks...", {
      icon: <Loader2 className="w-4 h-4 animate-spin" />
    });
    setTimeout(() => {
      setSyncing(false);
      setLastSync('Just now');
      toast.success("Data synced successfully", {
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      });
    }, 2000);
  };

  const handleAddCompany = () => {
    toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
      loading: 'Initializing new workspace...',
      success: 'New company workspace created',
      error: 'Failed to create workspace'
    });
  };

  const handleExport = () => {
    setIsExporting(true);
    toast.loading("Generating financial report...");
    setTimeout(() => {
      setIsExporting(false);
      toast.dismiss();
      toast.success("Report downloaded successfully");
    }, 1500);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const companies = [
    { id: 1, name: "TechStart Pte Ltd" },
    { id: 2, name: "Marina Foods Pte Ltd" },
    { id: 3, name: "Urban Retail SG" },
    { id: 4, name: "Skyline Properties" },
    { id: 5, name: "Global Logistics SG" }
  ];

  const mockResults = [
    { type: 'Invoice', title: 'INV-2024-001', subtitle: 'Acme Corp • $5,000', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { type: 'Customer', title: 'TechStart Pte Ltd', subtitle: 'Enterprise Client • Active', icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { type: 'Transaction', title: 'Payment to AWS', subtitle: 'Oct 24 • $234.50', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { type: 'User', title: 'Sarah Chen', subtitle: 'CFO • Last active 2m ago', icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const bgColor = darkMode ? "bg-slate-900" : "bg-white";
  const borderColor = darkMode ? "border-slate-800" : "border-slate-200";
  const textColor = darkMode ? "text-white" : "text-slate-900";
  const subTextColor = darkMode ? "text-slate-400" : "text-slate-500";
  const iconColor = darkMode ? "text-slate-400" : "text-slate-600";
  
  return (
    <header className={`${bgColor} border-b ${borderColor} px-6 py-4 transition-all duration-200 z-40 relative`}>
      <div className="flex items-center justify-between gap-4">
        {/* Left - Company Selector & Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Select value={activeCompany} onValueChange={setActiveCompany}>
            <SelectTrigger className={`w-[220px] h-10 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'} transition-colors`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-1 rounded ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                  <Building2 className={`w-3.5 h-3.5 ${subTextColor}`} />
                </div>
                <SelectValue placeholder="Select company" />
              </div>
            </SelectTrigger>
            <SelectContent className={darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white"}>
              {companies.map(company => (
                <SelectItem 
                  key={company.id} 
                  value={company.id.toString()}
                  className="cursor-pointer"
                >
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-10 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'hover:bg-slate-50'}`}
              onClick={handleAddCompany}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-10 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'hover:bg-slate-50'} min-w-[140px]`}
              onClick={handleSync}
              disabled={syncing}
            >
              <motion.div 
                animate={syncing ? { rotate: 360 } : {}}
                transition={syncing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
                className="mr-2"
              >
                {syncing ? <Loader2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
              </motion.div>
              <span className="text-xs">{syncing ? 'Syncing...' : `Synced ${lastSync}`}</span>
            </Button>

            {/* Mobile button removed */}
          </div>
        </div>

        {/* Center - Enhanced Search */}
        <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4 relative z-50" ref={searchRef}>
          <motion.div 
            className={`relative w-full transition-all duration-200 ${searchFocused ? 'scale-105' : ''}`}
          >
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${searchFocused ? 'text-indigo-500' : subTextColor} transition-colors`} />
            <input 
              type="text"
              placeholder="Search transactions, invoices, customers... (⌘K)"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocused(true)}
              className={`
                w-full pl-10 pr-12 py-2.5 h-10 rounded-xl text-sm transition-all duration-200
                ${darkMode 
                  ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-900' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-indigo-500/10'
                }
                border focus:outline-none focus:border-indigo-500
              `}
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-slate-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
            {!searchQuery && (
              <kbd className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold ${darkMode ? 'text-slate-500 bg-slate-700' : 'text-slate-400 bg-slate-100'} px-2 py-1 rounded`}>
                ⌘K
              </kbd>
            )}

            {/* Search Dropdown Results */}
            <AnimatePresence>
              {showSearchResults && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-2xl overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
                >
                  <div className="p-2">
                    <div className="text-xs font-medium text-slate-500 px-3 py-2">Suggested Results</div>
                    {mockResults.map((result, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
                        onClick={() => {
                          toast.success(`Opened ${result.type}: ${result.title}`);
                          setShowSearchResults(false);
                        }}
                      >
                        <div className={`w-8 h-8 rounded-lg ${result.bg} flex items-center justify-center flex-shrink-0`}>
                          <result.icon className={`w-4 h-4 ${result.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${textColor}`}>{result.title}</div>
                          <div className={`text-xs truncate ${subTextColor}`}>{result.subtitle}</div>
                        </div>
                        <ArrowRight className={`w-4 h-4 ${subTextColor} opacity-0 group-hover:opacity-100`} />
                      </div>
                    ))}
                  </div>
                  <div className={`p-3 border-t text-center ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-50 bg-slate-50'}`}>
                    <button className="text-xs font-medium text-indigo-500 hover:text-indigo-600">
                      View all 24 results for "{searchQuery}"
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Date Range */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`hidden md:flex h-10 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'hover:bg-slate-50'}`}
              >
                <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                {selectedDate}
                <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedDate('Dec 2024')}>
                Dec 2024 (Current)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDate('Nov 2024')}>
                Nov 2024
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDate('Oct 2024')}>
                Oct 2024
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Custom Range...</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export button removed */}

          <div className="h-8 w-px bg-slate-200 mx-1" />

          {/* Notifications */}
          <NotificationCenter />

          {/* Settings */}
          <Link to={createPageUrl('Settings')}>
            <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-full ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
              <Settings className={`w-5 h-5 ${iconColor}`} />
            </Button>
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`h-10 flex items-center gap-2 pl-1 pr-3 rounded-full ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className={`text-sm font-semibold leading-none ${textColor}`}>Sarah Chen</p>
                  <p className={`text-[10px] font-medium ${subTextColor} mt-0.5`}>CFO • Admin</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 ${subTextColor}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`w-56 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : ''} />
              <Link to={createPageUrl('Settings')}>
                <DropdownMenuItem className={darkMode ? 'focus:bg-slate-700 focus:text-white' : ''}>Profile Settings</DropdownMenuItem>
              </Link>
              <DropdownMenuItem className={darkMode ? 'focus:bg-slate-700 focus:text-white' : ''}>Team Members</DropdownMenuItem>
              <DropdownMenuItem className={darkMode ? 'focus:bg-slate-700 focus:text-white' : ''}>Billing</DropdownMenuItem>
              <DropdownMenuSeparator className={darkMode ? 'bg-slate-700' : ''} />
              <DropdownMenuItem className="text-red-600 focus:bg-red-500/10">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}