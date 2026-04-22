// Server-side scraper — replaces untrusted allorigins.win proxy
// Server can fetch directly without CORS restrictions

const imageCache = new Map<string, string | null>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour
const cacheTimestamps = new Map<string, number>();

export async function scrapeGoogleMapsImage(mapsUri: string): Promise<string | null> {
  // Check memory cache
  const cached = imageCache.get(mapsUri);
  const cachedAt = cacheTimestamps.get(mapsUri);
  if (cached !== undefined && cachedAt && Date.now() - cachedAt < CACHE_TTL) {
    return cached;
  }

  try {
    const response = await fetch(mapsUri, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    const html = await response.text();

    // Parse og:image meta tag
    const match =
      html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
      html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);

    if (match && match[1]) {
      // Skip Google Maps placeholder icons
      if (match[1].includes('maps.gstatic.com') || match[1].includes('streetviewpixels')) {
        imageCache.set(mapsUri, null);
        cacheTimestamps.set(mapsUri, Date.now());
        return null;
      }

      imageCache.set(mapsUri, match[1]);
      cacheTimestamps.set(mapsUri, Date.now());
      return match[1];
    }

    imageCache.set(mapsUri, null);
    cacheTimestamps.set(mapsUri, Date.now());
    return null;
  } catch (error) {
    console.error('Error scraping Google Maps image:', error);
    return null;
  }
}
