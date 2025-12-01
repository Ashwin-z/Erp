import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, Upload, CheckCircle2, ArrowRight, 
  CreditCard, Wallet, ShieldCheck 
} from 'lucide-react';

export default function SMEOnboarding() {
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, title: 'Company Info' },
    { id: 2, title: 'Asset Type' },
    { id: 3, title: 'Membership' },
    { id: 4, title: 'Verification' },
  ];

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white flex justify-center">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Partner Onboarding</h1>
          <p className="text-slate-400">Join the RWA Revenue Network in 4 steps</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between mb-8 px-12 relative">
           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10" />
           {steps.map((s) => (
             <div key={s.id} className="flex flex-col items-center bg-slate-950 px-2">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 transition-colors
                 ${step >= s.id ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-500'}
               `}>
                 {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
               </div>
               <span className={`text-xs font-medium ${step >= s.id ? 'text-orange-400' : 'text-slate-600'}`}>
                 {s.title}
               </span>
             </div>
           ))}
        </div>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>{steps[step-1].title}</CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your business entity."}
              {step === 2 && "What kind of assets are you listing?"}
              {step === 3 && "Choose your growth package."}
              {step === 4 && "Final compliance checks."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Company Name</label>
                    <Input className="bg-slate-950 border-slate-800" placeholder="e.g. Acme Real Estate" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Registration Number (UEN)</label>
                    <Input className="bg-slate-950 border-slate-800" placeholder="202312345X" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Business Address</label>
                  <Input className="bg-slate-950 border-slate-800" />
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-dashed border-slate-700 text-center cursor-pointer hover:bg-slate-800 transition-colors">
                  <Upload className="w-6 h-6 mx-auto text-slate-500 mb-2" />
                  <p className="text-sm text-slate-400">Upload ACRA BizProfile (PDF)</p>
                  <p className="text-xs text-slate-600 mt-1">AI will auto-extract details</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {['Real Estate', 'Luxury Vehicles', 'Fine Art', 'Equipment', 'Commodities', 'Digital Assets'].map(type => (
                  <div key={type} className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg hover:border-orange-500/50 cursor-pointer transition-all text-center">
                    <Building2 className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { name: 'Starter', price: '$29/mo', feats: ['1 Asset Listing', 'Basic AI Ads'] },
                  { name: 'Growth', price: '$249/mo', feats: ['10 Asset Listings', 'Crowdfunding Access', 'Priority AI Support'], active: true },
                  { name: 'Enterprise', price: '$1,499/mo', feats: ['Unlimited', 'Dedicated Agent', 'Legal Included'] },
                ].map(tier => (
                  <div key={tier.name} className={`p-4 rounded-xl border transition-all relative
                    ${tier.active ? 'bg-orange-900/20 border-orange-500' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}
                  `}>
                    {tier.active && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500">Recommended</Badge>}
                    <h3 className="font-bold text-lg text-center">{tier.name}</h3>
                    <p className="text-center text-2xl font-bold my-2">{tier.price}</p>
                    <ul className="text-xs text-slate-400 space-y-2 mb-4">
                      {tier.feats.map(f => <li key={f} className="flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> {f}</li>)}
                    </ul>
                    <Button className={`w-full ${tier.active ? 'bg-orange-600' : 'bg-slate-800'}`}>Select</Button>
                  </div>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <ShieldCheck className="w-16 h-16 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">KYC Verification Required</h3>
                  <p className="text-slate-400 text-sm mt-2">We need to verify your identity to enable payouts.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 w-full max-w-sm">
                  Launch Identity Verification
                </Button>
                <p className="text-xs text-slate-500">Powered by SumSub / Stripe Identity</p>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-slate-800">
              <Button variant="ghost" disabled={step===1} onClick={() => setStep(step-1)}>Back</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setStep(step < 4 ? step+1 : step)}>
                {step === 4 ? 'Finish' : 'Next Step'} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}