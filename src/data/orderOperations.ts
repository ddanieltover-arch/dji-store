import {
  PlacedOrder,
  OrderStatus,
  OrderFulfillmentAllocation,
  DhlShipmentDetails,
  WarrantyRegistration,
  DjiCarePlan,
  ReturnRequest,
  CustomerNotification,
  B2bCompanyProfile,
  B2bQuote,
  WarehouseDepot,
  VariantDepotStock
} from '../types';
import { EUROPEAN_WAREHOUSES } from './warehouses';
import { DJI_PRODUCTS } from './products';

// ----------------------------------------------------
// Multi-Depot Allocation Engine
// ----------------------------------------------------

export interface AllocationResult {
  depot: WarehouseDepot;
  transitDays: number;
  cutoffStatus: 'before_cutoff' | 'after_cutoff';
  binLocation: string;
  carrierService: string;
  reason: string;
}

const BIN_LOCATIONS = [
  'A-04-03', 'A-04-04', 'B-12-01', 'B-12-02', 'C-08-15', 'C-08-16', 'D-01-09'
];

export function determineOptimalWarehouse(
  countryCode: string,
  variantId?: string,
  depotStocks?: Record<string, VariantDepotStock[]>
): AllocationResult {
  const normalizedCountry = (countryCode || 'DE').toUpperCase();

  // Filter depots with stock if variantId is provided
  const candidates = EUROPEAN_WAREHOUSES.map((depot) => {
    let stock = 15; // default fallback stock
    if (variantId && depotStocks && depotStocks[variantId]) {
      const stockObj = depotStocks[variantId].find((s) => s.depotId === depot.id);
      if (stockObj) stock = stockObj.stockUnits;
    }

    const transitDays = (depot.transitDaysToEu as Record<string, number>)[normalizedCountry] ?? (depot.isPrimaryHub ? 2 : 3);

    return {
      depot,
      stock,
      transitDays
    };
  });

  // Sort by stock > 0, then shortest transit time, then higher stock
  const inStockCandidates = candidates.filter((c) => c.stock > 0);
  const bestCandidate = inStockCandidates.length > 0
    ? inStockCandidates.sort((a, b) => a.transitDays - b.transitDays || b.stock - a.stock)[0]
    : candidates[0]; // fallback to primary

  const randomBin = BIN_LOCATIONS[Math.floor(Math.random() * BIN_LOCATIONS.length)];

  return {
    depot: bestCandidate.depot,
    transitDays: bestCandidate.transitDays,
    cutoffStatus: 'before_cutoff',
    binLocation: randomBin,
    carrierService: bestCandidate.depot.carrierService,
    reason: `Optimized for ${normalizedCountry} delivery with ${bestCandidate.transitDays} day(s) transit time via ${bestCandidate.depot.code}`
  };
}

// ----------------------------------------------------
// Initial Seeded Orders with Rich OMS Data
// ----------------------------------------------------

