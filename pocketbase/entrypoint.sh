#!/bin/sh
set -e

PB_DIR=/pb_data
ADMIN_EMAIL="${PB_ADMIN_EMAIL:-admin@kitsune.local}"
ADMIN_PASSWORD="${PB_ADMIN_PASSWORD:-admin123456}"

mkdir -p "$PB_DIR"

# Create superuser before starting the server (safe to re-run; fails silently if exists)
pocketbase --dir="$PB_DIR" superuser create "$ADMIN_EMAIL" "$ADMIN_PASSWORD" >/dev/null 2>&1 || true

# Start PocketBase so the schema can be synchronized through its admin API.
pocketbase --dir="$PB_DIR" serve --http=0.0.0.0:8090 &
PB_PID=$!
trap 'kill "$PB_PID" 2>/dev/null; wait "$PB_PID"' INT TERM

for _ in $(seq 1 30); do
  if wget -q -O /dev/null http://127.0.0.1:8090/api/health; then
    break
  fi
  sleep 1
done

PB_URL=http://127.0.0.1:8090 python3 /usr/local/bin/init-collections.py
wait "$PB_PID"
