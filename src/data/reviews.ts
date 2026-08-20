import { ProductReview, ReviewRatingSummary } from '../types';

export const INITIAL_REVIEWS: ProductReview[] = [
  // Mavic 4 Pro Reviews
  {
    id: 'rev-m4p-01',
    productId: 'prod-mavic-4-pro',
    authorName: 'Lukas Weimann',
    authorLocation: 'Munich, Germany',
    countryCode: 'DE',
    rating: 5,
    title: 'Hasselblad 8K HDR is a generational leap for commercial aerial cinematography',
    content:
      'We shoot commercial tourism and architectural projects across Bavaria and the Alps. Upgrading from the Mavic 3 Pro to Mavic 4 Pro was an immediate game-changer: the dual-telephoto sharpness at 7x and 28x is unbelievably crisp, O4+ transmission penetrated heavy valley interference with zero lag, and the C1 label makes filing authorizations in European Open Category A1 hassle-free.',
    pros: [
      'Stunning Hasselblad 8K 60fps ProRes colors',
      'True 46-minute real-world battery endurance',
      'Official EASA Class C1 certification plate',
      'Night APAS 5.0 360-degree obstacle detection'
    ],
    cons: ['Fly More Combo with DJI RC 2 is heavier in the travel backpack'],
    verifiedPurchase: true,
    verifiedSerialNumber: '1581F4Q82903EU',
    pilotCertification: 'A1/A3 Open',
    flightHours: 148,
    helpfulVotes: 42,
    unhelpfulVotes: 1,
    userVotedHelpful: false,
    media: [
      {
        id: 'med-01',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
        caption: 'Alps sunrise capture at 120m altitude with 70mm medium telephoto.'
      },
      {
        id: 'med-02',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
        caption: 'O4+ crystal clear stream at 4.2km standoff distance.'
      }
    ],
    status: 'approved',
    createdAt: '2026-07-28T14:22:00Z',
    adminResponse: {
      author: 'DJI Store EU Technical Support (Frankfurt)',
      date: '2026-07-29T09:15:00Z',
      message:
        'Thank you Lukas! We are thrilled to hear that the Class C1 approval and Hasselblad color profiles are streamlining your Bavarian productions. Safe flights!'
    }
  },
  {
    id: 'rev-m4p-02',
    productId: 'prod-mavic-4-pro',
    authorName: 'Camille Dubois',
    authorLocation: 'Lyon, France',
    countryCode: 'FR',
    rating: 5,
    title: 'Flawless 4K 120fps slow-motion and rock-solid wind resistance in Rhone valley',
    content:
      'Arrived in 24 hours via DHL Express from Frankfurt. Unboxed, updated firmware in 5 minutes, and did our first vineyard flight in 35 km/h gusts. The gimbal stayed rock solid without micro-jitters. The DJI RC 2 built-in 700-nit screen is super readable under direct midday sun.',
    pros: [
      'Ultra-bright 700-nit screen eliminates phone overheating',
      'Whisper-quiet propellers compared to older generations',
      'Rapid charging hub tops 3 batteries in 80 minutes'
    ],
    cons: ['Needs high-speed V90 MicroSD cards to sustain 8K Apple ProRes datarates'],
    verifiedPurchase: true,
    verifiedSerialNumber: '1581F4Q84128FR',
    pilotCertification: 'A2 Certificate',
    flightHours: 92,
    helpfulVotes: 29,
    unhelpfulVotes: 0,
    userVotedHelpful: false,
    media: [
      {
        id: 'med-03',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
        caption: 'Vineyard tracking shot at sunset using ActiveTrack 6.0'
      }
    ],
    status: 'approved',
    createdAt: '2026-08-02T11:40:00Z'
  },
  {
    id: 'rev-m4p-03',
    productId: 'prod-mavic-4-pro',
    authorName: 'Matteo Rossi',
    authorLocation: 'Milan, Italy',
    countryCode: 'IT',
    rating: 4,
    title: 'Top-tier image sensor, but premium price requires investment justification',
    content:
      'The optical performance of all three cameras is mind-blowing. Dynamic range in D-Log M handles high-contrast Mediterranean sun with ease. Deducting 1 star only because the Cine Edition with internal 1TB SSD is expensive, but for broadcast deliverable files, it saves hours of offloading time.',
    pros: ['1TB built-in NVMe SSD', 'Tri-camera optical parity', 'Omnidirectional APAS'],
    cons: ['High entry cost for hobbyists'],
    verifiedPurchase: true,
    verifiedSerialNumber: '1581F4Q90112IT',
    pilotCertification: 'STS Commercial',
    flightHours: 210,
    helpfulVotes: 18,
    unhelpfulVotes: 2,
    userVotedHelpful: false,
    media: [],
    status: 'approved',
    createdAt: '2026-08-05T16:05:00Z'
  },

  // Mini 4 Pro Reviews
  {
    id: 'rev-m4-01',
    productId: 'prod-mini-4-pro',
    authorName: 'Sophie van Dijk',
    authorLocation: 'Amsterdam, Netherlands',
    countryCode: 'NL',
    rating: 5,
    title: 'The king of sub-249g travel drones. Zero license exam needed in EU!',
    content:
      'I take this on every European weekend trip. Being strictly under 249 grams with the standard battery means I can fly in Class C0 Open A1 right over parks and canals without having to pass a pilot test. The true vertical shooting is a godsend for Instagram Reels and TikTok.',
    pros: [
      '249g ultralight weight',
      'True 90-degree vertical sensor rotation',
      'Omnidirectional obstacle avoidance sensors',
      'ActiveTrack 360-degree subject following'
    ],
    cons: ['Lighter weight means you need to watch out in 45+ km/h coastal gales'],
    verifiedPurchase: true,
    verifiedSerialNumber: '1581F0MINI4P01NL',
    pilotCertification: 'Recreational Enthusiast',
    flightHours: 54,
    helpfulVotes: 51,
    unhelpfulVotes: 1,
    userVotedHelpful: false,
    media: [
      {
        id: 'med-04',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        caption: 'Canal sunset vertical frame straight out of camera.'
      }
    ],
    status: 'approved',
    createdAt: '2026-08-01T10:15:00Z'
  },

  // Avata 2 Reviews
  {
    id: 'rev-av2-01',
    productId: 'prod-avata-2',
    authorName: 'Felix Baumgartner',
    authorLocation: 'Salzburg, Austria',
    countryCode: 'AT',
    rating: 5,
    title: 'Pure adrenaline. DJI Goggles 3 with Real View PiP is unmatched safety',
    content:
      'FPV flying used to be intimidating and required soldering irons. Avata 2 is turnkey: one-push acrobatics (flip/roll/180 drift), turtle mode flips the drone over if you crash on grass, and Goggles 3 lets you see your surroundings without taking off the headset.',
    pros: ['Built-in propeller guards', 'One-push acro stunts', 'Real View PiP camera in Goggles 3'],
    cons: ['Needs an observer with you to comply with European VLOS rules'],
    verifiedPurchase: true,
    verifiedSerialNumber: '1581FAVAT209AT',
    pilotCertification: 'A1/A3 Open',
    flightHours: 88,
    helpfulVotes: 36,
    unhelpfulVotes: 0,
    userVotedHelpful: false,
    media: [
      {
        id: 'med-05',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=800&q=80',
        caption: 'Low altitude canyon pass using Motion Controller 3'
      }
    ],
    status: 'approved',
    createdAt: '2026-07-20T17:30:00Z'
  },

  // Osmo Pocket 3 Reviews
  {
    id: 'rev-op3-01',
    productId: 'prod-osmo-pocket-3',
    authorName: 'Elena Vilar',
    authorLocation: 'Barcelona, Spain',
    countryCode: 'ES',
    rating: 5,
    title: 'The ultimate handheld creator tool. 1-inch sensor low-light is unbeatable',
    content:
      'Paired with the DJI Mic 2 transmitter included in the Creator Combo, audio clarity and 4K 120fps video make this my primary vlogging setup. The rotating 2-inch OLED touchscreen turns on automatically in 1 second.',
    pros: ['1-inch CMOS sensor', 'Direct 32-bit float audio pairing with Mic 2', 'Mechanical 3-axis gimbal'],
    cons: ['Not waterproof without an external dive casing'],
    verifiedPurchase: true,
    verifiedSerialNumber: '1581FPOCK399ES',
    pilotCertification: 'Recreational Enthusiast',
    flightHours: 0,
    helpfulVotes: 24,
    unhelpfulVotes: 0,
    userVotedHelpful: false,
    media: [],
    status: 'approved',
    createdAt: '2026-08-08T08:12:00Z'
  }
];

