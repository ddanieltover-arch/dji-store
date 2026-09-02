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
    localeName: 'English (Europe)',
    flag: '🇪🇺',
    nav: {
      cameraDrones: 'Camera Drones',
      handheld: 'Handheld & Osmo',
      professional: 'Professional Cine',
      accessories: 'Accessories & Batteries',
      easaGuide: 'EASA Drone Regulations',
      compare: 'Compare Drones',
      trackOrder: 'Track Order',
      adminPortal: 'Admin Console'
    },
    announcement: '⚡ Official European DJI Stock • 2-Year Statutory EU Warranty • Free DHL Express on Orders Over €500',
    hero: {
      badge: 'New 2026 Flagship Release',
      buyNow: 'Buy Now — From €2,099',
      exploreTech: 'Explore Technology',
      freeShipping: 'Dispatched from German Hub • 2-Year EU Warranty'
    },
    trust: {
      warrantyTitle: '2-Year Official EU Warranty',
      warrantyDesc: 'Full statutory 24-month European warranty on all aircraft hardware and sensors.',
      shippingTitle: '24h-48h DHL Express',
      shippingDesc: 'Dispatched directly from our Frankfurt and Amsterdam logistics centers.',
      paymentTitle: 'Zero-Risk SEPA & Crypto',
      paymentDesc: 'Official European corporate bank wire and zero-fee Web3 cryptocurrency verification.',
      oemTitle: '100% Factory OEM Serial Numbers',
      oemDesc: 'Brand new, factory-sealed hardware with valid CE European flight compliance.'
    },
    cart: {
      title: 'Shopping Bag',
      empty: 'Your shopping bag is currently empty.',
      subtotal: 'Subtotal',
      vatIncluded: 'Prices in EUR',
      freeShippingUnlocked: '🎉 Free DHL Express Shipping Unlocked!',
      checkoutBtn: 'Proceed to Fast Guest Checkout'
    },
    checkout: {
      title: 'Fast Guest Checkout (No Account Required)',
      step1: '1. Contact & Recipient Details',
      step2: '2. European Delivery Destination',
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
    announcement: '⚡ Offizieller DJI EU Reseller • 2 Jahre gesetzliche Gewährleistung • Kostenloser DHL Express ab 500 €',
    hero: {
      badge: 'Neues Flaggschiff 2026',
      buyNow: 'Jetzt Kaufen — ab 2.099 €',
      exploreTech: 'Technologie Entdecken',
      freeShipping: 'Versand aus deutschem Warenlager • 2 Jahre Garantie'
    },
    trust: {
      warrantyTitle: '2 Jahre EU-Gewährleistung',
      warrantyDesc: 'Vollständige 24-monatige europäische Hersteller- und Händlergarantie.',
      shippingTitle: '24h–48h DHL Express',
      shippingDesc: 'Direkter Expressversand ab Logistikzentrum Frankfurt / Nürnberg.',
      paymentTitle: 'Sichere SEPA & Krypto-Zahlung',
      paymentDesc: 'Offizielles europäisches Firmenkonto (SEPA) sowie Web3-Krypto.',
      oemTitle: '100% Originalverpackte Neuware',
      oemDesc: 'Originale Werksseriennummern mit voller CE- und EASA-Konformität.'
    },
    cart: {
      title: 'Warenkorb',
      empty: 'Ihr Warenkorb ist derzeit leer.',
      subtotal: 'Zwischensumme',
      vatIncluded: 'Preise in EUR',
      freeShippingUnlocked: '🎉 Kostenloser DHL Expressversand freigeschaltet!',
      checkoutBtn: 'Zur Express-Kasse (Ohne Registrierung)'
    },
    checkout: {
      title: 'Schnellkasse für Gäste (Kein Kundenkonto nötig)',
      step1: '1. Kontaktdaten & Empfänger',
      step2: '2. Lieferadresse in Europa',
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
    announcement: '⚡ Stock Officiel Européen • Garantie 2 Ans UE • Livraison Express Gratuite dès 500 €',
    hero: {
      badge: 'Nouveau Fleuron 2026',
      buyNow: 'Commander — dès 2 099 €',
      exploreTech: 'Découvrir la Technologie',
      freeShipping: 'Expédié depuis l’Allemagne • Garantie Légale 2 Ans'
    },
    trust: {
      warrantyTitle: 'Garantie Légale 2 Ans',
      warrantyDesc: 'Couverture européenne complète de 24 mois sur le matériel et les capteurs.',
      shippingTitle: 'Livraison 24h–48h DHL',
      shippingDesc: 'Expédié rapidement depuis nos plateformes logistiques centrales.',
      paymentTitle: 'Paiement Sécurisé SEPA & Crypto',
      paymentDesc: 'Virement bancaire européen officiel et transactions Web3 sans frais.',
      oemTitle: '100% Neuf & Scellé d’Origine',
      oemDesc: 'Numéros de série OEM officiels conformes aux normes CE européennes.'
    },
    cart: {
      title: 'Panier d’Achat',
      empty: 'Votre panier est actuellement vide.',
      subtotal: 'Sous-total',
      vatIncluded: 'Prix en EUR',
      freeShippingUnlocked: '🎉 Livraison DHL Express Gratuite Débloquée !',
      checkoutBtn: 'Commander en Invité (Sans Compte)'
    },
    checkout: {
      title: 'Commande Invité Rapide (Aucun compte requis)',
      step1: '1. Coordonnées & Téléphone Transporteur',
      step2: '2. Adresse de Livraison en Europe',
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
    announcement: '⚡ Distribuidor Oficial DJI en Europa • 2 Años de Garantía • Envío DHL Gratis desde 500 €',
    hero: {
      badge: 'Nuevo Buque Insignia 2026',
      buyNow: 'Comprar — Desde 2.099 €',
      exploreTech: 'Explorar Tecnología',
      freeShipping: 'Envío desde almacén alemán • 2 Años de Garantía'
    },
    trust: {
      warrantyTitle: 'Garantía Oficial de 2 Años',
      warrantyDesc: '24 meses de cobertura legal en toda la Unión Europea.',
      shippingTitle: 'Envío Express 24h-48h',
      shippingDesc: 'Envíos rápidos con DHL Express directo desde Fráncfort.',
      paymentTitle: 'Pagos Seguros SEPA y Cripto',
      paymentDesc: 'Transferencia bancaria europea oficial o criptoactivos Web3 sin comisiones.',
      oemTitle: '100% Productos Originales DJI',
      oemDesc: 'Artículos precintados de fábrica con marcado CE de la UE.'
    },
    cart: {
      title: 'Cesta de Compra',
      empty: 'Tu cesta está vacía.',
      subtotal: 'Subtotal',
      vatIncluded: 'Precios en EUR',
      freeShippingUnlocked: '🎉 ¡Envío DHL Express Gratis Activado!',
      checkoutBtn: 'Tramitar Pedido como Invitado'
    },
    checkout: {
      title: 'Pago Rápido de Invitado (Sin Registro Obligatorio)',
      step1: '1. Datos de Contacto y Teléfono',
      step2: '2. Dirección de Entrega en Europa',
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
    announcement: '⚡ Rivenditore Ufficiale DJI Europa • 2 Anni di Garanzia • Spedizione Gratuita oltre 500 €',
    hero: {
      badge: 'Nuovo Flagship 2026',
      buyNow: 'Acquista Ora — da 2.099 €',
      exploreTech: 'Esplora Tecnologia',
      freeShipping: 'Spedito dalla Germania • 2 Anni di Garanzia'
    },
    trust: {
      warrantyTitle: '2 Anni di Garanzia Europea',
      warrantyDesc: 'Garanzia legale di 24 mesi su tutti i sensori e droni.',
      shippingTitle: 'Spedizione DHL 24h-48h',
      shippingDesc: 'Consegna rapida in tutta Europa direttamente dai nostri magazzini.',
      paymentTitle: 'Bonifico SEPA e Cripto Sicuri',
      paymentDesc: 'Conto aziendale europeo ufficiale e pagamenti crypto Web3 senza commissioni.',
      oemTitle: '100% Prodotti Originali Sigillati',
      oemDesc: 'Seriale originale di fabbrica con conformità europea CE.'
    },
    cart: {
      title: 'Carrello',
      empty: 'Il tuo carrello è vuoto.',
      subtotal: 'Subtotale',
      vatIncluded: 'Prezzi in EUR',
      freeShippingUnlocked: '🎉 Spedizione DHL Express Gratuita Sbloccata!',
      checkoutBtn: 'Cassa Rapida Ospite (Senza Registrazione)'
    },
    checkout: {
      title: 'Checkout Veloce per Ospiti',
      step1: '1. Dati del Destinatario',
      step2: '2. Indirizzo di Consegna',
      step3: '3. Metodo di Pagamento',
      placeOrder: 'Invia Ordine e Ricevi Coordinate',
      bankTransfer: 'Bonifico Bancario SEPA',
      cryptoPayment: 'Pagamento Criptovaluta (USDT / BTC)'
    }
  },
  nl: {
    localeName: 'Nederlands (Nederland / België)',
    flag: '🇳🇱',
    nav: {
      cameraDrones: 'Cameradrones',
      handheld: 'Handheld & Osmo',
      professional: 'Professioneel Cinema',
      accessories: 'Accessoires & Accu’s',
      easaGuide: 'EASA Regelgeving',
      compare: 'Drones Vergelijken',
      trackOrder: 'Bestelling Volgen',
      adminPortal: 'Beheerderspaneel'
    },
    announcement: '⚡ Officiële Europese DJI Dealer • 2 Jaar Wettelijke Garantie • Gratis DHL Express vanaf €500',
    hero: {
      badge: 'Nieuw Vlaggenschip 2026',
      buyNow: 'Bestel Nu — vanaf € 2.099',
      exploreTech: 'Ontdek Technologie',
      freeShipping: 'Verzonden vanuit Duitsland • 2 Jaar Garantie'
    },
    trust: {
      warrantyTitle: '2 Jaar Officiële EU Garantie',
      warrantyDesc: '24 maanden volledige wettelijke garantie op alle hardware.',
      shippingTitle: '24u–48u DHL Express Levering',
      shippingDesc: 'Snelle verzending rechtstreeks vanuit onze distributiecentra.',
      paymentTitle: 'Veilige SEPA & Crypto Betaling',
      paymentDesc: 'Officiële Europese zakelijke bankoverschrijving of Web3 crypto zonder kosten.',
      oemTitle: '100% Fabrieksverzegeld Origineel',
      oemDesc: 'Originele serienummers met officiële Europese CE-markering.'
    },
    cart: {
      title: 'Winkelwagen',
      empty: 'Je winkelwagen is momenteel leeg.',
      subtotal: 'Subtotaal',
      vatIncluded: 'Prijzen in EUR',
      freeShippingUnlocked: '🎉 Gratis DHL Express Verzending Geactiveerd!',
      checkoutBtn: 'Direct Afrekenen als Gast'
    },
    checkout: {
      title: 'Snelle Gast-Checkout (Geen Account Nodig)',
      step1: '1. Contactgegevens & Telefoonnummer',
      step2: '2. Bezorgadres in Europa',
      step3: '3. Betaalmethode (SEPA of Crypto)',
      placeOrder: 'Bestelling Plaatsen & Gegevens Ontvangen',
      bankTransfer: 'SEPA-bankoverschrijving',
      cryptoPayment: 'Directe Crypto Betaling (USDT / BTC)'
    }
  }
};
