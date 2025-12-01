import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

export default function MetaverseTrial() {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Welcome to ARKFinex! Check your email to get started.');
    setModalOpen(false);
    setSending(false);
    setEmail('');
    setName('');
  };

  return (
    <section className="relative py-24 overflow-hidden bg-slate-950">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(132,204,22,0.1) 0%, transparent 50%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? '#84cc16' : '#8b5cf6'
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          className="rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
            border: '2px solid rgba(132, 204, 22, 0.3)'
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          animate={{
            boxShadow: [
              '0 0 40px rgba(132,204,22,0.15)',
              '0 0 80px rgba(132,204,22,0.25)',
              '0 0 40px rgba(132,204,22,0.15)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Holographic Shine */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)'
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(132,204,22,0.2) 0%, rgba(139,92,246,0.2) 100%)',
              border: '1px solid rgba(132, 204, 22, 0.4)'
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(132,204,22,0.2)',
                '0 0 40px rgba(132,204,22,0.4)',
                '0 0 20px rgba(132,204,22,0.2)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-4 h-4 text-lime-400" />
            <span className="text-sm font-medium text-lime-400">Limited Time Offer</span>
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Start Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
              14-Day Free Trial
            </span>
          </h2>

          <p className="text-xl text-slate-400 mb-8 max-w-xl mx-auto">
            Experience the full power of AI-driven finance automation. No credit card required.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {['Full AI Suite Access', 'Unlimited Transactions', '24/7 Support'].map((feature, i) => (
              <motion.div 
                key={feature}
                className="flex items-center gap-2 text-slate-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-lime-400" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              className="px-12 py-7 text-lg font-semibold rounded-xl relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
                boxShadow: '0 0 40px rgba(132, 204, 22, 0.5)'
              }}
              onClick={() => setModalOpen(true)}
            >
              {/* Ripple Effect */}
              <motion.span
                className="absolute inset-0 bg-white/20 rounded-xl"
                initial={{ scale: 0, opacity: 0.5 }}
                whileHover={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10 text-slate-900 flex items-center gap-2">
                Activate Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Sign Up Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent 
          className="max-w-md"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)',
            border: '1px solid rgba(132, 204, 22, 0.3)',
            boxShadow: '0 0 60px rgba(132, 204, 22, 0.2)'
          }}
        >
          {/* Holographic Border Effect */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(132,204,22,0.1), rgba(139,92,246,0.1), rgba(6,182,212,0.1))',
              backgroundSize: '200% 200%'
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-lime-400" />
              Start Your Journey
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-lime-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Work Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-lime-500"
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={sending}
                className="w-full py-6 text-base font-semibold rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #84cc16 0%, #10b981 100%)',
                  boxShadow: '0 0 30px rgba(132, 204, 22, 0.4)'
                }}
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <motion.div 
                      className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Creating Account...
                  </span>
                ) : (
                  <span className="text-slate-900">Start Free Trial</span>
                )}
              </Button>
            </motion.div>

            <p className="text-center text-sm text-slate-500">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}