export function calculateReviewSummary(reviews: ProductReview[], productId: string): ReviewRatingSummary {
  const filtered = reviews.filter((r) => r.productId === productId && r.status === 'approved');
  if (filtered.length === 0) {
    return {
      averageRating: 5.0,
      totalReviews: 0,
      starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      attributeScores: {
        cameraQuality: 98,
        batteryEndurance: 95,
        easaEaseOfFlight: 96,
        transmissionStability: 99,
        buildQuality: 98
      },
      totalVerifiedPurchases: 0,
      totalWithMedia: 0
    };
  }

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  let verified = 0;
  let withMedia = 0;

  filtered.forEach((r) => {
    sum += r.rating;
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    starCounts[star] = (starCounts[star] || 0) + 1;
    if (r.verifiedPurchase) verified++;
    if (r.media && r.media.length > 0) withMedia++;
  });

  const avg = Number((sum / filtered.length).toFixed(1));

  return {
    averageRating: avg,
    totalReviews: filtered.length,
    starCounts,
    attributeScores: {
      cameraQuality: 98,
      batteryEndurance: 94,
      easaEaseOfFlight: 96,
      transmissionStability: 99,
      buildQuality: 97
    },
    totalVerifiedPurchases: verified,
    totalWithMedia: withMedia
  };
}
