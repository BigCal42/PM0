// Minimal fallback Supabase types used when generation is unavailable.
// This is intentionally permissive to prevent type errors during builds.

export type Database = {
  public: {
    Tables: Record<string, any>;
    Views: Record<string, any>;
    Functions: Record<string, any>;
    Enums?: Record<string, any>;
    CompositeTypes?: Record<string, any>;
  };
};
