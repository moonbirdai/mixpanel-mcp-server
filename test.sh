#!/bin/bash

# Tests for Mixpanel MCP Server
# This script helps test and debug the Mixpanel MCP server

echo "=== Mixpanel MCP Server Testing ==="

# Ensure the token is provided
if [ -z "$1" ]; then
  echo "Error: Mixpanel token not provided"
  echo "Usage: ./test.sh YOUR_MIXPANEL_TOKEN"
  exit 1
fi

TOKEN=$1

# Make scripts executable
chmod +x index.js
chmod +x test-mixpanel.js

echo ""
echo "=== Testing Mixpanel connection ==="
node test-mixpanel.js --token $TOKEN

echo ""
echo "=== Testing MCP server directly ==="
echo "You'll need to manually terminate this with Ctrl+C after testing."
echo "Starting the server in debug mode..."
./index.js --token $TOKEN --debug
