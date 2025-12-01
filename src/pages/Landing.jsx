import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import MetaverseNavbar from '@/components/landing/MetaverseNavbar';
import MetaverseHero from '@/components/landing/MetaverseHero';
import MetaverseTeamSection from '@/components/landing/MetaverseTeamSection';
import MetaverseStats from '@/components/landing/MetaverseStats';
import MetaverseFeatures from '@/components/landing/MetaverseFeatures';
import MetaverseIntegrations from '@/components/landing/MetaverseIntegrations';
import MetaverseAgency from '@/components/landing/MetaverseAgency';
import MetaverseTrial from '@/components/landing/MetaverseTrial';
import MetaverseBlog from '@/components/landing/MetaverseBlog';
import MetaverseGuide from '@/components/landing/MetaverseGuide';
import MetaverseFooter from '@/components/landing/MetaverseFooter';
import PricingSection from '@/components/landing/PricingSection';

export default function Landing() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <MetaverseNavbar />
      <div id="hero-section">
        <MetaverseHero />
      </div>
      <MetaverseTeamSection />
      <MetaverseStats />
      <MetaverseFeatures />
      <MetaverseIntegrations />
      <MetaverseAgency />
      <PricingSection />
      <MetaverseTrial />
      <MetaverseBlog />
      <MetaverseGuide />
      <MetaverseFooter />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer group"
            style={{
              background: 'linear-gradient(135deg, rgba(132,204,22,0.9) 0%, rgba(6,182,212,0.9) 100%)',
              boxShadow: '0 0 30px rgba(132, 204, 22, 0.5)'
            }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: '0 0 50px rgba(132, 204, 22, 0.7)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronUp className="w-7 h-7 text-slate-900" />
            </motion.div>
            
            {/* Pulsing Ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '2px solid rgba(132, 204, 22, 0.5)' }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.8, 0, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}