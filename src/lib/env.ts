import { z } from 'zod';

const readEnv = (key: string): string | undefined => {
  const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env)
    ? (import.meta.env as Record<string, string | undefined>)
    : undefined;

  const metaValue = metaEnv?.[key];
  if (typeof metaValue === 'string') {
    return metaValue;
  }

  if (typeof process !== 'undefined' && typeof process.env === 'object') {
    const processValue = process.env[key];
    if (typeof processValue === 'string') {
      return processValue;
    }
  }

  return undefined;
};

const rawEnv = {
  VITE_SUPABASE_URL: readEnv('VITE_SUPABASE_URL') ?? readEnv('NEXT_PUBLIC_SUPABASE_URL'),
  VITE_SUPABASE_ANON_KEY: readEnv('VITE_SUPABASE_ANON_KEY') ?? readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  VITE_USE_DEMO_DATA: readEnv('VITE_USE_DEMO_DATA'),
  VITE_SENTRY_DSN: readEnv('VITE_SENTRY_DSN'),
};

const optionalString = z
  .string()
  .optional()
  .transform((val) => {
    const trimmed = val?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : null;
  });

const optionalUrl = optionalString.refine(
  (val) => val === null || /^https?:\/\//.test(val),
  'Value must be a valid URL'
);

const EnvSchema = z
  .object({
    VITE_SUPABASE_URL: optionalUrl,
    VITE_SUPABASE_ANON_KEY: optionalString,
    VITE_USE_DEMO_DATA: z
      .string()
      .optional()
      .transform((val) => val ?? 'false'),
    VITE_SENTRY_DSN: optionalUrl,
  })
  .superRefine((env, ctx) => {
    const useDemo = env.VITE_USE_DEMO_DATA.toLowerCase() === 'true';
    if (!useDemo) {
      if (!env.VITE_SUPABASE_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['VITE_SUPABASE_URL'],
          message: 'VITE_SUPABASE_URL is required when VITE_USE_DEMO_DATA is false',
        });
      }
      if (!env.VITE_SUPABASE_ANON_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['VITE_SUPABASE_ANON_KEY'],
          message: 'VITE_SUPABASE_ANON_KEY is required when VITE_USE_DEMO_DATA is false',
        });
      }
    }
  });

// Validate but don't throw - return validation result
const validationResult = EnvSchema.safeParse(rawEnv);

// Only throw in development mode
if (!validationResult.success && import.meta.env.DEV) {
  console.error('❌ Invalid environment configuration:', validationResult.error.flatten().fieldErrors);
  throw new Error(
    'Environment validation failed. Check your .env file.\n' +
      'Required for production: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY\n' +
      'Or set VITE_USE_DEMO_DATA=true for demo mode'
  );
}

// Export safe values with validation status
export const env = validationResult.success
  ? {
      supabaseUrl: validationResult.data.VITE_SUPABASE_URL,
      supabaseAnonKey: validationResult.data.VITE_SUPABASE_ANON_KEY,
      useDemoData: validationResult.data.VITE_USE_DEMO_DATA.toLowerCase() === 'true',
      sentryDsn: validationResult.data.VITE_SENTRY_DSN,
      isValid: true as const,
    }
  : {
      supabaseUrl: null,
      supabaseAnonKey: null,
      useDemoData: true, // Fallback to safe demo mode
      sentryDsn: null,
      isValid: false as const,
    };

// Log warning in production if config is invalid
if (!env.isValid && import.meta.env.PROD) {
  console.warn('⚠️ Invalid configuration detected. Running in fallback demo mode.');
}
