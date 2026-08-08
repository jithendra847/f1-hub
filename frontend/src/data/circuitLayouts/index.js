import openf1Data from './openf1Layouts.json';

/**
 * Real OpenF1 Telemetry Circuit Layout Resolver
 * Map Ergast / FastF1 / OpenF1 circuit names and IDs directly to real-world OpenF1 GPS telemetry track vectors.
 */

// Key mapping from circuit keys or alias strings to openf1Data entries
const circuitKeyAliasMap = {
  // Bahrain (63)
  '63': '63',
  'sakhir': '63',
  'bahrain': '63',
  'bahrain_international_circuit': '63',

  // Jeddah (149)
  '149': '149',
  'jeddah': '149',
  'saudi': '149',
  'jeddah_corniche_circuit': '149',

  // Melbourne (10)
  '10': '10',
  'melbourne': '10',
  'albert_park': '10',
  'australia': '10',
  'albert_park_circuit': '10',

  // Suzuka (46)
  '46': '46',
  'suzuka': '46',
  'japan': '46',
  'suzuka_circuit': '46',

  // Shanghai (49)
  '49': '49',
  'shanghai': '49',
  'china': '49',
  'shanghai_international_circuit': '49',

  // Miami (151)
  '151': '151',
  'miami': '151',
  'miami_international_autodrome': '151',

  // Imola (6)
  '6': '6',
  'imola': '6',
  'emilia_romagna': '6',
  'autodromo_enzo_e_dino_ferrari': '6',

  // Monaco (22)
  '22': '22',
  'monaco': '22',
  'monte_carlo': '22',
  'circuit_de_monaco': '22',

  // Montreal (23)
  '23': '23',
  'montreal': '23',
  'montréal': '23',
  'canada': '23',
  'villeneuve': '23',
  'circuit_gilles_villeneuve': '23',

  // Barcelona / Catalunya (15)
  '15': '15',
  'catalunya': '15',
  'barcelona': '15',
  'spain': '15',
  'circuit_de_barcelona_catalunya': '15',

  // Spielberg / Red Bull Ring (19)
  '19': '19',
  'spielberg': '19',
  'austria': '19',
  'red_bull_ring': '19',

  // Silverstone (2)
  '2': '2',
  'silverstone': '2',
  'uk': '2',
  'british': '2',
  'silverstone_circuit': '2',

  // Hungaroring (4)
  '4': '4',
  'hungaroring': '4',
  'budapest': '4',
  'hungary': '4',

  // Spa-Francorchamps (7)
  '7': '7',
  'spa': '7',
  'spa-francorchamps': '7',
  'stavelot': '7',
  'belgium': '7',
  'circuit_de_spa_francorchamps': '7',

  // Zandvoort (55)
  '55': '55',
  'zandvoort': '55',
  'dutch': '55',
  'netherlands': '55',
  'circuit_zandvoort': '55',

  // Monza (39)
  '39': '39',
  'monza': '39',
  'italy': '39',
  'autodromo_nazionale_monza': '39',

  // Baku (144)
  '144': '144',
  'baku': '144',
  'azerbaijan': '144',
  'baku_city_circuit': '144',

  // Singapore (61)
  '61': '61',
  'singapore': '61',
  'marina_bay': '61',
  'marina_bay_street_circuit': '61',

  // Austin / COTA (9)
  '9': '9',
  'austin': '9',
  'cota': '9',
  'americas': '9',
  'circuit_of_the_americas': '9',

  // Mexico City (65)
  '65': '65',
  'mexico': '65',
  'rodriguez': '65',
  'autódromo_hermanos_rodríguez': '65',

  // Interlagos / São Paulo (14)
  '14': '14',
  'interlagos': '14',
  'brazil': '14',
  'são_paulo': '14',
  'sao_paulo': '14',
  'autódromo_josé_carlos_pace': '14',

  // Las Vegas (152)
  '152': '152',
  'vegas': '152',
  'las_vegas': '152',
  'las_vegas_strip_circuit': '152',

  // Lusail / Qatar (150)
  '150': '150',
  'lusail': '150',
  'qatar': '150',
  'lusail_international_circuit': '150',

  // Yas Marina / Abu Dhabi (70)
  '70': '70',
  'yas_marina': '70',
  'abu_dhabi': '70',
  'yas_island': '70',
  'yas_marina_circuit': '70'
};

export function getCircuitLayout(circuitIdOrName) {
  if (!circuitIdOrName) return null;
  
  const rawStr = String(circuitIdOrName).toLowerCase().trim();
  const normalizedStr = rawStr.replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');

  // Direct match by OpenF1 circuitKey or mapped alias
  if (normalizedStr in circuitKeyAliasMap) {
    const key = circuitKeyAliasMap[normalizedStr];
    if (openf1Data[key]) return openf1Data[key];
  }

  // Fallback fuzzy search through openf1Data values
  for (const [key, layout] of Object.entries(openf1Data)) {
    const lId = (layout.circuitId || '').toLowerCase();
    const lLoc = (layout.locality || '').toLowerCase();
    const lCty = (layout.country || '').toLowerCase();
    const lName = (layout.name || '').toLowerCase();

    if (
      rawStr === key ||
      rawStr === lId ||
      rawStr.includes(lId) ||
      rawStr.includes(lLoc) ||
      rawStr.includes(lCty) ||
      lName.includes(rawStr)
    ) {
      return layout;
    }
  }

  return null;
}

export const circuitLayouts = openf1Data;
