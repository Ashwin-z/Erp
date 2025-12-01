import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function AdZone({ zoneCode, size = "auto", rotate = false, rotationInterval = 5000, className = "" }) {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    loadAds();
  }, [zoneCode]);

  useEffect(() => {
    let interval;
    if (rotate && ads.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, rotationInterval);
    }
    return () => clearInterval(interval);
  }, [rotate, ads, rotationInterval]);

  const loadAds = async () => {
    try {
        // Simulate fetching multiple creatives for rotation
        const creatives = await base44.entities.AdCreative.list();
        
        if (creatives.length > 0) {
            // If rotating, use all/multiple; if fixed, pick one.
            // For this demo, we'll use up to 3 creatives if rotating, or 1 if fixed.
            let selectedAds = [];
            if (rotate) {
                selectedAds = creatives.slice(0, 3);
                // Ensure we have enough for rotation, or duplicate/fallback
                if (selectedAds.length < 2) {
                     selectedAds.push({
                        type: 'Image',
                        asset_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop',
                        headline: 'Advertise Here',
                        body_text: 'Reach your audience efficiently.',
                        destination_url: '/AdvertiserPortal',
                        cta_text: 'Start Now'
                    });
                }
            } else {
                 selectedAds = [creatives[Math.floor(Math.random() * creatives.length)]];
            }
            setAds(selectedAds);
        } else {
            // Fallback/House Ad
            setAds([{
                type: 'Image',
                asset_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop',
                headline: 'Advertise Here',
                body_text: 'Reach your audience efficiently.',
                destination_url: '/AdvertiserPortal',
                cta_text: 'Start Now'
            }]);
        }
    } catch (e) {
        console.error("Ad Load Error", e);
        setAds([{
             type: 'Image',
             asset_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop',
             headline: 'Advertise Here',
             body_text: 'Reach your audience efficiently.',
             destination_url: '/AdvertiserPortal',
             cta_text: 'Start Now'
         }]);
    } finally {
        setLoading(false);
    }
  };

  const ad = ads[currentIndex];

  const handleAdClick = () => {
     // Log Click
     // base44.entities.AdAnalytics.create({ ... })
     if (ad?.destination_url) {
         window.location.href = ad.destination_url;
     }
  };

  if (!isVisible || loading) return null; // Or skeleton

  // Render different layouts based on size prop
  if (size === 'Native') {
      return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`p-4 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center gap-4 group cursor-pointer hover:shadow-md transition-all ${className}`}
            onClick={handleAdClick}
        >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                <img src={ad.asset_url} alt="Ad" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-white text-center py-0.5">AD</span>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">{ad.headline}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{ad.body_text}</p>
            </div>
            <button className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full group-hover:bg-blue-100 transition-colors">
                {ad.cta_text}
            </button>
        </motion.div>
      );
  }

  if (size === 'Sidebar') {
      return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={`relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm group cursor-pointer ${className}`}
            onClick={handleAdClick}
        >
            <div className="absolute top-2 right-2 z-10 bg-black/30 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm">Sponsored</div>
            <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                <img src={ad.asset_url} alt="Ad" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
                <h4 className="font-bold text-slate-900 mb-1">{ad.headline}</h4>
                <p className="text-sm text-slate-500 mb-3">{ad.body_text}</p>
                <button className="w-full py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                    {ad.cta_text}
                </button>
            </div>
        </motion.div>
      );
  }

  // Default Banner
  return (
    <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className={`relative w-full h-auto overflow-hidden rounded-xl bg-slate-900 text-white shadow-lg cursor-pointer group ${className}`}
        onClick={handleAdClick}
    >
        <div className="absolute inset-0">
            <img src={ad.asset_url} alt="Ad" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-transparent" />
        </div>
        <div className="absolute top-2 right-2 bg-white/10 backdrop-blur text-[9px] px-1.5 py-0.5 rounded text-white/80">Ad</div>
        <div className="relative z-10 p-6 flex flex-col justify-center h-full max-w-lg">
            <h3 className="text-xl font-bold mb-2">{ad.headline}</h3>
            <p className="text-slate-300 text-sm mb-4">{ad.body_text}</p>
            <div>
                <span className="inline-flex items-center text-xs font-bold text-slate-900 bg-white px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                    {ad.cta_text} →
                </span>
            </div>
        </div>
        <button 
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
            className="absolute top-2 right-2 p-1 text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <X className="w-4 h-4" />
        </button>
    </motion.div>
  );
}