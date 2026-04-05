#!/bin/bash
# MedReminder — double-click this file to start the app
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo ""
    echo "============================================"
    echo "  Node.js is not installed."
    echo "  Please go to https://nodejs.org"
    echo "  and install the LTS version first."
    echo "============================================"
    echo ""
    read -p "Press Enter to close..."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Setting up for first time... this may take a minute."
    npm install
fi

# Open browser after a short delay
(sleep 3 && open http://localhost:3000) &

echo ""
echo "============================================"
echo "  MedReminder is starting..."
echo "  Your browser will open automatically."
echo ""
echo "  DO NOT CLOSE THIS WINDOW"
echo "  (the app stops if you close it)"
echo "============================================"
echo ""

npm run dev