export const INITIAL_ORDERS: PlacedOrder[] = [
  {
    orderNumber: 'DJI-EU-100239',
    trackingToken: 'DHL-DE-983847273',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    customer: {
      firstName: 'Lukas',
      lastName: 'Keller',
      email: 'lukas.keller@cinematography-eu.de',
      phone: '+49 171 892 4410',
      company: 'Keller Aerial Cinema GmbH'
    },
    shippingAddress: {
      street: 'Maximilianstraße 35B',
      postalCode: '80539',
      city: 'Munich',
      countryCode: 'DE',
      countryName: 'Germany'
    },
    items: [
      {
        productName: 'DJI Mavic 4 Pro',
        comboName: 'Fly More Combo (DJI RC 2)',
        sku: 'DJI-M4P-FMC-RC2',
        priceEur: 2699,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80',
        productId: 'prod-mavic-4-pro',
        variantId: 'var-m4p-fmc-rc2',
        serialNumber: '1581F4Q89210087DE'
      },
      {
        productName: 'DJI Care Refresh 2-Year Plan',
        comboName: '2-Year Comprehensive Cover (Mavic 4 Pro)',
        sku: 'DJI-CARE-M4P-2Y',
        priceEur: 299,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80',
        productId: 'prod-mavic-4-pro',
        variantId: 'var-care-m4p'
      }
    ],
    subtotalEur: 2998,
    discountEur: 0,
    vatEur: 478.67,
    vatRatePercent: 19,
    shippingEur: 0,
    totalEur: 2998,
    paymentMethod: 'sepa_bank_wire',
    paymentStatus: 'confirmed',
    status: 'shipped',
    paymentDetails: {
      senderIban: 'DE89 3704 0044 0532 0130 00',
      receiptFileName: 'SEPA_Proof_Lukas_Keller_100239.pdf'
    },
    paymentVerification: {
      ibanMatched: true,
      senderMatched: true,
      amountMatched: true,
      referenceMatched: true,
      verifiedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      verifiedBy: 'Frankfurt Auto-Clearing System'
    },
    allocation: {
      warehouseId: 'depot-fra-01',
      warehouseCode: 'FRA-01',
      warehouseName: 'Frankfurt Central Distribution Center',
      binLocation: 'A-04-03',
      priority: 'EXPRESS',
      assignedPicker: 'H. Richter (WMS-FRA)',
      pickedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      packedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      dispatchedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      airWaybillNumber: 'AWB-DHL-983847273-DE'
    },
    dhlShipment: {
      id: 'shipment-100239',
      orderNumber: 'DJI-EU-100239',
      carrier: 'dhl',
      carrierService: 'DHL Express European Direct Air',
      trackingNumber: 'DHL-DE-983847273',
      waybillNumber: '983847273',
      shippingLabelUrl: 'https://djii.eu/labels/dhl_983847273.pdf',
      status: 'in_transit',
      originHub: 'Frankfurt Main Logistics Airport (FRA)',
      destinationCity: 'Munich',
      destinationCountry: 'Germany',
      estimatedDeliveryDate: 'Tomorrow by 12:00 CET',
      weightKg: 3.4,
      checkpoints: [
        {
          timestamp: '14:40 CET Today',
          statusText: 'Departed DHL Air Hub Leipzig (LEJ)',
          location: 'Leipzig, Germany',
          completed: true,
          carrierStatusCode: 'AF',
          notes: 'Flight D0 2901 to Munich Airport (MUC)'
        },
        {
          timestamp: '10:15 CET Today',
          statusText: 'Processed at DHL Sorting Facility Leipzig',
          location: 'Leipzig Hub, Germany',
          completed: true,
          carrierStatusCode: 'PL',
          notes: 'Automated sorting clearance passed'
        },
        {
          timestamp: '06:30 CET Today',
          statusText: 'Picked up from DJI Frankfurt Hub (FRA-01)',
          location: 'Frankfurt Logistics Park, Germany',
          completed: true,
          carrierStatusCode: 'PU',
          notes: 'Dispatched in express container'
        },
        {
          timestamp: 'Yesterday 19:30',
          statusText: 'Shipping Information Received & Waybill Generated',
          location: 'DJI Store EU WMS',
          completed: true,
          carrierStatusCode: 'CR'
        }
      ]
    },
    tracking: {
      carrier: 'DHL Express European Air',
      trackingNumber: 'DHL-DE-983847273',
      status: 'in_transit',
      estimatedDelivery: 'Tomorrow by 12:00 CET',
      currentLocation: 'DHL Hub Leipzig (LEJ), Germany',
      events: [
        { time: '14:40 CET Today', title: 'Departed Facility in DHL Hub Leipzig', location: 'Leipzig, Germany', completed: true },
        { time: '10:15 CET Today', title: 'Processed at Sorting Center', location: 'Leipzig Hub, Germany', completed: true },
        { time: '06:30 CET Today', title: 'Shipment picked up by DHL Courier', location: 'Frankfurt Hub, Germany', completed: true },
        { time: 'Yesterday 19:30', title: 'Commercial Electronic Invoice Cleared', location: 'DJI Store EU Operations', completed: true }
      ]
    }
  },
  {
    orderNumber: 'DJI-EU-100188',
    trackingToken: 'DHL-FR-883910244',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    customer: {
      firstName: 'Lukas',
      lastName: 'Keller',
      email: 'lukas.keller@cinematography-eu.de',
      phone: '+49 171 892 4410'
    },
    shippingAddress: {
      street: 'Maximilianstraße 35B',
      postalCode: '80539',
      city: 'Munich',
      countryCode: 'DE',
      countryName: 'Germany'
    },
    items: [
      {
        productName: 'DJI Mini 4 Pro',
        comboName: 'Fly More Combo Plus (DJI RC 2)',
        sku: 'DJI-M4P-MINI-FMC',
        priceEur: 1129,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=400&q=80',
        productId: 'prod-mini-4-pro',
        variantId: 'var-mini4p-fmc',
        serialNumber: '1581F3X90128471EU'
      }
    ],
    subtotalEur: 1129,
    discountEur: 0,
    vatEur: 180.26,
    vatRatePercent: 19,
    shippingEur: 0,
    totalEur: 1129,
    paymentMethod: 'crypto_usdt',
    paymentStatus: 'delivered',
    status: 'delivered',
    paymentDetails: {
      cryptoAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      cryptoTxHash: '0x8f2d8b4e72c8374a91924b1049281a8c9e01726a8d3810293847291823901b'
    },
    paymentVerification: {
      cryptoCurrency: 'USDT_TRC20',
      cryptoConfirmations: 20,
      cryptoConfirmationsRequired: 20,
      cryptoTxHash: '0x8f2d8b4e72c8374a91924b1049281a8c9e01726a8d3810293847291823901b',
      cryptoExplorerUrl: 'https://tronscan.org/#/transaction/0x8f2d8b4e72c8374a91924b1049281a8c9e01726a8d3810293847291823901b',
      verifiedAt: new Date(Date.now() - 3600000 * 70).toISOString(),
      verifiedBy: 'Tron TRC-20 Auto-Watcher'
    },
    allocation: {
      warehouseId: 'depot-ams-02',
      warehouseCode: 'AMS-02',
      warehouseName: 'Amsterdam Schiphol Aviation Logistics',
      binLocation: 'B-12-01',
      priority: 'STANDARD',
      assignedPicker: 'J. Van Der Berg',
      pickedAt: new Date(Date.now() - 3600000 * 68).toISOString(),
      packedAt: new Date(Date.now() - 3600000 * 66).toISOString(),
      dispatchedAt: new Date(Date.now() - 3600000 * 60).toISOString(),
      airWaybillNumber: 'AWB-DHL-883910244-NL'
    },
    dhlShipment: {
      id: 'shipment-100188',
      orderNumber: 'DJI-EU-100188',
      carrier: 'dhl',
      carrierService: 'DHL Express European Direct Air',
      trackingNumber: 'DHL-FR-883910244',
      waybillNumber: '883910244',
      shippingLabelUrl: 'https://djii.eu/labels/dhl_883910244.pdf',
      status: 'delivered',
      originHub: 'Amsterdam Schiphol Logistics (AMS-02)',
      destinationCity: 'Munich',
      destinationCountry: 'Germany',
      estimatedDeliveryDate: 'Delivered',
      signedBy: 'L. Keller',
      weightKg: 1.2,
      checkpoints: [
        {
          timestamp: '2 Days Ago 11:32 CET',
          statusText: 'Delivered — Signed by Recipient (L. Keller)',
          location: 'Munich, Germany',
          completed: true,
          carrierStatusCode: 'OK',
          notes: 'Safe delivery confirmed'
        },
        {
          timestamp: '2 Days Ago 08:15 CET',
          statusText: 'Out for Delivery with Courier',
          location: 'Munich South Depot, Germany',
          completed: true,
          carrierStatusCode: 'WC'
        },
        {
          timestamp: '3 Days Ago 22:40 CET',
          statusText: 'Arrived at Delivery Facility',
          location: 'Munich Sorting Hub, Germany',
          completed: true,
          carrierStatusCode: 'AR'
        }
      ]
    },
    tracking: {
      carrier: 'DHL Express European Direct',
      trackingNumber: 'DHL-FR-883910244',
      status: 'delivered',
      estimatedDelivery: 'Delivered',
      currentLocation: 'Munich, Germany',
      events: [
        { time: '2 Days Ago 11:32', title: 'Delivered - Signed by L. Keller', location: 'Munich, Germany', completed: true },
        { time: '2 Days Ago 08:15', title: 'Out for Delivery', location: 'Munich, Germany', completed: true },
        { time: '3 Days Ago 22:40', title: 'Arrived at Delivery Hub', location: 'Munich, Germany', completed: true }
      ]
    }
  },
  {
    orderNumber: 'DJI-EU-100305',
    trackingToken: 'DHL-PENDING-100305',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer: {
      firstName: 'Sophie',
      lastName: 'Dubois',
      email: 's.dubois@aeroparis.fr',
      phone: '+33 6 49 10 29 38'
    },
    shippingAddress: {
      street: '28 Rue de Rivoli',
      postalCode: '75004',
      city: 'Paris',
      countryCode: 'FR',
      countryName: 'France'
    },
    items: [
      {
        productName: 'DJI Avata 2',
        comboName: 'Fly More Combo (3 Batteries + Goggles 3)',
        sku: 'DJI-AVATA2-FMC-G3',
        priceEur: 1199,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=400&q=80',
        productId: 'prod-avata-2',
        variantId: 'var-avata2-fmc3',
        serialNumber: '1581F7T98210344FR'
      }
    ],
    subtotalEur: 1199,
    discountEur: 0,
    vatEur: 199.83,
    vatRatePercent: 20,
    shippingEur: 0,
    totalEur: 1199,
    paymentMethod: 'sepa_bank_wire',
    paymentStatus: 'verifying',
    status: 'payment_under_review',
    paymentDetails: {
      senderIban: 'FR76 3000 4001 2345 6789 0123 456',
      receiptFileName: 'Virement_SEPA_Dubois_100305.pdf'
    },
    paymentVerification: {
      ibanMatched: true,
      senderMatched: true,
      amountMatched: true,
      referenceMatched: false,
      verifiedAt: undefined,
      verifiedBy: 'Pending Operator Review'
    },
    allocation: {
      warehouseId: 'depot-cdg-03',
      warehouseCode: 'CDG-03',
      warehouseName: 'Paris Charles de Gaulle Air Terminal',
      binLocation: 'C-08-15',
      priority: 'EXPRESS'
    }
  }
];

