#!/bin/sh
set -e

PB_DIR=/pb_data
ADMIN_EMAIL="${PB_ADMIN_EMAIL:-admin@kitsune.local}"
ADMIN_PASSWORD="${PB_ADMIN_PASSWORD:-admin123456}"

mkdir -p "$PB_DIR"

# Create superuser before starting the server (safe to re-run; fails silently if exists)
pocketbase --dir="$PB_DIR" superuser create "$ADMIN_EMAIL" "$ADMIN_PASSWORD" 2>/dev/null || true

# Start PocketBase
exec pocketbase --dir="$PB_DIR" serve --http=0.0.0.0:8090
