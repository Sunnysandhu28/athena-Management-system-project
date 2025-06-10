#!/bin/bash
# GitHub webhook deployment script
gcloud auth activate-service-account --key-file=/tmp/service-account.json
gcloud config set project sim-consciousness-protection
gcloud run deploy sim-consciousness-fixed \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --set-env-vars DATABASE_URL="postgresql://neondb_owner:npg_U0x2TEDmNMQP@ep-raspy-glade-a58l4e9f.us-east-2.aws.neon.tech/neondb?sslmode=require"
