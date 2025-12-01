import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

export default function MetaverseGuide() {
  const handleDownload = () => {
    // Simulate download
    toast.success(
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-lime-500 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-slate-900" />
        </div>
        <div>
          <p className="font-semibold">Download Complete!</p>
          <p className="text-sm text-slate-500">Check your downloads folder</p>
        </div>
      </div>,
      { duration: 5000 }
    );
  };

  return (
    <section className="relative py-24 overflow-hidden bg-slate-900">
      {/* Background Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(132, 204, 22, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          className="rounded-3xl p-10 lg:p-16 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 100%)',
            border: '1px solid rgba(132, 204, 22, 0.3)',
            boxShadow: '0 0 60px rgba(132, 204, 22, 0.1)'
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Holographic Shine Animation */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)'
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Secondary Shine */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 30%, rgba(132,204,22,0.05) 50%, transparent 70%)'
            }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
            {/* Left - Icon */}
            <motion.div
              className="flex justify-center"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <motion.div
                className="w-48 h-48 rounded-3xl flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(132,204,22,0.2) 0%, rgba(6,182,212,0.2) 100%)',
                  border: '2px solid rgba(132, 204, 22, 0.4)',
                  boxShadow: '0 0 60px rgba(132, 204, 22, 0.3)'
                }}
              >
                {/* Orbiting Ring */}
                <motion.div
                  className="absolute inset-4 rounded-2xl"
                  style={{
                    border: '1px dashed rgba(139, 92, 246, 0.4)'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                
                <FileText className="w-20 h-20 text-lime-400" style={{ filter: 'drop-shadow(0 0 20px rgba(132, 204, 22, 0.5))' }} />

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-lime-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-violet-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-pink-400 rounded-br-lg" />
              </motion.div>
            </motion.div>

            {/* Right - Content */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Free Finance{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">
                  Automation Guide
                </span>
              </h2>

              <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                Download our comprehensive guide to automating your finance operations with AI. 
                Learn best practices from Singapore's leading companies.
              </p>

              <ul className="space-y-3 mb-8">
                {['Step-by-step automation roadmap', 'ROI calculation templates', 'Implementation checklist', 'Case studies from 50+ companies'].map((item, i) => (
                  <motion.li
                    key={item}
                    className="flex items-center gap-3 text-slate-300"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-lime-400 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="px-8 py-6 text-base font-semibold rounded-xl group"
                  style={{
                    background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
                    boxShadow: '0 0 40px rgba(132, 204, 22, 0.4)'
                  }}
                  onClick={handleDownload}
                >
                  <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  <span className="text-slate-900">Download PDF</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}