// ----------------------------------------------------
// Initial Warranty Registrations (Statutory 2-Yr EU)
// ----------------------------------------------------

export const INITIAL_WARRANTIES: WarrantyRegistration[] = [
  {
    id: 'warr-001',
    orderNumber: 'DJI-EU-100239',
    productId: 'prod-mavic-4-pro',
    productModel: 'DJI Mavic 4 Pro (C1 Certified)',
    variantComboName: 'Fly More Combo (DJI RC 2)',
    aircraftSerial: '1581F4Q89210087DE',
    remoteSerial: '37ABG901239841',
    batterySerials: ['BAT-M4P-8910', 'BAT-M4P-8911', 'BAT-M4P-8912'],
    purchaseDate: '2026-08-13',
    warrantyExpiryDate: '2028-08-13', // 24-Month EU Statutory Guarantee
    status: 'active',
    invoiceUrl: 'https://djii.eu/invoices/DJI-EU-100239-VAT.pdf',
    countryCode: 'DE',
    complianceDocUrl: 'https://djii.eu/compliance/EASA-C1-MAVIC4PRO-DOC.pdf'
  },
  {
    id: 'warr-002',
    orderNumber: 'DJI-EU-100188',
    productId: 'prod-mini-4-pro',
    productModel: 'DJI Mini 4 Pro (C0 Sub-249g)',
    variantComboName: 'Fly More Combo Plus (DJI RC 2)',
    aircraftSerial: '1581F3X90128471EU',
    remoteSerial: '37ABG881029381',
    purchaseDate: '2026-08-10',
    warrantyExpiryDate: '2028-08-10',
    status: 'active',
    invoiceUrl: 'https://djii.eu/invoices/DJI-EU-100188-VAT.pdf',
    countryCode: 'DE',
    complianceDocUrl: 'https://djii.eu/compliance/EASA-C0-MINI4PRO-DOC.pdf'
  }
];

