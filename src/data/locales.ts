import { Locale } from '../types';

export interface TranslationDict {
  localeName: string;
  flag: string;
  nav: {
    cameraDrones: string;
    handheld: string;
    professional: string;
    accessories: string;
    easaGuide: string;
    compare: string;
    trackOrder: string;
    adminPortal: string;
  };
  announcement: string;
  hero: {
    badge: string;
    buyNow: string;
    exploreTech: string;
    freeShipping: string;
  };
  trust: {
    warrantyTitle: string;
    warrantyDesc: string;
    shippingTitle: string;
    shippingDesc: string;
    paymentTitle: string;
    paymentDesc: string;
    oemTitle: string;
    oemDesc: string;
  };
  cart: {
    title: string;
    empty: string;
    subtotal: string;
    vatIncluded: string;
    freeShippingUnlocked: string;
    checkoutBtn: string;
  };
  checkout: {
    title: string;
    step1: string;
    step2: string;
    step3: string;
    placeOrder: string;
    bankTransfer: string;
    cryptoPayment: string;
  };
}

export const LOCALES: Record<Locale, TranslationDict> = {
  en: {
    localeName: 'English (Netherlands)',
    flag: '🇳🇱',
    nav: {
      cameraDrones: 'Camera Drones',
      handheld: 'Handheld & Osmo',
      professional: 'Professional Cine',
      accessories: 'Accessories & Batteries',
      easaGuide: 'EASA / NL Drone Rules',
      compare: 'Compare Drones',
      trackOrder: 'Track Order',
      adminPortal: 'Admin Console'
    },
    announcement: '⚡ Official DJI Stock for the Netherlands • 2-Year Statutory EU Warranty • Free Express on Orders Over €500',
    hero: {
      badge: 'New 2026 Flagship Release',
      buyNow: 'Buy Now — From €2,099',
      exploreTech: 'Explore Technology',
      freeShipping: 'Dispatched from Amsterdam • 2-Year EU Warranty'
    },
    trust: {
      warrantyTitle: '2-Year Official EU Warranty',
      warrantyDesc: 'Full statutory 24-month EU consumer warranty on all aircraft hardware and sensors.',
      shippingTitle: 'Next-Day NL Express',
      shippingDesc: 'Dispatched from our Amsterdam Schiphol logistics hub via PostNL, DHL and partners.',
      paymentTitle: 'Zero-Risk SEPA & Crypto',
      paymentDesc: 'Dutch SEPA bank wire and zero-fee Web3 cryptocurrency verification.',
      oemTitle: '100% Factory OEM Serial Numbers',
      oemDesc: 'Brand new, factory-sealed hardware with valid CE marking for EU/NL flight compliance.'
    },
    cart: {
      title: 'Shopping Bag',
      empty: 'Your shopping bag is currently empty.',
      subtotal: 'Subtotal',
      vatIncluded: 'Prices in EUR',
      freeShippingUnlocked: '🎉 Free Netherlands Express Shipping Unlocked!',
      checkoutBtn: 'Proceed to Fast Guest Checkout'
    },
    checkout: {
      title: 'Fast Guest Checkout (No Account Required)',
      step1: '1. Contact & Recipient Details',
      step2: '2. Delivery Address (Netherlands)',
      step3: '3. Payment Method (SEPA or Crypto)',
      placeOrder: 'Confirm Order & Generate Reference',
      bankTransfer: 'SEPA Bank Wire Transfer',
      cryptoPayment: 'Direct Web3 Cryptocurrency (USDT / BTC / ETH)'
    }
  },
  de: {
    localeName: 'Deutsch (Deutschland / Österreich)',
    flag: '🇩🇪',
    nav: {
      cameraDrones: 'Kameradrohnen',
      handheld: 'Handheld & Gimbal',
      professional: 'Profisysteme',
      accessories: 'Zubehör & Akkus',
      easaGuide: 'EASA Drohnenregeln',
      compare: 'Drohnen Vergleichen',
      trackOrder: 'Sendungsverfolgung',
      adminPortal: 'Admin-Portal'
    },
    announcement: '⚡ Offizieller DJI Reseller für die Niederlande • 2 Jahre gesetzliche Gewährleistung • Kostenloser Express ab 500 €',
    hero: {
      badge: 'Neues Flaggschiff 2026',
      buyNow: 'Jetzt Kaufen — ab 2.099 €',
      exploreTech: 'Technologie Entdecken',
      freeShipping: 'Versand aus Amsterdam • 2 Jahre Garantie'
    },
    trust: {
      warrantyTitle: '2 Jahre EU-Gewährleistung',
      warrantyDesc: 'Vollständige 24-monatige gesetzliche EU-Garantie.',
      shippingTitle: '24h–48h Express NL',
      shippingDesc: 'Direkter Expressversand ab Logistikzentrum Amsterdam Schiphol.',
      paymentTitle: 'Sichere SEPA & Krypto-Zahlung',
      paymentDesc: 'Niederländisches SEPA-Firmenkonto sowie Web3-Krypto.',
      oemTitle: '100% Originalverpackte Neuware',
      oemDesc: 'Originale Werksseriennummern mit voller CE- und EASA-Konformität.'
    },
    cart: {
      title: 'Warenkorb',
      empty: 'Ihr Warenkorb ist derzeit leer.',
      subtotal: 'Zwischensumme',
      vatIncluded: 'Preise in EUR',
      freeShippingUnlocked: '🎉 Kostenloser NL-Expressversand freigeschaltet!',
      checkoutBtn: 'Zur Express-Kasse (Ohne Registrierung)'
    },
    checkout: {
      title: 'Schnellkasse für Gäste (Kein Kundenkonto nötig)',
      step1: '1. Kontaktdaten & Empfänger',
      step2: '2. Lieferadresse (Niederlande)',
      step3: '3. Zahlungsart (SEPA oder Krypto)',
      placeOrder: 'Bestellung absenden & Zahlungsdaten generieren',
      bankTransfer: 'SEPA-Banküberweisung',
      cryptoPayment: 'Kryptowährungszahlung (USDT / BTC / ETH)'
    }
  },
  fr: {
    localeName: 'Français (France / Belgique)',
    flag: '🇫🇷',
    nav: {
      cameraDrones: 'Drones Caméra',
      handheld: 'Caméras & Stabilisateurs',
      professional: 'Cinéma Professionnel',
      accessories: 'Accessoires & Batteries',
      easaGuide: 'Réglementation EASA',
      compare: 'Comparer les Drones',
      trackOrder: 'Suivi de Commande',
      adminPortal: 'Portail Admin'
    },
    announcement: '⚡ Revendeur DJI officiel pour les Pays-Bas • Garantie 2 Ans UE • Livraison Express Gratuite dès 500 €',
    hero: {
      badge: 'Nouveau Fleuron 2026',
      buyNow: 'Commander — dès 2 099 €',
      exploreTech: 'Découvrir la Technologie',
      freeShipping: 'Expédié depuis Amsterdam • Garantie Légale 2 Ans'
    },
    trust: {
      warrantyTitle: 'Garantie Légale 2 Ans',
      warrantyDesc: 'Couverture UE complète de 24 mois sur le matériel et les capteurs.',
      shippingTitle: 'Livraison Express NL',
      shippingDesc: 'Expédié rapidement depuis notre hub logistique d’Amsterdam Schiphol.',
      paymentTitle: 'Paiement Sécurisé SEPA & Crypto',
      paymentDesc: 'Virement SEPA néerlandais et transactions Web3 sans frais.',
      oemTitle: '100% Neuf & Scellé d’Origine',
      oemDesc: 'Numéros de série OEM officiels conformes aux normes CE.'
    },
    cart: {
      title: 'Panier d’Achat',
      empty: 'Votre panier est actuellement vide.',
      subtotal: 'Sous-total',
      vatIncluded: 'Prix en EUR',
      freeShippingUnlocked: '🎉 Livraison Express Pays-Bas Débloquée !',
      checkoutBtn: 'Commander en Invité (Sans Compte)'
    },
    checkout: {
      title: 'Commande Invité Rapide (Aucun compte requis)',
      step1: '1. Coordonnées & Téléphone Transporteur',
      step2: '2. Adresse de Livraison (Pays-Bas)',
      step3: '3. Méthode de Paiement (SEPA ou Crypto)',
      placeOrder: 'Valider la commande & obtenir l’IBAN',
      bankTransfer: 'Virement bancaire SEPA',
      cryptoPayment: 'Paiement Cryptomonnaie Direct (USDT / BTC)'
    }
  },
  es: {
    localeName: 'Español (España)',
    flag: '🇪🇸',
    nav: {
      cameraDrones: 'Drones con Cámara',
      handheld: 'Dispositivos de Mano',
      professional: 'Cine Profesional',
      accessories: 'Accesorios y Baterías',
      easaGuide: 'Normativa EASA',
      compare: 'Comparar Drones',
      trackOrder: 'Seguimiento',
      adminPortal: 'Administración'
    },
    announcement: '⚡ Distribuidor Oficial DJI en Países Bajos • 2 Años de Garantía • Envío Express Gratis desde 500 €',
    hero: {
      badge: 'Nuevo Buque Insignia 2026',
      buyNow: 'Comprar — Desde 2.099 €',
      exploreTech: 'Explorar Tecnología',
      freeShipping: 'Envío desde Ámsterdam • 2 Años de Garantía'
    },
    trust: {
      warrantyTitle: 'Garantía Oficial de 2 Años',
      warrantyDesc: '24 meses de cobertura legal conforme a la UE.',
      shippingTitle: 'Envío Express NL',
      shippingDesc: 'Envíos rápidos desde nuestro hub logístico de Ámsterdam Schiphol.',
      paymentTitle: 'Pagos Seguros SEPA y Cripto',
      paymentDesc: 'Transferencia bancaria SEPA neerlandesa o criptoactivos Web3 sin comisiones.',
      oemTitle: '100% Productos Originales DJI',
      oemDesc: 'Artículos precintados de fábrica con marcado CE.'
    },
    cart: {
      title: 'Cesta de Compra',
      empty: 'Tu cesta está vacía.',
      subtotal: 'Subtotal',
      vatIncluded: 'Precios en EUR',
      freeShippingUnlocked: '🎉 ¡Envío Express Países Bajos Activado!',
      checkoutBtn: 'Tramitar Pedido como Invitado'
    },
    checkout: {
      title: 'Pago Rápido de Invitado (Sin Registro Obligatorio)',
      step1: '1. Datos de Contacto y Teléfono',
      step2: '2. Dirección de Entrega (Países Bajos)',
      step3: '3. Forma de Pago (SEPA o Cripto)',
      placeOrder: 'Confirmar Pedido y Generar Referencia',
      bankTransfer: 'Transferencia Bancaria SEPA',
      cryptoPayment: 'Pago Directo en Criptomonedas (USDT / BTC)'
    }
  },
  it: {
    localeName: 'Italiano (Italia)',
    flag: '🇮🇹',
    nav: {
      cameraDrones: 'Droni con Fotocamera',
      handheld: 'Dispositivi Portatili',
      professional: 'Sistemi Professionali',
      accessories: 'Accessori e Batterie',
      easaGuide: 'Normativa EASA',
      compare: 'Confronta Droni',
      trackOrder: 'Traccia Ordine',
      adminPortal: 'Pannello Admin'
    },
    announcement: '⚡ Rivenditore Ufficiale DJI per i Paesi Bassi • 2 Anni di Garanzia • Spedizione Gratuita oltre 500 €',
    hero: {
      badge: 'Nuovo Flagship 2026',
      buyNow: 'Acquista Ora — da 2.099 €',
      exploreTech: 'Esplora Tecnologia',
      freeShipping: 'Spedito da Amsterdam • 2 Anni di Garanzia'
    },
    trust: {
      warrantyTitle: '2 Anni di Garanzia UE',
      warrantyDesc: 'Garanzia legale di 24 mesi su tutti i sensori e droni.',
      shippingTitle: 'Spedizione Express NL',
      shippingDesc: 'Consegna rapida dal nostro hub logistico di Amsterdam Schiphol.',
      paymentTitle: 'Bonifico SEPA e Cripto Sicuri',
      paymentDesc: 'Conto aziendale SEPA olandese e pagamenti crypto Web3 senza commissioni.',
      oemTitle: '100% Prodotti Originali Sigillati',
      oemDesc: 'Seriale originale di fabbrica con conformità CE.'
    },
    cart: {
      title: 'Carrello',
      empty: 'Il tuo carrello è vuoto.',
      subtotal: 'Subtotale',
      vatIncluded: 'Prezzi in EUR',
      freeShippingUnlocked: '🎉 Spedizione Express Paesi Bassi Sbloccata!',
      checkoutBtn: 'Cassa Rapida Ospite (Senza Registrazione)'
    },
    checkout: {
      title: 'Checkout Veloce per Ospiti',
      step1: '1. Dati del Destinatario',
      step2: '2. Indirizzo di Consegna (Paesi Bassi)',
      step3: '3. Metodo di Pagamento',
      placeOrder: 'Invia Ordine e Ricevi Coordinate',
      bankTransfer: 'Bonifico Bancario SEPA',
      cryptoPayment: 'Pagamento Criptovaluta (USDT / BTC)'
    }
  },
  nl: {
    localeName: 'Nederlands (Nederland)',
    flag: '🇳🇱',
    nav: {
      cameraDrones: 'Cameradrones',
      handheld: 'Handheld & Osmo',
      professional: 'Professioneel Cinema',
      accessories: 'Accessoires & Accu’s',
      easaGuide: 'EASA / NL Regelgeving',
      compare: 'Drones Vergelijken',
      trackOrder: 'Bestelling Volgen',
      adminPortal: 'Beheerderspaneel'
    },
    announcement: '⚡ Officiële DJI voorraad voor Nederland • 2 Jaar Wettelijke Garantie • Gratis Express vanaf €500',
    hero: {
      badge: 'Nieuw Vlaggenschip 2026',
      buyNow: 'Bestel Nu — vanaf € 2.099',
      exploreTech: 'Ontdek Technologie',
      freeShipping: 'Verzonden vanuit Amsterdam • 2 Jaar Garantie'
    },
    trust: {
      warrantyTitle: '2 Jaar Officiële EU Garantie',
      warrantyDesc: '24 maanden volledige wettelijke garantie op alle hardware.',
      shippingTitle: 'Snelle NL Express Levering',
      shippingDesc: 'Verzending vanuit ons Amsterdam Schiphol-distributiecentrum via PostNL, DHL en partners.',
      paymentTitle: 'Veilige SEPA & Crypto Betaling',
      paymentDesc: 'Nederlandse SEPA-bankoverschrijving of Web3 crypto zonder kosten.',
      oemTitle: '100% Fabrieksverzegeld Origineel',
      oemDesc: 'Originele serienummers met officiële CE-markering voor EU/NL-luchtvaartregels.'
    },
    cart: {
      title: 'Winkelwagen',
      empty: 'Je winkelwagen is momenteel leeg.',
      subtotal: 'Subtotaal',
      vatIncluded: 'Prijzen in EUR',
      freeShippingUnlocked: '🎉 Gratis Nederlandse Express Verzending Geactiveerd!',
      checkoutBtn: 'Direct Afrekenen als Gast'
    },
    checkout: {
      title: 'Snelle Gast-Checkout (Geen Account Nodig)',
      step1: '1. Contactgegevens & Telefoonnummer',
      step2: '2. Bezorgadres in Nederland',
      step3: '3. Betaalmethode (SEPA of Crypto)',
      placeOrder: 'Bestelling Plaatsen & Gegevens Ontvangen',
      bankTransfer: 'SEPA-bankoverschrijving',
      cryptoPayment: 'Directe Crypto Betaling (USDT / BTC)'
    }
  }
};
