#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <PROJECT_REF>" >&2
  exit 1
fi

PROJECT_REF="$1"

mkdir -p src/types
supabase gen types typescript --project-ref "$PROJECT_REF" > src/types/database.ts