// ----------------------------------------------------
// Initial DJI Care Plans
// ----------------------------------------------------

export const INITIAL_CARE_PLANS: DjiCarePlan[] = [
  {
    id: 'care-001',
    orderNumber: 'DJI-EU-100239',
    planName: 'DJI Care Refresh 2-Year',
    productModel: 'DJI Mavic 4 Pro',
    aircraftSerial: '1581F4Q89210087DE',
    coverageStartDate: '2026-08-13',
    coverageExpiryDate: '2028-08-13',
    totalAccidentalReplacements: 3,
    remainingAccidentalReplacements: 3,
    totalFlyawayReplacements: 1,
    remainingFlyawayReplacements: 1,
    status: 'active',
    claimHistory: []
  }
];

// ----------------------------------------------------
// Initial Return Requests (RMA)
// ----------------------------------------------------

export const INITIAL_RMAS: ReturnRequest[] = [
  {
    id: 'rma-001',
    rmaNumber: 'RMA-EU-2026-0491',
    orderNumber: 'DJI-EU-100188',
    productId: 'prod-mini-4-pro',
    productName: 'DJI Mini 4 Pro ND Filter Set (ND 16/64/256)',
    comboName: 'Official Filter Accessory',
    serialNumber: 'ACC-ND-M4P-9901',
    reason: 'buyer_remorse_14day',
    detailedExplanation: 'Purchased duplicate accessory by mistake. Item is completely sealed and unboxed.',
    photoUrls: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80'
    ],
    status: 'approved',
    returnTrackingNumber: 'DHL-RET-DE-8891024',
    returnLabelUrl: 'https://djii.eu/returns/DHL-RET-DE-8891024.pdf',
    refundAmountEur: 79,
    refundMethod: 'original_sepa',
    inspectionNotes: 'Return approved under 14-Day EU Statutory Distance Selling Directive. Free DHL return label generated.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

// ----------------------------------------------------
// Initial Customer Notifications (Email & SMS Log)
// ----------------------------------------------------

export const INITIAL_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: 'notif-001',
    type: 'email',
    event: 'ORDER_SHIPPED',
    title: 'Your DJI Order #DJI-EU-100239 has dispatched with DHL Express',
    message: 'Your Mavic 4 Pro Fly More Combo has departed our Frankfurt Central Distribution Center (FRA-01). DHL Tracking: DHL-DE-983847273. Expected delivery tomorrow by 12:00 CET.',
    recipientEmail: 'lukas.keller@cinematography-eu.de',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    read: false,
    orderNumber: 'DJI-EU-100239'
  },
  {
    id: 'notif-002',
    type: 'sms',
    event: 'PAYMENT_CONFIRMED',
    title: 'SEPA Bank Transfer Confirmed',
    message: 'DJI Store EU: Bank wire of €2,998.00 received for order #DJI-EU-100239. Hardware allocated at FRA-01 warehouse.',
    recipientPhone: '+49 171 892 4410',
    timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
    read: true,
    orderNumber: 'DJI-EU-100239'
  },
  {
    id: 'notif-003',
    type: 'email',
    event: 'ORDER_CREATED',
    title: 'Order Confirmation — #DJI-EU-100239 (SEPA Instructions Attached)',
    message: 'Thank you for your order! Please transfer €2,998.00 to our German Commerzbank Frankfurt IBAN DE89 5004 ... with reference DJI-EU-100239.',
    recipientEmail: 'lukas.keller@cinematography-eu.de',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    read: true,
    orderNumber: 'DJI-EU-100239'
  },
  {
    id: 'notif-004',
    type: 'email',
    event: 'DELIVERED',
    title: 'Package Delivered — Order #DJI-EU-100188',
    message: 'DHL Express has delivered your DJI Mini 4 Pro to your address in Munich. Please register your aircraft serial in your account to activate your 2-Year European Warranty.',
    recipientEmail: 'lukas.keller@cinematography-eu.de',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    read: true,
    orderNumber: 'DJI-EU-100188'
  }
];

