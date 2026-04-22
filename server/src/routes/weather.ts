import { Router } from 'express';
import { fetchWeather } from '../services/weatherService.js';

export const weatherRouter = Router();

// GET /api/weather?city=Hanoi
weatherRouter.get('/weather', async (req, res, next) => {
  try {
    const city = (req.query.city as string) || 'Hanoi';
    const data = await fetchWeather(city);
    res.json(data);
  } catch (err) {
    next(err);
  }
});
