#!/bin/bash
echo "Starting MediSync Frontend (React + Vite)..."
cd "$(dirname "$0")/frontend"
npm install
npm run dev
