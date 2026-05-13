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
  NVIDIA_API_KEY: string;
  NVIDIA_MODEL: string;
  OPENWEATHER_API_KEY: string;
  PORT: number;
  CLIENT_ORIGIN: string;
  JWT_SECRET: string;
}

function validateEnv(): EnvConfig {
  const required = ['NVIDIA_API_KEY', 'OPENWEATHER_API_KEY', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
    console.error('   Please check your .env file at the project root.');
    process.exit(1);
  }

  return {
    NVIDIA_API_KEY: process.env.NVIDIA_API_KEY!,
    NVIDIA_MODEL: process.env.NVIDIA_MODEL || 'nvidia/llama-3.3-nemotron-super-49b-v1',
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY!,
    PORT: parseInt(process.env.PORT || '3001', 10),
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    JWT_SECRET: process.env.JWT_SECRET!,
  };
}

export const env = validateEnv();
