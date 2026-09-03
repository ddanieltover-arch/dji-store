import React from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  ShieldCheck,
  Building2,
  QrCode,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { PlacedOrder, WarrantyRegistration, ReturnRequest, B2bQuote } from '../types';
import { formatPrice } from '../data/currency';
import { paymentMethodDisplayName } from '../lib/payments/checkoutTotals';

export type DocumentType =
  | 'vat_invoice'
  | 'packing_slip'
  | 'ce_declaration'
  | 'dhl_shipping_label'
  | 'rma_return_label'
  | 'b2b_proforma_quote';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: DocumentType;
  order?: PlacedOrder | null;
  warranty?: WarrantyRegistration | null;
  rma?: ReturnRequest | null;
  quote?: B2bQuote | null;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  docType,
  order,
  warranty,
  rma,
  quote
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Document Header & Actions Bar */}
        <div className="px-6 py-4 bg-[#111113] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-[#E30613] text-white text-[10px] font-black px-2 py-0.5 rounded">
              OFFICIAL EU DOCUMENT
            </span>
            <span className="text-sm font-bold text-gray-200">
              {docType === 'vat_invoice' && 'Commercial Invoice'}
              {docType === 'packing_slip' && 'WMS Logistics Warehouse Packing Slip'}
              {docType === 'ce_declaration' && 'EU EASA CE Declaration of Conformity'}
              {docType === 'dhl_shipping_label' && 'DHL Express European Air Waybill'}
              {docType === 'rma_return_label' && 'Prepaid DHL Return Shipping Label'}
              {docType === 'b2b_proforma_quote' && 'Enterprise B2B Pro-Forma Quotation'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={() => {
                alert('Document generated and downloaded to your device.');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#E30613] hover:bg-red-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-gray-800 text-xs leading-relaxed font-sans print:p-0">
          {/* ============================================================ */}
          {/* 1. VAT COMMERCIAL INVOICE */}
          {/* ============================================================ */}
          {docType === 'vat_invoice' && order && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-200 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-2xl tracking-tighter text-black">DJI</span>
                    <span className="font-bold text-sm text-gray-500 uppercase tracking-widest">
                      Store Europe BV
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-1">
                    European Distribution Operations Hub<br />
                    Flughafenstraße 100, Gateway Gardens<br />
                    60549 Frankfurt am Main, Germany<br />
                    EU Company Reg: <strong>HRB 108920 Frankfurt</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase block">
                    Tax Invoice / Rechnung
                  </span>
                  <span className="text-lg font-black font-mono text-gray-900 block">
                    INV-{order.orderNumber}
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Invoice Date: {new Date(order.createdAt).toLocaleDateString()}<br />
                    Payment Reference: <strong>{order.orderNumber}</strong><br />
                    Payment Method: {paymentMethodDisplayName(order.paymentMethod)}
                  </p>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
                <div>
                  <span className="font-bold text-gray-400 uppercase text-[10px] block mb-1">
                    Billed To / Customer
                  </span>
                  <p className="font-bold text-gray-900">
                    {order.customer.company || `${order.customer.firstName} ${order.customer.lastName}`}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
                    {order.shippingAddress.countryName}
                  </p>
                  <p className="text-gray-500 text-[11px] mt-1">{order.customer.email}</p>
                </div>

                <div>
                  <span className="font-bold text-gray-400 uppercase text-[10px] block mb-1">
                    Shipping & Delivery Address
                  </span>
                  <p className="font-bold text-gray-900">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
                    {order.shippingAddress.countryName}
                  </p>
                  <p className="text-blue-700 font-mono text-[11px] mt-1">
                    Carrier: DHL Express (Tracking: {order.trackingToken})
                  </p>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 border-b border-gray-300 text-gray-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">SKU & Serial</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Amount EUR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold text-gray-900">
                        {item.productName}
                        <span className="block text-[11px] text-gray-500 font-normal">
                          {item.comboName}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-gray-500">
                        {item.sku}
                        {item.serialNumber && (
                          <span className="block text-blue-600">SN: {item.serialNumber}</span>
                        )}
                      </td>
                      <td className="p-3 text-center font-bold">{item.quantity}</td>
                      <td className="p-3 text-right">{formatPrice(item.priceEur, 'EUR')}</td>
                      <td className="p-3 text-right font-bold text-gray-900">
                        {formatPrice(item.priceEur * item.quantity, 'EUR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-1.5 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.subtotalEur, 'EUR')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Express European Air Shipping:</span>
                    <span className="text-emerald-700 font-bold">FREE (€0.00)</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-gray-900 pt-2 border-t border-gray-300">
                    <span>Grand Total EUR:</span>
                    <span>{formatPrice(order.totalEur, 'EUR')}</span>
                  </div>
                </div>
              </div>

              {/* Bank & Compliance Footer */}
              <div className="pt-4 border-t border-gray-200 text-[10px] text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <p>
                    Bank: Commerzbank Frankfurt am Main • BIC/SWIFT: COBADEFFXXX<br />
                    IBAN: DE89 5004 0000 0123 4567 89 • Account Holder: DJI Store Europe BV
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    24 Months Statutory European Warranty Applicable.<br />
                    EASA Class-Compliant Aircraft Hardware.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. WMS WAREHOUSE PACKING SLIP */}
          {/* ============================================================ */}
          {docType === 'packing_slip' && order && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    WMS PICK & PACK MANIFEST
                  </span>
                  <h3 className="text-lg font-black text-gray-900 mt-1">
                    Hub: {order.allocation?.warehouseName || 'Frankfurt Central Hub (FRA-01)'}
                  </h3>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="font-bold">Bin: {order.allocation?.binLocation || 'A-04-03'}</span>
                  <p className="text-gray-500">Order Ref: {order.orderNumber}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span>Ship To: {order.customer.firstName} {order.customer.lastName}</span>
                  <span className="font-mono text-blue-600">DHL Express Priority</span>
                </div>
                <p className="text-gray-600">
                  {order.shippingAddress.street}, {order.shippingAddress.postalCode} {order.shippingAddress.city}, {order.shippingAddress.countryName}
                </p>
              </div>

              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 border-b border-gray-300 uppercase text-[10px] text-gray-600">
                  <tr>
                    <th className="p-3">Location</th>
                    <th className="p-3">Product Model</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Picked Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((i, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-mono font-bold text-purple-700">
                        {order.allocation?.binLocation || 'A-04-03'}
                      </td>
                      <td className="p-3 font-bold">{i.productName} ({i.comboName})</td>
                      <td className="p-3 font-mono text-gray-500">{i.sku}</td>
                      <td className="p-3 text-center font-bold text-sm">{i.quantity}</td>
                      <td className="p-3 text-right font-mono text-emerald-700 font-bold">
                        [ ✔ VERIFIED ]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-4 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-gray-900">Picker Signature: H. Richter (WMS-FRA)</p>
                  <p className="text-gray-500 text-[11px]">Weight: 3.40 kg • Parcel Count: 1 of 1</p>
                </div>
                <div className="font-mono text-[10px] bg-gray-100 p-2 rounded text-center">
                  |||||||||||||||||||||||||||||<br />
                  {order.orderNumber}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. EASA CE DECLARATION OF CONFORMITY */}
          {/* ============================================================ */}
          {docType === 'ce_declaration' && (
            <div className="space-y-6">
              <div className="text-center space-y-2 border-b border-gray-200 pb-6">
                <span className="text-2xl font-serif font-black tracking-widest">CE</span>
                <h3 className="text-base font-black text-gray-900">
                  EU DECLARATION OF CONFORMITY (EASA / CE)
                </h3>
                <p className="text-gray-500 text-[11px]">
                  According to EU Regulation 2019/945 & Commission Delegated Regulation 2020/1058
                </p>
              </div>

              <div className="space-y-3">
                <p><strong>Manufacturer:</strong> SZ DJI TECHNOLOGY CO., LTD.</p>
                <p><strong>EU Authorized Representative:</strong> DJI Store Europe BV, Frankfurt am Main, Germany</p>
                <p><strong>Object of Declaration:</strong> Unmanned Aircraft System (UAS) / Drone Hardware</p>
                <p><strong>Applicable Model:</strong> {warranty?.productModel || 'DJI Mavic 4 Pro / Mini 4 Pro Series'}</p>
                <p><strong>Class Identification Label:</strong> EASA Class C1 (Mavic 4 Pro) / EASA Class C0 (Mini 4 Pro &lt;249g)</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <span className="font-bold text-gray-900 block">Conformity Standards:</span>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>EN 300 328 V2.2.2 (Wideband transmission systems; 2.4 GHz ISM band)</li>
                  <li>EN 301 893 V2.1.1 (5 GHz RLAN transmission systems)</li>
                  <li>EN 62368-1:2014+A11:2017 (Audio/video, information technology safety)</li>
                  <li>EASA Direct Remote ID & Geo-Awareness Sound Power Standards</li>
                </ul>
              </div>

              <div className="flex justify-between items-end pt-6 border-t border-gray-200 text-xs">
                <div>
                  <p className="text-gray-500">Place and Date of Issue:</p>
                  <p className="font-bold text-gray-900">Frankfurt am Main, European Union</p>
                </div>
                <div className="text-right">
                  <p className="font-serif italic text-sm text-gray-700">Dr. M. Lindner</p>
                  <p className="font-bold text-gray-900">VP European Regulatory & Aviation Affairs</p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 4. DHL AIR WAYBILL LABEL */}
          {/* ============================================================ */}
          {(docType === 'dhl_shipping_label' || docType === 'rma_return_label') && (
            <div className="border-2 border-black p-6 rounded-2xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <span className="font-black text-2xl text-yellow-500 bg-red-600 px-3 py-1 font-sans">
                  DHL EXPRESS
                </span>
                <div className="text-right font-sans font-bold">
                  <span className="text-base block">EXPRESS WORLDWIDE</span>
                  <span className="text-xs text-gray-600">EUROPEAN AIR NETWORK</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-4">
                <div>
                  <span className="font-bold block text-[10px]">FROM (SHIPPER):</span>
                  <p>
                    {docType === 'rma_return_label' ? (
                      <>
                        {rma?.productName}<br />
                        Customer Return Services<br />
                        Munich, Germany
                      </>
                    ) : (
                      <>
                        DJI STORE EUROPE BV (FRA-01)<br />
                        Flughafenstraße 100<br />
                        60549 Frankfurt am Main, DE
                      </>
                    )}
                  </p>
                </div>

                <div>
                  <span className="font-bold block text-[10px]">TO (RECEIVER):</span>
                  <p>
                    {docType === 'rma_return_label' ? (
                      <>
                        DJI EU RETURNS REPAIR HUB<br />
                        RMA REF: {rma?.rmaNumber || 'RMA-EU-0891'}<br />
                        Gateway Gardens, 60549 Frankfurt, DE
                      </>
                    ) : (
                      <>
                        {order?.customer.firstName} {order?.customer.lastName}<br />
                        {order?.shippingAddress.street}<br />
                        {order?.shippingAddress.postalCode} {order?.shippingAddress.city}, {order?.shippingAddress.countryCode}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between font-bold text-sm">
                <span>WAYBILL: {order?.dhlShipment?.waybillNumber || rma?.returnTrackingNumber || '983 847 273'}</span>
                <span>WEIGHT: 3.4 KG</span>
                <span>DEST: DE-MUC</span>
              </div>

              <div className="py-4 text-center border-t-2 border-black">
                <div className="text-lg tracking-widest font-black">
                  ||| | |||| ||| ||||||| |||| |||||||| ||||||
                </div>
                <span className="text-[11px] font-bold">
                  (J) JD01 4600 0098 3847 2730
                </span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 5. B2B PRO-FORMA QUOTE */}
          {/* ============================================================ */}
          {docType === 'b2b_proforma_quote' && quote && (
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-2xl text-black">DJI</span>
                    <span className="font-bold text-sm text-gray-500 uppercase tracking-widest">
                      Enterprise EU
                    </span>
                  </div>
                  <p className="text-gray-500 text-[11px] mt-1">
                    B2B Commercial Accounts Division • Frankfurt am Main
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-purple-700 uppercase block">
                    B2B Quotation
                  </span>
                  <span className="text-lg font-black font-mono text-gray-900 block">
                    {quote.quoteNumber}
                  </span>
                  <p className="text-[11px] text-gray-500">
                    Valid Until: {new Date(quote.validUntil).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs">
                <p className="font-bold text-purple-950">Company: {quote.companyName}</p>
                <p className="text-purple-800">Company ID: {quote.vatId} • VIES Status: Validated</p>
              </div>

              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 border-b border-gray-300 uppercase text-[10px] text-gray-600">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">MSRP Unit</th>
                    <th className="p-3 text-right">Volume Discount</th>
                    <th className="p-3 text-right">Total Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quote.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-bold">{item.product.modelName} - {item.variant.comboName}</td>
                      <td className="p-3 text-center font-bold">{item.quantity}</td>
                      <td className="p-3 text-right">{formatPrice(item.unitPriceEur, 'EUR')}</td>
                      <td className="p-3 text-right text-emerald-700 font-bold">-{item.discountPercent}%</td>
                      <td className="p-3 text-right font-black text-gray-900">
                        {formatPrice(item.unitPriceEur * item.quantity * (1 - item.discountPercent / 100), 'EUR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-72 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(quote.subtotalEur, 'EUR')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Dealer Savings:</span>
                    <span>-{formatPrice(quote.discountEur, 'EUR')}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-gray-900 pt-2 border-t border-gray-300">
                    <span>Quote Total:</span>
                    <span>{formatPrice(quote.totalEur, 'EUR')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
