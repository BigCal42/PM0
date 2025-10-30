#!/usr/bin/env node

/**
 * Supabase TypeScript type generation script
 * Soft-fails gracefully if Supabase CLI is not available
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF;

function checkSupabaseCLI() {
  try {
    execSync('supabase --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function main() {
  if (!SUPABASE_PROJECT_REF) {
    console.warn(
      '⚠️  SUPABASE_PROJECT_REF not set. Skipping type generation.\n' +
        '   Set SUPABASE_PROJECT_REF environment variable to generate types.'
    );
    return 0;
  }

  if (!checkSupabaseCLI()) {
    console.warn(
      '⚠️  Supabase CLI not found. Skipping type generation.\n' +
        '   Install it with: npm install -g supabase\n' +
        '   Or visit: https://supabase.com/docs/guides/cli'
    );
    return 0;
  }

  try {
    console.log('Generating Supabase types...');
    execSync(
      `supabase gen types typescript --project-id ${SUPABASE_PROJECT_REF} --schema public > src/types/supabase.ts`,
      { cwd: projectRoot, stdio: 'inherit' }
    );
    console.log('✅ Types generated successfully');
    return 0;
  } catch (error) {
    console.error('❌ Failed to generate types:', error.message);
    return 1;
  }
}

process.exit(main());

