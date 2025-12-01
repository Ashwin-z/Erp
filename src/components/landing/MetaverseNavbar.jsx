import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import BookDemoModal from './BookDemoModal';

const navLinks = [
  { name: 'Features', href: 'Features' },
  { name: 'Pricing', section: '#pricing' },
  { name: 'Agencies', href: 'Agencies' },
  { name: 'Resources', href: 'Resources' }
];

export default function MetaverseNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
        style={{
          background: scrolled 
            ? 'rgba(15, 23, 42, 0.9)' 
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(132, 204, 22, 0.1)' : 'none'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to={createPageUrl('Landing')} className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
                boxShadow: '0 0 20px rgba(132, 204, 22, 0.4)'
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="text-slate-900 font-bold text-lg">A</span>
            </motion.div>
            <span className="text-xl font-bold text-white">ARKFinex</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href ? (
                <Link
                  key={link.name}
                  to={createPageUrl(link.href)}
                  className="text-slate-300 hover:text-lime-400 transition-colors text-sm font-medium"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.section}
                  className="text-slate-300 hover:text-lime-400 transition-colors text-sm font-medium"
                >
                  {link.name}
                </a>
              )
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                Sign In
              </Button>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                className="px-6 font-semibold rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
                  boxShadow: '0 0 20px rgba(132, 204, 22, 0.3)'
                }}
                onClick={() => setDemoOpen(true)}
              >
                <span className="text-slate-900">Start Free Trial</span>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 p-6"
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(132, 204, 22, 0.2)'
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-4">
              {navLinks.map((link) => (
                link.href ? (
                  <Link
                    key={link.name}
                    to={createPageUrl(link.href)}
                    className="block text-slate-300 hover:text-lime-400 transition-colors font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.section}
                    className="block text-slate-300 hover:text-lime-400 transition-colors font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              ))}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <Link to={createPageUrl('Dashboard')} className="block">
                  <Button variant="outline" className="w-full border-slate-700 text-white">
                    Sign In
                  </Button>
                </Link>
                <Button 
                  className="w-full font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)'
                  }}
                  onClick={() => { setMobileOpen(false); setDemoOpen(true); }}
                >
                  <span className="text-slate-900">Start Free Trial</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}