import type { ProductMedia3D, ProductIntroVideo } from '../../types';

export interface OfficialStoreMediaEntry {
  slug: string;
  status: number;
  coverOriginal?: string;
  coverLarge?: string;
  coverSmall?: string;
  /** Official PDP carousel frames (Photos tab) from store.dji.com. */
  carouselGallery?: string[];
  /** Interactive GLB models with Unfolded/Folded states. */
  model3d?: ProductMedia3D;
  /** Product intro video for the Intro tab. */
  intro?: ProductIntroVideo;
  fetchedAt: string;
}

export type OfficialStoreMediaCache = Record<string, OfficialStoreMediaEntry>;

function toHttps(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

function decodeJsonUrl(value?: string): string | undefined {
  if (!value) return undefined;
  return toHttps(value.replace(/\\u002F/g, '/'));
}

function extractJsonArrayAfterKey(html: string, slug: string, key: string): unknown[] {
  const idx = html.indexOf(`"slug":"${slug}"`);
  if (idx < 0) return [];
  const chunk = html.slice(idx, idx + 250000);
  const start = chunk.indexOf(`"${key}":`);
  if (start < 0) return [];
  const from = chunk.indexOf('[', start);
  if (from < 0) return [];

  let depth = 0;
  for (let i = from; i < chunk.length; i++) {
    if (chunk[i] === '[') depth++;
    if (chunk[i] === ']') {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(chunk.slice(from, i + 1).replace(/\\u002F/g, '/')) as unknown[];
        } catch {
          return [];
        }
      }
    }
  }
  return [];
}

function extractJsonObjectAfterKey(html: string, slug: string, key: string): Record<string, unknown> | null {
  const idx = html.indexOf(`"slug":"${slug}"`);
  if (idx < 0) return null;
  const chunk = html.slice(idx, idx + 250000);
  const start = chunk.indexOf(`"${key}":`);
  if (start < 0) return null;
  const from = chunk.indexOf('{', start);
  if (from < 0) return null;

  let depth = 0;
  for (let i = from; i < chunk.length; i++) {
    if (chunk[i] === '{') depth++;
    if (chunk[i] === '}') {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(chunk.slice(from, i + 1).replace(/\\u002F/g, '/')) as Record<string, unknown>;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

type CarouselFrame = {
  origin?: string;
  original?: string;
  large?: string;
  xlarge?: string;
  ultra?: string;
};

type ThreeDSourceRaw = {
  title?: string;
  url?: string;
  cameraOrbit?: string;
  environmentImage?: string;
  exposure?: string;
  minCameraOrbit?: string;
  maxCameraOrbit?: string;
  maxFieldOfView?: string;
};

type ThreeDCovers = {
  origin?: string;
  large?: string;
  xlarge?: string;
};

type VideoEntry = {
  pcVideo?: string;
  mVideo?: string;
  pcVideoPoster?: string;
  mVideoPoster?: string;
  url?: string;
  poster?: string;
};

function carouselFrameUrl(frame: CarouselFrame): string | undefined {
  return decodeJsonUrl(frame.origin || frame.original || frame.xlarge || frame.large || frame.ultra);
}

function parseThreeD(html: string, slug: string): ProductMedia3D | undefined {
  const raw = extractJsonObjectAfterKey(html, slug, 'threeD');
  const sources = (raw?.source as ThreeDSourceRaw[] | undefined)?.filter(
    (s) => s?.url && s?.title && s.url.includes('.glb')
  );
  if (!sources?.length) return undefined;

  const covers = raw?.covers as ThreeDCovers | undefined;
  const poster = decodeJsonUrl(covers?.origin || covers?.xlarge || covers?.large);

  return {
    poster,
    sources: sources.map((s) => ({
      title: s.title!,
      url: decodeJsonUrl(s.url)!,
      cameraOrbit: s.cameraOrbit,
      environmentImage: decodeJsonUrl(s.environmentImage),
      exposure: s.exposure,
      minCameraOrbit: s.minCameraOrbit,
      maxCameraOrbit: s.maxCameraOrbit,
      maxFieldOfView: s.maxFieldOfView
    }))
  };
}

function parseIntroVideo(html: string, slug: string): ProductIntroVideo | undefined {
  const videos = extractJsonArrayAfterKey(html, slug, 'videos') as VideoEntry[];
  const fromVideos = videos.find((v) => v.pcVideo || v.mVideo || v.url);
  if (fromVideos) {
    return {
      videoUrl: decodeJsonUrl(fromVideos.pcVideo || fromVideos.mVideo || fromVideos.url)!,
      posterUrl: decodeJsonUrl(fromVideos.pcVideoPoster || fromVideos.mVideoPoster || fromVideos.poster)
    };
  }

  const chunk = html.slice(html.indexOf(`"slug":"${slug}"`), html.indexOf(`"slug":"${slug}"`) + 250000);
  const pcVideo = chunk.match(/"pcVideo":"([^"]+)"/)?.[1];
  const mVideo = chunk.match(/"mVideo":"([^"]+)"/)?.[1];
  const pcPoster = chunk.match(/"pcVideoPoster":"([^"]+)"/)?.[1];
  const mPoster = chunk.match(/"mVideoPoster":"([^"]+)"/)?.[1];
  const videoUrl = decodeJsonUrl(pcVideo || mVideo);
  if (!videoUrl) return undefined;

  return {
    videoUrl,
    posterUrl: decodeJsonUrl(pcPoster || mPoster)
  };
}

/** Parse hero/cover + carousel + 3D + intro from store.dji.com PDP HTML. */
export function parseOfficialMediaFromHtml(
  html: string,
  slug: string
): Pick<
  OfficialStoreMediaEntry,
  'coverOriginal' | 'coverLarge' | 'coverSmall' | 'carouselGallery' | 'model3d' | 'intro'
> {
  const esc = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const forward = new RegExp(`"slug":"${esc}"[\\s\\S]{0,12000}?"cover":\\{([^}]+)\\}`);
  const match = html.match(forward);
  const block = match?.[1] ?? html.slice(0, 500000);

  const original = block.match(/"original":"([^"]+)"/)?.[1];
  const large = block.match(/"large":"([^"]+)"/)?.[1];
  const small = block.match(/"small":"([^"]+)"/)?.[1];

  const carousels = extractJsonArrayAfterKey(html, slug, 'carousels') as CarouselFrame[];
  const carouselGallery = carousels
    .map(carouselFrameUrl)
    .filter((url): url is string => Boolean(url));

  const model3d = parseThreeD(html, slug);
  const intro = parseIntroVideo(html, slug);

  return {
    coverOriginal: decodeJsonUrl(original),
    coverLarge: decodeJsonUrl(large),
    coverSmall: decodeJsonUrl(small),
    carouselGallery: carouselGallery.length ? [...new Set(carouselGallery)] : undefined,
    model3d,
    intro
  };
}

export async function fetchOfficialStoreMedia(slug: string): Promise<OfficialStoreMediaEntry> {
  const url = `https://store.dji.com/product/${slug}`;
  const r = await fetch(url, {
    headers: { 'User-Agent': 'DJI-Store-EU-Media/1.0', Accept: 'text/html' }
  });
  const html = await r.text();
  const media = parseOfficialMediaFromHtml(html, slug);

  return {
    slug,
    status: r.status,
    ...media,
    fetchedAt: new Date().toISOString()
  };
}
