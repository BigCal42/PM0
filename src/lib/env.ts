import { z } from 'zod'

const rawEnv = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_USE_DEMO_DATA: import.meta.env.VITE_USE_DEMO_DATA,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN
}

const optionalString = z
  .string()
  .optional()
  .transform((val) => {
    const trimmed = val?.trim()
    return trimmed && trimmed.length > 0 ? trimmed : null
  })

const optionalUrl = optionalString.refine(
  (val) => val === null || /^https?:\/\//.test(val),
  'Value must be a valid URL'
)

const EnvSchema = z
  .object({
    VITE_SUPABASE_URL: optionalUrl,
    VITE_SUPABASE_ANON_KEY: optionalString,
    VITE_USE_DEMO_DATA: z
      .string()
      .optional()
      .transform((val) => (val ?? 'false')),
    VITE_SENTRY_DSN: optionalUrl
  })
  .superRefine((env, ctx) => {
    const useDemo = env.VITE_USE_DEMO_DATA.toLowerCase() === 'true'
    if (!useDemo) {
      if (!env.VITE_SUPABASE_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['VITE_SUPABASE_URL'],
          message: 'VITE_SUPABASE_URL is required when VITE_USE_DEMO_DATA is false'
        })
      }
      if (!env.VITE_SUPABASE_ANON_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['VITE_SUPABASE_ANON_KEY'],
          message: 'VITE_SUPABASE_ANON_KEY is required when VITE_USE_DEMO_DATA is false'
        })
      }
    }
  })

type ParsedEnv = z.infer<typeof EnvSchema>

function parseEnv(): ParsedEnv {
  const result = EnvSchema.safeParse(rawEnv)
  if (!result.success) {
    console.error('Invalid runtime environment configuration:', result.error.flatten().fieldErrors)
    throw new Error('Missing or invalid Vite environment variables. Check your .env file or deployment settings.')
  }
  return result.data
}

const parsed = parseEnv()

const useDemoData = parsed.VITE_USE_DEMO_DATA.toLowerCase() === 'true'

export const env = {
  supabaseUrl: parsed.VITE_SUPABASE_URL,
  supabaseAnonKey: parsed.VITE_SUPABASE_ANON_KEY,
  useDemoData,
  sentryDsn: parsed.VITE_SENTRY_DSN
} as const
