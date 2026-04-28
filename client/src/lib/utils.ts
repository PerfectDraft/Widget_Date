import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract a direct image URL from a Google Maps place page URL.
 * The imageUrl field contains something like:
 *   https://www.google.com/maps/place/...!6shttps:%2F%2Flh3.googleusercontent.com%2F...%3Dw152-h86-k-no!7i...
 * We extract the embedded googleusercontent URL and resize it.
 */
export function extractPlaceImage(imageUrl?: string): string | undefined {
  if (!imageUrl) return undefined;

  // Try to extract lh3.googleusercontent.com URL from the Maps URL
  const match = imageUrl.match(/!6shttps?:%2F%2F(lh3\.googleusercontent\.com[^!]+)/);
  if (match) {
    let url = decodeURIComponent(`https://${match[1]}`);
    // Replace small size with larger size
    url = url.replace(/=w\d+-h\d+-k-no/, '=w600-h400-k-no');
    return url;
  }

  // If it's already a direct image URL
  if (imageUrl.match(/\.(jpg|jpeg|png|webp)(\?|$)/i) || imageUrl.includes('googleusercontent.com')) {
    return imageUrl;
  }

  return undefined;
}
