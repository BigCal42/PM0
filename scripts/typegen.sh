#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_FILE="$ROOT_DIR/src/types/database.ts"
PROJECT_REF=${SUPABASE_PROJECT_REF:-${1:-}}
SCHEMA=${SUPABASE_DB_SCHEMA:-public}

mkdir -p "$(dirname "$OUTPUT_FILE")"

# If types already exist, we're good
if [[ -f "$OUTPUT_FILE" ]]; then
  echo "✓ [typegen] Types exist at ${OUTPUT_FILE#"$ROOT_DIR/"}. Skipping generation." >&2
  exit 0
fi

# If types don't exist, we need to generate them
if [[ -z "$PROJECT_REF" ]]; then
  echo "✗ [typegen] ERROR: SUPABASE_PROJECT_REF not set and types don't exist." >&2
  echo "  Run: SUPABASE_PROJECT_REF=<your-ref> npm run typegen" >&2
  echo "  Or commit generated types to the repository." >&2
  exit 1
fi

if ! command -v supabase >/dev/null 2>&1; then
  echo "✗ [typegen] ERROR: Supabase CLI not installed." >&2
  echo "  Install: https://supabase.com/docs/guides/cli" >&2
  exit 1
fi

echo "→ [typegen] Generating types for project '$PROJECT_REF' (schema: $SCHEMA)..." >&2
supabase gen types typescript --project-ref "$PROJECT_REF" --schema "$SCHEMA" > "$OUTPUT_FILE"

TMP_FILE="${OUTPUT_FILE}.tmp"
{
  echo "// This file is auto-generated via scripts/typegen.sh."
  echo "// Do not edit by hand."
  echo ""
  cat "$OUTPUT_FILE"
} > "$TMP_FILE"
mv "$TMP_FILE" "$OUTPUT_FILE"

echo "✓ [typegen] Successfully wrote types to ${OUTPUT_FILE#"$ROOT_DIR/"}" >&2
