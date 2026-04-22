import { Router } from 'express';
import { scrapeGoogleMapsImage } from '../services/scraperService.js';

export const scraperRouter = Router();

// GET /api/place-image?url=<maps_url>
scraperRouter.get('/place-image', async (req, res, next) => {
  try {
    const url = req.query.url as string;
    if (!url) {
      res.status(400).json({ error: 'Missing "url" query parameter.' });
      return;
    }

    const imageUrl = await scrapeGoogleMapsImage(url);
    res.json({ imageUrl });
  } catch (err) {
    next(err);
  }
});
