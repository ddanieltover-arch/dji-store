import { WarehouseDepot, VariantDepotStock } from '../types';

export const EUROPEAN_WAREHOUSES: WarehouseDepot[] = [
  {
    id: 'depot-fra-01',
    code: 'FRA-01',
    name: 'Frankfurt Central Distribution Center',
    countryCode: 'DE',
    city: 'Frankfurt am Main',
    isPrimaryHub: true,
    transitDaysToEu: {
      DE: 1,
      FR: 2,
      NL: 1,
      BE: 1,
      IT: 2,
      ES: 2,
      AT: 1,
      CH: 2,
      DK: 2,
      SE: 3,
      PL: 2
    },
    carrierService: 'DHL Express European Direct Air',
    cutoffTimeUtc: '16:00'
  },
  {
    id: 'depot-ams-02',
    code: 'AMS-02',
    name: 'Amsterdam Schiphol Aviation Logistics',
    countryCode: 'NL',
    city: 'Amsterdam',
    isPrimaryHub: false,
    transitDaysToEu: {
      DE: 1,
      FR: 2,
      NL: 1,
      BE: 1,
      IT: 3,
      ES: 3,
      AT: 2,
      CH: 2,
      DK: 1,
      SE: 2,
      PL: 2
    },
    carrierService: 'DPD Benelux Priority Cargo',
    cutoffTimeUtc: '17:30'
  },
  {
    id: 'depot-cdg-03',
    code: 'CDG-03',
    name: 'Paris Charles de Gaulle Air Terminal',
    countryCode: 'FR',
    city: 'Roissy-en-France',
    isPrimaryHub: false,
    transitDaysToEu: {
      DE: 2,
      FR: 1,
      NL: 2,
      BE: 1,
      IT: 2,
      ES: 2,
      AT: 2,
      CH: 2,
      DK: 3,
      SE: 3,
      PL: 3
    },
    carrierService: 'Chronopost Express France/Iberia',
    cutoffTimeUtc: '15:30'
  }
];

export const INITIAL_DEPOT_STOCK: Record<string, VariantDepotStock[]> = {
  'var-m4p-std': [
    {
      depotId: 'depot-fra-01',
      stockUnits: 18,
      reservedUnits: 2,
      incomingUnits: 40,
      incomingEtaDate: '2026-08-22',
      reorderPoint: 5,
      backorderAllowed: true,
      batchDispatchDate: '2026-08-15'
    },
    {
      depotId: 'depot-ams-02',
      stockUnits: 6,
      reservedUnits: 0,
      incomingUnits: 20,
      incomingEtaDate: '2026-08-24',
      reorderPoint: 3,
      backorderAllowed: true
    }
  ],
  'var-m4p-fmc': [
    {
      depotId: 'depot-fra-01',
      stockUnits: 32,
      reservedUnits: 5,
      incomingUnits: 60,
      incomingEtaDate: '2026-08-20',
      reorderPoint: 8,
      backorderAllowed: true,
      batchDispatchDate: '2026-08-15'
    },
    {
      depotId: 'depot-ams-02',
      stockUnits: 12,
      reservedUnits: 1,
      incomingUnits: 30,
      incomingEtaDate: '2026-08-23',
      reorderPoint: 4,
      backorderAllowed: true
    },
    {
      depotId: 'depot-cdg-03',
      stockUnits: 8,
      reservedUnits: 0,
      incomingUnits: 15,
      incomingEtaDate: '2026-08-25',
      reorderPoint: 3,
      backorderAllowed: true
    }
  ],
  'var-m4p-cine': [
    {
      depotId: 'depot-fra-01',
      stockUnits: 4, // Low stock simulation!
      reservedUnits: 2,
      incomingUnits: 25,
      incomingEtaDate: '2026-08-26',
      reorderPoint: 5,
      backorderAllowed: true,
      batchDispatchDate: '2026-08-28'
    }
  ]
};

export function getEstimatedDeliveryTime(destinationCountry: string = 'DE'): {
  dispatchHours: number;
  deliveryDaysText: string;
  optimalDepot: WarehouseDepot;
} {
  const dest = (destinationCountry || 'DE').toUpperCase() as keyof WarehouseDepot['transitDaysToEu'];
  const primary = EUROPEAN_WAREHOUSES[0]; // Frankfurt
  const transitDays = primary.transitDaysToEu[dest] || 2;

  return {
    dispatchHours: 3, // Dispatches within 3 hours from Frankfurt
    deliveryDaysText: transitDays === 1 ? 'Next Business Day (24h)' : `${transitDays} Business Days (48h)`,
    optimalDepot: primary
  };
}
