import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, ArrowRight, Info, RefreshCw } from 'lucide-react';

export default function PayoutSimulator({ transactionSettings, tierSettings, promotionSettings }) {
  const [transactionType, setTransactionType] = useState('invoice_paid');
  const [transactionAmount, setTransactionAmount] = useState(10000);
  const [memberTier, setMemberTier] = useState('growth');
  const [calculation, setCalculation] = useState(null);

  const transactionLabels = {
    invoice_paid: 'Invoice Paid',
    invoice_submission: 'Invoice Submission',
    ad_spend: 'Ad Spend',
    loan_disbursement: 'Loan Disbursement',
    payroll_processing: 'Payroll Processing',
    esg_report: 'ESG Report',
    funding_contribution: 'Funding Contribution'
  };

  useEffect(() => {
    calculatePayout();
  }, [transactionType, transactionAmount, memberTier, transactionSettings, tierSettings, promotionSettings]);

  const calculatePayout = () => {
    const txSettings = transactionSettings[transactionType];
    const tierMultiplier = tierSettings[memberTier]?.multiplier || 1;
    const tierPayoutPercent = tierSettings[memberTier]?.payoutPercent || 100;

    if (!txSettings || !txSettings.enabled) {
      setCalculation({ error: 'Transaction type not enabled' });
      return;
    }

    const steps = [];
    let currentAmount = transactionAmount;

    // Step 1: Check min/max amount
    if (txSettings.minAmount && currentAmount < txSettings.minAmount) {
      setCalculation({ error: `Amount below minimum (${txSettings.minAmount})` });
      return;
    }
    if (txSettings.maxAmount && currentAmount > txSettings.maxAmount) {
      currentAmount = txSettings.maxAmount;
      steps.push({
        label: 'Amount capped at max',
        formula: `min(${transactionAmount}, ${txSettings.maxAmount})`,
        result: currentAmount
      });
    }

    // Step 2: Calculate base RVU
    let baseRVU;
    if (txSettings.payoutType === 'fixed') {
      baseRVU = txSettings.fixedPayout;
      steps.push({
        label: 'Fixed RVU (ESG/Special)',
        formula: `Fixed payout = ${txSettings.fixedPayout}`,
        result: baseRVU
      });
    } else {
      baseRVU = currentAmount * txSettings.rvuPerDollar;
      steps.push({
        label: 'Base RVU Calculation',
        formula: `$${currentAmount.toLocaleString()} × ${txSettings.rvuPerDollar} RVU/$`,
        result: baseRVU
      });
    }

    // Step 3: Apply RVU cap per transaction
    let cappedRVU = baseRVU;
    if (txSettings.capPerTransaction && baseRVU > txSettings.capPerTransaction) {
      cappedRVU = txSettings.capPerTransaction;
      steps.push({
        label: 'RVU Cap Applied',
        formula: `min(${baseRVU.toLocaleString()}, ${txSettings.capPerTransaction.toLocaleString()})`,
        result: cappedRVU
      });
    }

    // Step 4: Apply tier multiplier
    const tierRVU = cappedRVU * tierMultiplier;
    steps.push({
      label: `Tier Multiplier (${memberTier})`,
      formula: `${cappedRVU.toLocaleString()} × ${tierMultiplier}x`,
      result: tierRVU
    });

    // Step 5: Check for promotion
    let promoBonus = 0;
    let finalRVU = tierRVU;
    if (promotionSettings.enabled && promotionSettings.applicableTypes.includes(transactionType)) {
      promoBonus = tierRVU * (promotionSettings.bonusMultiplier - 1);
      finalRVU = tierRVU * promotionSettings.bonusMultiplier;
      steps.push({
        label: `Promo Bonus (${promotionSettings.bonusMultiplier}x)`,
        formula: `${tierRVU.toLocaleString()} × ${promotionSettings.bonusMultiplier}`,
        result: finalRVU,
        highlight: true
      });
    }

    // Step 6: Calculate payout value (assuming $0.08 per RVU)
    const rvuValue = 0.08;
    const payoutPercent = (txSettings.payoutPercent / 100) * (tierPayoutPercent / 100);
    const estimatedPayout = finalRVU * rvuValue * payoutPercent;
    
    steps.push({
      label: 'Payout % Applied',
      formula: `${txSettings.payoutPercent}% (tx) × ${tierPayoutPercent}% (tier) = ${(payoutPercent * 100).toFixed(0)}%`,
      result: payoutPercent * 100,
      suffix: '%'
    });

    steps.push({
      label: 'Estimated SGD Payout',
      formula: `${finalRVU.toLocaleString()} RVU × $${rvuValue} × ${(payoutPercent * 100).toFixed(0)}%`,
      result: estimatedPayout,
      prefix: '$',
      final: true
    });

    setCalculation({
      steps,
      summary: {
        transactionAmount: currentAmount,
        baseRVU,
        cappedRVU,
        tierRVU,
        promoBonus,
        finalRVU,
        estimatedPayout
      }
    });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-lime-400" />
          Payout Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-400">Transaction Type</Label>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {Object.entries(transactionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-400">Transaction Amount ($)</Label>
            <Input
              type="number"
              className="bg-slate-800 border-slate-700"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-400">Member Tier</Label>
            <Select value={memberTier} onValueChange={setMemberTier}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="starter">Starter (1.0x)</SelectItem>
                <SelectItem value="growth">Growth (1.2x)</SelectItem>
                <SelectItem value="scale">Scale (1.5x)</SelectItem>
                <SelectItem value="enterprise">Enterprise (2.0x)</SelectItem>
                <SelectItem value="mnc">MNC (2.5x)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calculation Steps */}
        {calculation?.error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{calculation.error}</p>
          </div>
        ) : calculation?.steps ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Info className="w-4 h-4" />
              Calculation Breakdown
            </div>
            <div className="space-y-2">
              {calculation.steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    step.final ? 'bg-lime-500/10 border border-lime-500/30' :
                    step.highlight ? 'bg-amber-500/10 border border-amber-500/30' :
                    'bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-sm w-6">{idx + 1}.</span>
                    <div>
                      <p className={`text-sm font-medium ${step.final ? 'text-lime-400' : step.highlight ? 'text-amber-400' : 'text-white'}`}>
                        {step.label}
                      </p>
                      <p className="text-slate-500 text-xs font-mono">{step.formula}</p>
                    </div>
                  </div>
                  <div className={`text-right font-bold ${step.final ? 'text-lime-400 text-xl' : step.highlight ? 'text-amber-400' : 'text-white'}`}>
                    {step.prefix}{typeof step.result === 'number' ? step.result.toLocaleString(undefined, { maximumFractionDigits: 2 }) : step.result}{step.suffix}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-700">
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <p className="text-slate-500 text-xs">Transaction</p>
                <p className="text-white font-bold">${calculation.summary.transactionAmount.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <p className="text-slate-500 text-xs">Final RVU</p>
                <p className="text-cyan-400 font-bold">{calculation.summary.finalRVU.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <p className="text-slate-500 text-xs">Promo Bonus</p>
                <p className="text-amber-400 font-bold">+{calculation.summary.promoBonus.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-lime-500/10 rounded-lg border border-lime-500/30">
                <p className="text-lime-400 text-xs">Est. Payout</p>
                <p className="text-lime-400 font-bold text-xl">${calculation.summary.estimatedPayout.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}