// ----------------------------------------------------
// Initial B2B Company & Quotation Data
// ----------------------------------------------------

export const INITIAL_B2B_PROFILE: B2bCompanyProfile = {
  companyName: 'Keller Aerial Cinema GmbH',
  vatId: 'DE389201948',
  viesStatus: 'valid',
  countryCode: 'DE',
  isReverseChargeEligible: false, // DE to DE is domestic 19% VAT, cross-border EU is 0% reverse charge
  contactPerson: 'Lukas Keller',
  billingEmail: 'billing@cinematography-eu.de',
  phone: '+49 171 892 4410',
  eoriNumber: 'DE892019480001'
};

export const INITIAL_B2B_QUOTES: B2bQuote[] = [
  {
    id: 'quote-001',
    quoteNumber: 'DJI-B2B-QUOTE-2026-9021',
    companyName: 'Keller Aerial Cinema GmbH',
    vatId: 'DE389201948',
    countryCode: 'DE',
    items: [
      {
        product: DJI_PRODUCTS[0],
        variant: DJI_PRODUCTS[0].variants[0],
        quantity: 3,
        unitPriceEur: 2699,
        discountPercent: 8
      }
    ],
    subtotalEur: 7449.24,
    discountEur: 647.76,
    vatEur: 1415.36,
    totalEur: 8864.60,
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    validUntil: new Date(Date.now() + 3600000 * 24 * 30).toISOString(),
    status: 'approved'
  }
];
