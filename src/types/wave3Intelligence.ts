import { Locale } from './index';

export type ProductRelationType =
  | 'UPGRADE_TO'
  | 'DOWNGRADE_TO'
  | 'ALTERNATIVE_TO'
  | 'RECOMMENDED_WITH'
  | 'REQUIRES'
  | 'COMPATIBLE_WITH'
  | 'REPLACED_BY'
  | 'ACCESSORY_FOR';

export type KnowledgeNodeType =
  | 'product'
  | 'variant'
  | 'accessory'
  | 'firmware'
  | 'download'
  | 'category'
  | 'series'
  | 'use_case'
  | 'regulation';

export type KnowledgeEdgeType =
  | 'USES'
  | 'UPGRADES_TO'
  | 'COMPATIBLE_WITH'
  | 'REQUIRES'
  | 'RECOMMENDED_WITH'
  | 'BELONGS_TO';

export type FaqTopic = 'flight' | 'camera' | 'battery' | 'regulations' | 'compatibility';

export type AccessoryMerchBucket = 'essential' | 'recommended' | 'professional' | 'travel';

export type UpgradeTier = 'BEGINNER' | 'ADVANCED' | 'PROFESSIONAL' | 'CINEMA';

export interface Wave3Enrichment {
  productId: string;
  headline: string;
  summary: string;
  keyBenefits: string[];
  creatorBenefits: string[];
  professionalUseCases: string[];
  travelUseCases: string[];
  canonicalSource: 'https://store.dji.com';
}

export interface Wave3Faq {
  productId: string;
  topic: FaqTopic;
  question: string;
  answer: string;
  locale: Locale;
}

export interface Wave3Relationship {
  fromProductId: string;
  toProductId: string;
  type: ProductRelationType;
  confidence: number;
}

export interface Wave3CompatibilityRow {
  productId: string;
  compatibleProductIds: string[];
  labels: string[];
}

export interface Wave3UpgradePath {
  productId: string;
  tier: UpgradeTier;
  nextProductId?: string;
  previousProductId?: string;
  spine: { tier: UpgradeTier; productId: string }[];
}

export interface Wave3Comparison {
  leftProductId: string;
  rightProductId: string;
  title: string;
  rows: { category: string; left: string; right: string; winner: 'left' | 'right' | 'tie' }[];
}

export interface Wave3AccessoryRec {
  productId: string;
  accessoryId: string;
  bucket: AccessoryMerchBucket;
  confidence: number;
}

export interface Wave3SeoEnhancement {
  productId: string;
  locale: Locale;
  longTailKeywords: string[];
  structuredSnippet: string;
  comparisonSnippet: string;
  buyingGuide: string;
  internalLinkSlugs: string[];
}

export interface KnowledgeNode {
  id: string;
  type: KnowledgeNodeType;
  label: string;
}

export interface KnowledgeEdge {
  from: string;
  to: string;
  type: KnowledgeEdgeType;
}

export interface Wave3ProductCompleteness {
  productId: string;
  specs: number;
  media: number;
  firmware: number;
  downloads: number;
  seo: number;
  faq: number;
  relationships: number;
  overall: number;
}

export interface Wave3Certification {
  catalogHealth: number;
  relationshipCoveragePct: number;
  faqCoveragePct: number;
  seoCoveragePct: number;
  compatibilityCoveragePct: number;
  productIntelligenceScore: number;
  catalogIntelligenceScore: number;
  certified: boolean;
}

export interface Wave3Bundle {
  enrichments: Wave3Enrichment[];
  faqs: Wave3Faq[];
  relationships: Wave3Relationship[];
  compatibility: Wave3CompatibilityRow[];
  upgradePaths: Wave3UpgradePath[];
  comparisons: Wave3Comparison[];
  accessories: Wave3AccessoryRec[];
  seo: Wave3SeoEnhancement[];
  graph: { nodes: KnowledgeNode[]; edges: KnowledgeEdge[] };
  completeness: Wave3ProductCompleteness[];
  certification: Wave3Certification;
}
