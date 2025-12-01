import React from 'react';
import { QrCode } from 'lucide-react';
import { format } from 'date-fns';

// Format currency
const formatCurrency = (amount, currency = 'SGD') => {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Template 1: Modern Professional
 * Clean design with lime accent colors
 */
export function ModernTemplate({ data }) {
  const { company, customer, quotation, items, totals, terms, bankDetails } = data;
  
  return (
    <div className="bg-white" style={{ width: '210mm', minHeight: '297mm', padding: '12mm', fontFamily: 'Arial, sans-serif' }}>
      {/* Header / Letterhead */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-lime-500">
        <div className="flex items-start gap-4">
          {company.logo ? (
            <img src={company.logo} alt="Logo" className="w-16 h-16 object-contain" />
          ) : (
            <div className="w-16 h-16 bg-lime-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              {company.name?.substring(0, 2).toUpperCase() || 'CO'}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-900">{company.name}</h1>
            <p className="text-xs text-slate-600">{company.address}</p>
            <p className="text-xs text-slate-600">UEN: {company.uen} {company.gst && `| GST: ${company.gst}`}</p>
            <p className="text-xs text-slate-600">{company.email} | {company.phone}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-lime-600">QUOTATION</h2>
          <p className="text-sm text-slate-600 mt-1">No: {quotation.number}</p>
          <p className="text-sm text-slate-600">Date: {quotation.date}</p>
          <p className="text-sm text-slate-600">Valid Until: {quotation.validUntil}</p>
          <p className="text-sm text-slate-600">Issued By: {quotation.issuedBy}</p>
          {quotation.paymentTerm && (
            <p className="text-sm text-slate-600">Payment: {quotation.paymentTerm}</p>
          )}
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-500 mb-1">BILL TO:</p>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p className="font-semibold text-slate-900">{customer.name}</p>
          {customer.address && <p className="text-sm text-slate-600">{customer.address}</p>}
          <p className="text-sm text-slate-600">Attn: {customer.contactPerson}</p>
          {customer.email && <p className="text-sm text-slate-600">Email: {customer.email}</p>}
          {customer.phone && <p className="text-sm text-slate-600">Tel: {customer.phone}</p>}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-sm mb-4 border-collapse">
        <thead>
          <tr className="bg-lime-500 text-white">
            <th className="border border-lime-600 px-2 py-2 text-left w-10">#</th>
            <th className="border border-lime-600 px-2 py-2 text-left">Description</th>
            <th className="border border-lime-600 px-2 py-2 text-right w-20">Unit Price</th>
            <th className="border border-lime-600 px-2 py-2 text-center w-14">UOM</th>
            <th className="border border-lime-600 px-2 py-2 text-center w-12">QTY</th>
            <th className="border border-lime-600 px-2 py-2 text-right w-24">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="border border-slate-300 px-2 py-2 text-center">{idx + 1}</td>
              <td className="border border-slate-300 px-2 py-2">{item.description || '-'}</td>
              <td className="border border-slate-300 px-2 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="border border-slate-300 px-2 py-2 text-center">{item.uom}</td>
              <td className="border border-slate-300 px-2 py-2 text-center">{item.qty}</td>
              <td className="border border-slate-300 px-2 py-2 text-right font-medium">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-56 border border-slate-300">
          <div className="flex justify-between px-3 py-1.5 border-b border-slate-200 text-sm">
            <span>Subtotal:</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between px-3 py-1.5 border-b border-slate-200 text-sm text-red-600">
              <span>Discount:</span>
              <span>-{formatCurrency(totals.discount)}</span>
            </div>
          )}
          <div className="flex justify-between px-3 py-1.5 border-b border-slate-200 text-sm">
            <span>GST ({totals.gstRate}%):</span>
            <span>{formatCurrency(totals.gst)}</span>
          </div>
          <div className="flex justify-between px-3 py-2 font-bold bg-lime-50 text-lime-800">
            <span>TOTAL:</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-500 mb-1">TERMS & CONDITIONS:</p>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs whitespace-pre-wrap text-slate-700">
          {terms}
        </div>
      </div>

      {/* Payment Details & QR Code */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <p className="text-xs font-semibold text-slate-500 mb-1">PAYMENT DETAILS:</p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs whitespace-pre-wrap text-slate-700">
            {bankDetails.details}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          {bankDetails.qrCode ? (
            <img src={bankDetails.qrCode} alt="Payment QR" className="w-24 h-24 object-contain" />
          ) : (
            <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
              <QrCode className="w-14 h-14 text-slate-300" />
            </div>
          )}
          <p className="text-xs text-slate-500 mt-2 text-center">Scan to Pay</p>
          <p className="text-xs font-semibold text-lime-600">{formatCurrency(totals.total)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-500">Thank you for your business!</p>
        <p className="text-xs text-slate-400 mt-1">This quotation is system generated by {company.name}</p>
      </div>
    </div>
  );
}

/**
 * Template 2: Classic Corporate
 * Traditional business layout with blue accents
 */
export function ClassicTemplate({ data }) {
  const { company, customer, quotation, items, totals, terms, bankDetails } = data;
  
  return (
    <div className="bg-white" style={{ width: '210mm', minHeight: '297mm', padding: '15mm', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-4 border-blue-800">
        <div className="flex justify-center mb-2">
          {company.logo ? (
            <img src={company.logo} alt="Logo" className="w-20 h-20 object-contain" />
          ) : (
            <div className="w-20 h-20 bg-blue-800 rounded flex items-center justify-center text-white font-bold text-2xl">
              {company.name?.substring(0, 2).toUpperCase() || 'CO'}
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-blue-800">{company.name}</h1>
        <p className="text-sm text-slate-600">{company.address}</p>
        <p className="text-xs text-slate-500">UEN: {company.uen} | GST Reg: {company.gst} | Tel: {company.phone} | Email: {company.email}</p>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-800 tracking-wide">QUOTATION</h2>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Bill To:</p>
          <div className="border-l-4 border-blue-800 pl-3">
            <p className="font-bold text-slate-900">{customer.name}</p>
            {customer.address && <p className="text-sm text-slate-600">{customer.address}</p>}
            <p className="text-sm text-slate-600">Attention: {customer.contactPerson}</p>
            {customer.email && <p className="text-sm text-slate-600">{customer.email}</p>}
            {customer.phone && <p className="text-sm text-slate-600">{customer.phone}</p>}
          </div>
        </div>
        <div className="text-right">
          <table className="ml-auto text-sm">
            <tbody>
              <tr>
                <td className="pr-4 py-1 text-slate-500">Quotation No:</td>
                <td className="font-bold text-blue-800">{quotation.number}</td>
              </tr>
              <tr>
                <td className="pr-4 py-1 text-slate-500">Date:</td>
                <td className="font-medium">{quotation.date}</td>
              </tr>
              <tr>
                <td className="pr-4 py-1 text-slate-500">Valid Until:</td>
                <td className="font-medium">{quotation.validUntil}</td>
              </tr>
              <tr>
                <td className="pr-4 py-1 text-slate-500">Issued By:</td>
                <td className="font-medium">{quotation.issuedBy}</td>
              </tr>
              {quotation.paymentTerm && (
                <tr>
                  <td className="pr-4 py-1 text-slate-500">Payment Term:</td>
                  <td className="font-medium">{quotation.paymentTerm}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Items */}
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="bg-blue-800 text-white">
            <th className="px-3 py-2 text-left w-12 border border-blue-900">No.</th>
            <th className="px-3 py-2 text-left border border-blue-900">Description</th>
            <th className="px-3 py-2 text-right w-24 border border-blue-900">Unit Price</th>
            <th className="px-3 py-2 text-center w-16 border border-blue-900">UOM</th>
            <th className="px-3 py-2 text-center w-14 border border-blue-900">Qty</th>
            <th className="px-3 py-2 text-right w-28 border border-blue-900">Amount (SGD)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-slate-200">
              <td className="px-3 py-2 border-l border-r border-slate-200 text-center">{idx + 1}</td>
              <td className="px-3 py-2 border-r border-slate-200">{item.description || '-'}</td>
              <td className="px-3 py-2 border-r border-slate-200 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="px-3 py-2 border-r border-slate-200 text-center">{item.uom}</td>
              <td className="px-3 py-2 border-r border-slate-200 text-center">{item.qty}</td>
              <td className="px-3 py-2 border-r border-slate-200 text-right font-medium">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-60">
          <div className="flex justify-between py-1 border-b border-slate-200 text-sm">
            <span className="text-slate-600">Subtotal:</span>
            <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between py-1 border-b border-slate-200 text-sm text-red-600">
              <span>Less Discount:</span>
              <span>({formatCurrency(totals.discount)})</span>
            </div>
          )}
          <div className="flex justify-between py-1 border-b border-slate-200 text-sm">
            <span className="text-slate-600">GST @ {totals.gstRate}%:</span>
            <span className="font-medium">{formatCurrency(totals.gst)}</span>
          </div>
          <div className="flex justify-between py-2 bg-blue-800 text-white px-3 font-bold">
            <span>TOTAL (SGD):</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Terms & Conditions:</p>
        <div className="text-xs text-slate-600 whitespace-pre-wrap border-l-4 border-blue-200 pl-3 bg-blue-50 py-2">
          {terms}
        </div>
      </div>

      {/* Payment */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Bank Details for Payment:</p>
          <div className="text-xs text-slate-600 whitespace-pre-wrap border border-slate-200 p-3 rounded bg-slate-50">
            {bankDetails.details}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          {bankDetails.qrCode ? (
            <img src={bankDetails.qrCode} alt="QR" className="w-28 h-28 object-contain border p-1" />
          ) : (
            <div className="w-28 h-28 bg-slate-100 flex items-center justify-center border">
              <QrCode className="w-16 h-16 text-slate-300" />
            </div>
          )}
          <p className="text-xs text-slate-500 mt-2">PayNow / Scan to Pay</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t-2 border-blue-800 text-center">
        <p className="text-sm font-semibold text-blue-800">Thank you for your valued business.</p>
        <p className="text-xs text-slate-400 mt-1">This is a computer-generated document. No signature is required.</p>
      </div>
    </div>
  );
}

/**
 * Template 3: Minimal Modern
 * Clean, minimalist design
 */
export function MinimalTemplate({ data }) {
  const { company, customer, quotation, items, totals, terms, bankDetails } = data;
  
  return (
    <div className="bg-white" style={{ width: '210mm', minHeight: '297mm', padding: '20mm', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          {company.logo ? (
            <img src={company.logo} alt="Logo" className="w-12 h-12 object-contain mb-2" />
          ) : (
            <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center text-white font-light text-lg mb-2">
              {company.name?.substring(0, 2).toUpperCase()}
            </div>
          )}
          <h1 className="text-lg font-light text-slate-900">{company.name}</h1>
          <p className="text-xs text-slate-400">{company.address}</p>
          <p className="text-xs text-slate-400">{company.email} | {company.phone}</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-light text-slate-300 tracking-widest">QUOTATION</h2>
          <p className="text-sm text-slate-900 mt-2 font-medium">{quotation.number}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-8 mb-8 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Bill To</p>
          <p className="font-medium text-slate-900">{customer.name}</p>
          <p className="text-sm text-slate-600">{customer.contactPerson}</p>
          {customer.email && <p className="text-sm text-slate-500">{customer.email}</p>}
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Issue Date</p>
          <p className="text-sm text-slate-900">{quotation.date}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider mt-3 mb-1">Valid Until</p>
          <p className="text-sm text-slate-900">{quotation.validUntil}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Prepared By</p>
          <p className="text-sm text-slate-900">{quotation.issuedBy}</p>
          {quotation.paymentTerm && (
            <>
              <p className="text-xs text-slate-400 uppercase tracking-wider mt-3 mb-1">Payment</p>
              <p className="text-sm text-slate-900">{quotation.paymentTerm}</p>
            </>
          )}
        </div>
      </div>

      {/* Items */}
      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="border-b-2 border-slate-900">
            <th className="py-3 text-left text-xs text-slate-400 uppercase tracking-wider">Description</th>
            <th className="py-3 text-right text-xs text-slate-400 uppercase tracking-wider w-24">Price</th>
            <th className="py-3 text-center text-xs text-slate-400 uppercase tracking-wider w-16">Qty</th>
            <th className="py-3 text-right text-xs text-slate-400 uppercase tracking-wider w-28">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-slate-100">
              <td className="py-3 text-slate-900">{item.description}</td>
              <td className="py-3 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
              <td className="py-3 text-center text-slate-600">{item.qty} {item.uom}</td>
              <td className="py-3 text-right font-medium text-slate-900">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-48">
          <div className="flex justify-between py-1 text-sm text-slate-500">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between py-1 text-sm text-slate-500">
            <span>GST {totals.gstRate}%</span>
            <span>{formatCurrency(totals.gst)}</span>
          </div>
          <div className="flex justify-between py-2 border-t-2 border-slate-900 text-lg font-medium">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Terms & Payment */}
      <div className="grid grid-cols-2 gap-8 text-xs text-slate-500">
        <div>
          <p className="uppercase tracking-wider text-slate-400 mb-2">Terms</p>
          <div className="whitespace-pre-wrap">{terms}</div>
        </div>
        <div>
          <p className="uppercase tracking-wider text-slate-400 mb-2">Payment</p>
          <div className="whitespace-pre-wrap">{bankDetails.details}</div>
          <div className="mt-4 flex items-center gap-2">
            {bankDetails.qrCode ? (
              <img src={bankDetails.qrCode} alt="QR" className="w-16 h-16 object-contain" />
            ) : (
              <div className="w-16 h-16 bg-slate-100 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-300" />
              </div>
            )}
            <span className="text-slate-400">Scan to pay</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 text-center text-xs text-slate-300">
        Thank you · {company.name} · {company.phone}
      </div>
    </div>
  );
}

// Template selector component
export const QUOTATION_TEMPLATES = [
  { id: 'modern', name: 'Modern Professional', component: ModernTemplate, preview: 'Lime green accent, contemporary layout' },
  { id: 'classic', name: 'Classic Corporate', component: ClassicTemplate, preview: 'Blue formal, traditional business style' },
  { id: 'minimal', name: 'Minimal Modern', component: MinimalTemplate, preview: 'Clean minimalist, lots of whitespace' }
];

export default { ModernTemplate, ClassicTemplate, MinimalTemplate, QUOTATION_TEMPLATES };