import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const navItems = [
  { label: 'Features', href: 'Features' },
  { label: 'Pricing', href: 'Landing', hash: '#pricing' },
  { label: 'Agencies', href: 'Agencies' },
  { label: 'Resources', href: 'Resources' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 py-3' 
            : 'bg-transparent py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Landing')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-white">ARKFinex</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                if (item.hash) {
                   return (
                     <a
                        key={item.label}
                        href={`${createPageUrl(item.href)}${item.hash}`}
                        className="text-sm font-medium transition-colors text-slate-300 hover:text-lime-400"
                     >
                        {item.label}
                     </a>
                   );
                }
                return (
                  <Link
                    key={item.label}
                    to={createPageUrl(item.href)}
                    className="text-sm font-medium transition-colors text-slate-300 hover:text-lime-400"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to={createPageUrl('Dashboard')}>
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>
              <Link to={createPageUrl('Dashboard')}>
                <Button className="bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold px-5">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-900 pt-24 px-6 lg:hidden"
          >
            <div className="space-y-6">
              {navItems.map((item) => {
                if (item.hash) {
                   return (
                     <a
                        key={item.label}
                        href={`${createPageUrl(item.href)}${item.hash}`}
                        onClick={() => setMobileOpen(false)}
                        className="block text-xl text-white font-medium hover:text-lime-400 transition-colors"
                     >
                        {item.label}
                     </a>
                   );
                }
                return (
                  <Link
                    key={item.label}
                    to={createPageUrl(item.href)}
                    onClick={() => setMobileOpen(false)}
                    className="block text-xl text-white font-medium hover:text-lime-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-6 border-t border-slate-800 space-y-4">
                <Link to={createPageUrl('Dashboard')} onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full border-slate-700 text-white">
                    Sign In
                  </Button>
                </Link>
                <Link to={createPageUrl('Dashboard')} onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-lime-500 hover:bg-lime-400 text-slate-900 font-semibold">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}