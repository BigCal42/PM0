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

# Use fallback types if generation is unavailable
if [[ -z "$PROJECT_REF" ]] || ! command -v supabase >/dev/null 2>&1; then
  echo "⚠ [typegen] Using fallback types (missing SUPABASE_PROJECT_REF or Supabase CLI)" >&2
  cp "${ROOT_DIR}/src/types/database.fallback.ts" "$OUTPUT_FILE"
  exit 0
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
