import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ArrowRight, CheckCircle2, Circle, HelpCircle, ExternalLink } from 'lucide-react';

const stepPages = {
  'Quotation': 'SalesQuotation',
  'Sales Order': 'SalesOrder',
  'Delivery': 'SalesDelivery',
  'Invoice': 'SalesInvoice',
  'Payment': 'SalesPayment'
};

export default function SOPGuide({ title, description, steps }) {
  const [expanded, setExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Card className="mb-6 border-lime-200 bg-gradient-to-r from-lime-50 to-emerald-50">
      <CardContent className="p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-lime-500 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-lime-200">
                {/* Flow Diagram */}
                <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                  {steps.map((step, index) => {
                    const pageName = stepPages[step.name];
                    const StepContent = (
                      <div
                        onClick={() => setActiveStep(index)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all group ${
                          activeStep === index 
                            ? 'bg-lime-500 text-white' 
                            : 'bg-white text-slate-600 hover:bg-lime-100'
                        }`}
                      >
                        <span className="text-xs font-medium">{index + 1}</span>
                        <span className="text-sm font-medium">{step.name}</span>
                        {pageName && (
                          <ExternalLink className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${activeStep === index ? 'text-white' : 'text-lime-600'}`} />
                        )}
                      </div>
                    );
                    
                    return (
                      <React.Fragment key={index}>
                        {pageName ? (
                          <Link to={createPageUrl(pageName)} className="no-underline">
                            {StepContent}
                          </Link>
                        ) : StepContent}
                        {index < steps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Step Details */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">{steps[activeStep]?.name}</h4>
                    {stepPages[steps[activeStep]?.name] && (
                      <Link to={createPageUrl(stepPages[steps[activeStep]?.name])}>
                        <Button size="sm" className="bg-lime-500 hover:bg-lime-600">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open {steps[activeStep]?.name}
                        </Button>
                      </Link>
                    )}
                  </div>
                  <p className="text-slate-600 mb-4">{steps[activeStep]?.description}</p>
                  
                  {steps[activeStep]?.checklist && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700">Checklist:</p>
                      {steps[activeStep].checklist.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-lime-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}