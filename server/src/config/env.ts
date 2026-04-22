import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Always explicitly load .env to guarantee all vars are present,
// regardless of dotenv v17 auto-injection or CWD differences.
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../.env'),
];
const envPath = envPaths.find(p => fs.existsSync(p));
if (envPath) {
  dotenv.config({ path: envPath, override: true });
}

interface EnvConfig {
  OPENROUTER_API_KEY: string;
  OPENROUTER_MODEL: string;
  OPENROUTER_FALLBACK_MODELS: string[];
  OPENWEATHER_API_KEY: string;
  PORT: number;
  CLIENT_ORIGIN: string;
}

function validateEnv(): EnvConfig {
  const required = ['OPENROUTER_API_KEY', 'OPENWEATHER_API_KEY'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
    console.error('   Please check your .env file at the project root.');
    process.exit(1);
  }

  const fallbackRaw = process.env.OPENROUTER_FALLBACK_MODELS || '';
  const fallbackModels = fallbackRaw.split(',').map(s => s.trim()).filter(Boolean);

  return {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY!,
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001',
    OPENROUTER_FALLBACK_MODELS: fallbackModels,
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY!,
    PORT: parseInt(process.env.PORT || '3001', 10),
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  };
}

export const env = validateEnv();
