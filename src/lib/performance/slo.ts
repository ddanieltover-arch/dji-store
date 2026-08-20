import { SloDefinition } from '../../types/performanceReliability';

export function errorBudgetBurnAlert(slo: SloDefinition): 'page' | 'ticket' | 'none' {
  if (slo.status === 'breached' || slo.errorBudgetRemainingPct < 10) return 'page';
  if (slo.status === 'at_risk' || slo.errorBudgetRemainingPct < 25) return 'ticket';
  return 'none';
}

export const SYNTHETIC_PROBES = [
  { name: 'homepage_de', url: 'https://djii.eu/de', intervalSec: 60 },
  { name: 'plp_camera', url: 'https://djii.eu/de/c/camera-drones', intervalSec: 60 },
  { name: 'checkout_health', url: 'https://djii.eu/api/health/checkout', intervalSec: 30 },
  { name: 'search_omnibar', url: 'https://djii.eu/api/search?q=mini', intervalSec: 30 }
];
