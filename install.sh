#!/bin/bash

# Installation and testing script for Mixpanel MCP Server

echo "=== Mixpanel MCP Server Installation ==="

# Make scripts executable
chmod +x index.js
chmod +x test-mixpanel.js

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Prompt for token if not provided
if [ -z "$1" ]; then
  read -p "Enter your Mixpanel project token: " TOKEN
else
  TOKEN=$1
fi

# Test Mixpanel connection
echo ""
echo "=== Testing Mixpanel connection ==="
./test-mixpanel.js --token $TOKEN

if [ $? -eq 0 ]; then
  echo ""
  echo "=== Setup Claude Desktop Integration ==="
  
  # Get absolute path for this directory
  CURRENT_DIR=$(pwd)
  
  # Configuration for claude_desktop_config.json
  echo "To configure Claude Desktop, add the following to your claude_desktop_config.json:"
  echo ""
  echo "{\"mcpServers\": {\"mixpanel-analytics\": {\"command\": \"node\", \"args\": [\"$CURRENT_DIR/index.js\", \"--token\", \"$TOKEN\", \"--debug\"]}}}"
  echo ""
  echo "Your claude_desktop_config.json file is located at:"
  echo "MacOS: ~/Library/Application Support/Claude/claude_desktop_config.json"
  echo "Windows: %APPDATA%\\Claude\\claude_desktop_config.json"
  echo ""
  echo "After updating the configuration, restart Claude Desktop."
  
  echo ""
  echo "=== Installation Complete ==="
  echo "You can now use the Mixpanel MCP server with Claude Desktop!"
else
  echo ""
  echo "=== Installation Failed ==="
  echo "The Mixpanel connection test failed. Please check your token and try again."
fi
