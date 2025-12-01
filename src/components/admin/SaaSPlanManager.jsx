import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Check, X, Zap, Building2, Rocket, Crown,
  Users, HardDrive, Brain, BarChart3, Calendar, Shield
} from 'lucide-react';

const plans = [
  {
    tier: 'basic',
    name: 'Basic',
    icon: Building2,
    color: 'from-slate-500 to-slate-600',
    price: 49,
    description: 'For small teams getting started',
    maxUsers: 5,
    maxStorage: 10,
    features: {
      'Core Modules': true,
      'Basic Dashboard': true,
      'Standard Calendar': true,
      'Email Support': true,
      'Multi-Calendar': false,
      'Advanced Reporting': false,
      'Automation': false,
      'AI Features': false,
      'Custom Branding': false,
      'API Access': false,
      'Audit Logs': false,
      'Priority Support': false
    }
  },
  {
    tier: 'professional',
    name: 'Professional',
    icon: Rocket,
    color: 'from-blue-500 to-blue-600',
    price: 149,
    description: 'For growing businesses',
    maxUsers: 25,
    maxStorage: 100,
    popular: true,
    features: {
      'Core Modules': true,
      'Basic Dashboard': true,
      'Standard Calendar': true,
      'Email Support': true,
      'Multi-Calendar': true,
      'Advanced Reporting': true,
      'Automation': true,
      'AI Features': false,
      'Custom Branding': true,
      'API Access': true,
      'Audit Logs': false,
      'Priority Support': true
    }
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    icon: Crown,
    color: 'from-purple-500 to-purple-600',
    price: 399,
    description: 'For large organizations',
    maxUsers: -1,
    maxStorage: -1,
    features: {
      'Core Modules': true,
      'Basic Dashboard': true,
      'Standard Calendar': true,
      'Email Support': true,
      'Multi-Calendar': true,
      'Advanced Reporting': true,
      'Automation': true,
      'AI Features': true,
      'Custom Branding': true,
      'API Access': true,
      'Audit Logs': true,
      'Priority Support': true
    }
  }
];

export default function SaaSPlanManager({ currentPlan, onUpgrade, onDowngrade }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.tier;
          
          return (
            <Card 
              key={plan.tier} 
              className={`relative overflow-hidden ${isCurrent ? 'ring-2 ring-lime-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-0 left-0 bg-lime-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                  CURRENT
                </div>
              )}
              
              <CardHeader className={`bg-gradient-to-r ${plan.color} text-white`}>
                <div className="flex items-center gap-3">
                  <Icon className="w-8 h-8" />
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-white/80 text-sm">{plan.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-white/80">/month</span>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>{plan.maxUsers === -1 ? 'Unlimited' : plan.maxUsers} Users</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <HardDrive className="w-4 h-4 text-slate-500" />
                    <span>{plan.maxStorage === -1 ? 'Unlimited' : `${plan.maxStorage}GB`} Storage</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(plan.features).map(([feature, included]) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      {included ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300" />
                      )}
                      <span className={included ? '' : 'text-slate-400'}>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  {isCurrent ? (
                    <Button className="w-full" disabled>Current Plan</Button>
                  ) : (
                    <Button 
                      className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}
                      onClick={() => {
                        const currentIdx = plans.findIndex(p => p.tier === currentPlan);
                        const targetIdx = plans.findIndex(p => p.tier === plan.tier);
                        if (targetIdx > currentIdx) {
                          onUpgrade && onUpgrade(plan.tier);
                        } else {
                          onDowngrade && onDowngrade(plan.tier);
                        }
                      }}
                    >
                      {plans.findIndex(p => p.tier === plan.tier) > plans.findIndex(p => p.tier === currentPlan) 
                        ? 'Upgrade' 
                        : 'Downgrade'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="font-medium">Feature</div>
            {plans.map(p => (
              <div key={p.tier} className="font-medium text-center">{p.name}</div>
            ))}
            
            {Object.keys(plans[0].features).map(feature => (
              <React.Fragment key={feature}>
                <div className="py-2 border-t">{feature}</div>
                {plans.map(p => (
                  <div key={p.tier} className="py-2 border-t text-center">
                    {p.features[feature] ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-slate-300 mx-auto" />
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}