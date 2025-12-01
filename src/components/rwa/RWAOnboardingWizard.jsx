import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, ArrowRight, Sparkles, Building2, 
  Palette, Landmark, X, Briefcase, ChevronRight, Lightbulb
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';

export default function RWAOnboardingWizard({ open, onComplete }) {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState(null);

  const steps = [
    {
      title: "Welcome to ARKRWA",
      desc: "Let's set up your Real-World Asset environment.",
      content: (
        <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <Sparkles className="w-10 h-10 text-white" />
            </div>
            <p className="text-slate-400">
                Our AI-driven platform helps you tokenize assets, manage compliance, and track performance on the blockchain.
            </p>
        </div>
      )
    },
    {
      title: "Select Your Asset Class",
      desc: "We'll customize your dashboard and compliance rules.",
      content: (
        <div className="grid grid-cols-2 gap-4 mt-4">
            {[
                { id: 'real_estate', label: 'Real Estate', icon: Building2, desc: 'Properties, REITs' },
                { id: 'art', label: 'Fine Art', icon: Palette, desc: 'Paintings, Sculptures' },
                { id: 'finance', label: 'Finance', icon: Landmark, desc: 'Bonds, Loans, Invoices' },
                { id: 'commodities', label: 'Commodities', icon: Briefcase, desc: 'Gold, Carbon Credits' },
            ].map((item) => (
                <button 
                    key={item.id}
                    onClick={() => setIndustry(item.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                        industry === item.id 
                        ? 'bg-emerald-500/20 border-emerald-500 ring-1 ring-emerald-500' 
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                >
                    <item.icon className={`w-6 h-6 mb-2 ${industry === item.id ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <div className="font-semibold text-white text-sm">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                </button>
            ))}
        </div>
      )
    },
    {
        title: "AI Configuration",
        desc: "Analyzing industry standards and regulatory requirements...",
        content: (
            <div className="space-y-6 mt-4">
                {industry && (
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-amber-400 mt-1" />
                            <div>
                                <h4 className="text-amber-400 font-medium text-sm mb-1">AI Suggestion</h4>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    Based on your selection of <strong className="text-white capitalize">{industry.replace('_', ' ')}</strong>, 
                                    we recommend enabling the following modules:
                                </p>
                                <ul className="mt-2 space-y-1">
                                    <li className="text-slate-400 text-xs flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Valuation Model v4 (Market Comps)
                                    </li>
                                    <li className="text-slate-400 text-xs flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {industry === 'finance' ? 'Accredited Investor KYC' : 'AML/CFT Checks'}
                                    </li>
                                    <li className="text-slate-400 text-xs flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Quarterly Compliance Reports
                                    </li>
                                    <li className="text-slate-400 text-xs flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Smart Contract Templates for {industry === 'real_estate' ? 'Deeds' : industry === 'finance' ? 'Loan Agreements' : 'Asset Transfer'}
                                    </li>
                                </ul>
                                <div className="mt-3 pt-3 border-t border-slate-700/50">
                                    <p className="text-xs text-slate-500 mb-2">Recommended Initial Config:</p>
                                    <div className="flex gap-2">
                                        <div className="bg-slate-900 px-2 py-1 rounded border border-slate-700 text-[10px] text-slate-300">
                                            Risk Tolerance: {industry === 'crypto' ? 'High' : 'Conservative'}
                                        </div>
                                        <div className="bg-slate-900 px-2 py-1 rounded border border-slate-700 text-[10px] text-slate-300">
                                            Liquidity: {industry === 'real_estate' ? 'Locked' : 'Liquid'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Configuring RWA Engine...</span>
                        <span>100%</span>
                    </div>
                    <Progress value={100} className="h-1.5 bg-slate-800" />
                </div>
            </div>
        )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
        setStep(step + 1);
    } else {
        toast.success("Setup Complete! Starting guided tour...");
        onComplete(industry);
    }
  };

  return (
    <Dialog open={open}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md sm:max-w-lg [&>button]:hidden">
            <div className="absolute top-4 right-4">
                {/* No close button to force onboarding, or add one if needed */}
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Step {step + 1} of {steps.length}</span>
                    <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
                </div>
                <Progress value={((step + 1) / steps.length) * 100} className="h-1 bg-slate-800" />
            </div>

            <div className="min-h-[300px] flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1"
                    >
                        <h2 className="text-2xl font-bold text-white mb-2">{steps[step].title}</h2>
                        <p className="text-slate-400 text-sm mb-6">{steps[step].desc}</p>
                        {steps[step].content}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex justify-end pt-4 border-t border-slate-800">
                    <Button 
                        onClick={handleNext} 
                        className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[120px]"
                        disabled={step === 1 && !industry}
                    >
                        {step === steps.length - 1 ? 'Get Started' : 'Next'}
                        {step < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  );
}