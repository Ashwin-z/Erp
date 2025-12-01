import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export default function RWATourGuide({ active, onFinish }) {
    const [step, setStep] = useState(0);
    const [position, setPosition] = useState({ top: '20%', left: '50%' });

    const steps = [
        {
            target: 'body', // Global intro
            title: "Dashboard Overview",
            content: "This is your RWA Command Center. Track assets, rewards, and blockchain activity in real-time.",
            pos: { top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }
        },
        {
            target: '[href*="RWABlockchain"]',
            title: "Blockchain Explorer",
            content: "Audit every transaction on the public ledger. Click here to verify asset immutability.",
            pos: { top: '150px', left: '260px' } // Approximate position based on sidebar/header layout
        },
        {
            target: '[href*="RWAWallets"]',
            title: "Wallet Management",
            content: "Manage your multi-chain wallets and view your token balances securely.",
            pos: { top: '150px', left: '450px' }
        },
        {
            target: '[href*="RWATokenisation"]',
            title: "RWA Engine",
            content: "Access the core tokenisation engine to mint assets, manage lifecycle events, and view AI compliance reports.",
            pos: { top: '350px', left: '260px' }
        },
        {
            target: '.bg-gradient-to-br.from-slate-800', // Stats cards
            title: "Performance Metrics",
            content: "View your total RVUs, reward pool status, and personal earnings at a glance.",
            pos: { top: '300px', left: '50%', transform: 'translateX(-50%)' }
        }
    ];

    // Skip if not active
    if (!active) return null;

    const currentStep = steps[step];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onFinish();
        }
    };

    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
    };

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Backdrop with hole - simplified for this implementation (just semi-transparent) */}
            {/* In a real implementation, we'd use a proper spotlight library like react-joyride */}
            <div className="absolute inset-0 bg-black/60 pointer-events-auto" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{ 
                        position: 'absolute', 
                        ...currentStep.pos,
                        maxWidth: '350px'
                    }}
                    className="bg-slate-900 border border-emerald-500/50 shadow-2xl shadow-emerald-900/20 rounded-xl p-5 pointer-events-auto"
                >
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-emerald-400 font-bold text-lg">{currentStep.title}</h3>
                        <button onClick={onFinish} className="text-slate-500 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                        {currentStep.content}
                    </p>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                            {steps.map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {step > 0 && (
                                <Button size="sm" variant="ghost" onClick={handlePrev} className="text-slate-400 hover:text-white">
                                    Back
                                </Button>
                            )}
                            <Button size="sm" onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                {step === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}