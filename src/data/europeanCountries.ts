export interface CountryOption {
  code: string;
  name: string;
}

/** Sovereign states and European territories — alphabetical by English name. */
export const EUROPEAN_COUNTRIES: CountryOption[] = [
  { code: 'AL', name: 'Albania (Shqipëria)' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AM', name: 'Armenia (Հայաստան)' },
  { code: 'AT', name: 'Austria (Österreich)' },
  { code: 'AZ', name: 'Azerbaijan (Azərbaycan)' },
  { code: 'BY', name: 'Belarus (Беларусь)' },
  { code: 'BE', name: 'Belgium (België / Belgique)' },
  { code: 'BA', name: 'Bosnia and Herzegovina (Bosna i Hercegovina)' },
  { code: 'BG', name: 'Bulgaria (България)' },
  { code: 'HR', name: 'Croatia (Hrvatska)' },
  { code: 'CY', name: 'Cyprus (Κύπρος / Kıbrıs)' },
  { code: 'CZ', name: 'Czechia (Česko)' },
  { code: 'DK', name: 'Denmark (Danmark)' },
  { code: 'EE', name: 'Estonia (Eesti)' },
  { code: 'FO', name: 'Faroe Islands (Føroyar)' },
  { code: 'FI', name: 'Finland (Suomi)' },
  { code: 'FR', name: 'France' },
  { code: 'GE', name: 'Georgia (საქართველო)' },
  { code: 'DE', name: 'Germany (Deutschland)' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GR', name: 'Greece (Ελλάδα)' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'HU', name: 'Hungary (Magyarország)' },
  { code: 'IS', name: 'Iceland (Ísland)' },
  { code: 'IE', name: 'Ireland (Éire)' },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'IT', name: 'Italy (Italia)' },
  { code: 'JE', name: 'Jersey' },
  { code: 'KZ', name: 'Kazakhstan (Қазақстан)' },
  { code: 'XK', name: 'Kosovo (Kosovë / Kosovo)' },
  { code: 'LV', name: 'Latvia (Latvija)' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania (Lietuva)' },
  { code: 'LU', name: 'Luxembourg (Luxembourg / Lëtzebuerg)' },
  { code: 'MT', name: 'Malta' },
  { code: 'MD', name: 'Moldova (Republica Moldova)' },
  { code: 'MC', name: 'Monaco' },
  { code: 'ME', name: 'Montenegro (Crna Gora)' },
  { code: 'NL', name: 'Netherlands (Nederland)' },
  { code: 'MK', name: 'North Macedonia (Северна Македонија)' },
  { code: 'NO', name: 'Norway (Norge)' },
  { code: 'PL', name: 'Poland (Polska)' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania (România)' },
  { code: 'RU', name: 'Russia (Россия)' },
  { code: 'SM', name: 'San Marino' },
  { code: 'RS', name: 'Serbia (Srbija)' },
  { code: 'SK', name: 'Slovakia (Slovensko)' },
  { code: 'SI', name: 'Slovenia (Slovenija)' },
  { code: 'ES', name: 'Spain (España)' },
  { code: 'SE', name: 'Sweden (Sverige)' },
  { code: 'CH', name: 'Switzerland (Schweiz / Suisse / Svizzera)' },
  { code: 'TR', name: 'Türkiye' },
  { code: 'UA', name: 'Ukraine (Україна)' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'VA', name: 'Vatican City (Città del Vaticano)' }
];

export const ANY_OTHER_COUNTRY: CountryOption = {
  code: 'OTHER',
  name: 'Any other country'
};

/** Full checkout destination list: all European countries, then any other country. */
export const CHECKOUT_COUNTRIES: CountryOption[] = [...EUROPEAN_COUNTRIES, ANY_OTHER_COUNTRY];

export function findCheckoutCountry(code: string): CountryOption {
  return CHECKOUT_COUNTRIES.find((c) => c.code === code) ?? EUROPEAN_COUNTRIES.find((c) => c.code === 'DE')!;
}
