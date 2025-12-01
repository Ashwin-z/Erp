import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight, Building2, Users, Rocket } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for SMEs & micro firms getting started',
    price: 29,
    icon: Rocket,
    features: [
      '1 company entity',
      'Up to 500 transactions/month',
      'Basic OCR (50 docs/month)',
      'Bank feed connection',
      'GST reports',
      'Email support',
      '5 user seats'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Professional',
    description: 'Recommended for growing businesses',
    price: 59,
    icon: Building2,
    features: [
      '3 company entities',
      'Unlimited transactions',
      'Advanced OCR (500 docs/month)',
      'AI reconciliation (95% auto)',
      'Cashflow forecasting (30 days)',
      'Collections AI',
      'Priority support',
      '15 user seats',
      'Custom reports'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For agencies & enterprise groups',
    price: 119,
    icon: Users,
    features: [
      'Unlimited entities',
      'Unlimited transactions',
      'Unlimited OCR',
      'Full AI suite',
      'Cashflow forecasting (90 days)',
      'White-label options',
      'Dedicated success manager',
      'Unlimited users',
      'API access',
      'SSO/SAML',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-lime-600 font-semibold text-sm tracking-wider uppercase mb-4 block">
            Pricing
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Start free for 14 days. No credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-slate-100 rounded-full p-1.5">
            <button 
              onClick={() => setAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !annual ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                annual ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              Annual
              <span className="text-xs bg-lime-100 text-lime-700 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-3xl ${
                plan.popular 
                  ? 'bg-slate-900 text-white ring-4 ring-lime-500/30' 
                  : 'bg-white border-2 border-slate-200'
              } p-8 lg:p-10`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-lime-500 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl ${
                  plan.popular ? 'bg-lime-500' : 'bg-slate-100'
                } flex items-center justify-center mb-4`}>
                  <plan.icon className={`w-6 h-6 ${
                    plan.popular ? 'text-slate-900' : 'text-slate-600'
                  }`} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  plan.popular ? 'text-white' : 'text-slate-900'
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${
                  plan.popular ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-bold ${
                    plan.popular ? 'text-white' : 'text-slate-900'
                  }`}>
                    ${annual ? Math.round(plan.price * 0.8) : plan.price}
                  </span>
                  <span className={plan.popular ? 'text-slate-400' : 'text-slate-500'}>
                    /month
                  </span>
                </div>
                {annual && (
                  <p className={`text-sm mt-1 ${
                    plan.popular ? 'text-lime-400' : 'text-lime-600'
                  }`}>
                    Billed annually (save 20%)
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full ${
                      plan.popular ? 'bg-lime-500' : 'bg-lime-100'
                    } flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Check className={`w-3 h-3 ${
                        plan.popular ? 'text-slate-900' : 'text-lime-600'
                      }`} />
                    </div>
                    <span className={`text-sm ${
                      plan.popular ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to={createPageUrl('Dashboard')}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className={`w-full py-6 text-base font-semibold rounded-xl group transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-lime-500 hover:bg-lime-400 text-slate-900 hover:shadow-lg hover:shadow-lime-500/30' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-lg'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 lg:p-14 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Need a custom solution?
          </h3>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            We work with accounting agencies and enterprises to build custom packages 
            that fit your exact needs.
          </p>
          <Link to={createPageUrl('Dashboard')}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-base rounded-xl hover:shadow-xl transition-all duration-300">
                Talk to Sales
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}