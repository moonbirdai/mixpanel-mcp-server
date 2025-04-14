#!/bin/bash

# Claude Desktop Configuration Script for Mixpanel MCP Server
# This script helps set up the Mixpanel MCP server with Claude Desktop

echo "=== Claude Desktop Configuration for Mixpanel MCP Server ==="

# Ensure the token is provided
if [ -z "$1" ]; then
  echo "Error: Mixpanel token not provided"
  echo "Usage: ./claude_setup.sh YOUR_MIXPANEL_TOKEN"
  exit 1
fi

TOKEN=$1

# Make scripts executable
chmod +x index.js
chmod +x test-mixpanel.js

# Get the current directory
CURRENT_DIR=$(pwd)

# Claude Desktop config location
CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Create the config file if it doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Creating Claude Desktop config file..."
  mkdir -p "$(dirname "$CONFIG_FILE")"
  echo "{}" > "$CONFIG_FILE"
fi

# Back up the existing config file
cp "$CONFIG_FILE" "${CONFIG_FILE}.backup"
echo "Backed up existing config to ${CONFIG_FILE}.backup"

# Read the current config
CONFIG=$(cat "$CONFIG_FILE")

# Check if JSON is valid and not empty
if [ "$CONFIG" = "{}" ] || [ -z "$CONFIG" ]; then
  # Create new config from scratch
  NEW_CONFIG=$(cat <<EOF
{
  "mcpServers": {
    "mixpanel-analytics": {
      "command": "node",
      "args": ["$CURRENT_DIR/index.js", "--token", "$TOKEN", "--debug"]
    }
  }
}
EOF
)
else
  # Add or update the Mixpanel server in existing config
  # This is a simple approach that assumes valid JSON - for a production script, use jq
  if grep -q "\"mcpServers\"" <<< "$CONFIG"; then
    # mcpServers exists, check if our server exists
    if grep -q "\"mixpanel-analytics\"" <<< "$CONFIG"; then
      echo "Mixpanel server configuration already exists. Updating..."
      # This is very basic, for production use jq for proper JSON manipulation
      NEW_CONFIG=$(echo "$CONFIG" | sed -E "s|(\"mixpanel-analytics\"[^{]*\\{[^}]*\"args\":[^\\[]*\\[[^\\]]*)(\\])|\\1, \"$TOKEN\", \"--debug\"\\2|g")
    else
      # Add our server to existing mcpServers
      NEW_CONFIG=$(echo "$CONFIG" | sed -E "s|(\"mcpServers\"[^{]*\\{)([^}]*)(\\})|\\1\\2,\"mixpanel-analytics\":{\"command\":\"node\",\"args\":[\"$CURRENT_DIR/index.js\",\"--token\",\"$TOKEN\",\"--debug\"]}\\3|g")
    fi
  else
    # Add mcpServers section
    NEW_CONFIG=$(echo "$CONFIG" | sed -E "s|(\\{)([^}]*)(\\})|\\1\\2,\"mcpServers\":{\"mixpanel-analytics\":{\"command\":\"node\",\"args\":[\"$CURRENT_DIR/index.js\",\"--token\",\"$TOKEN\",\"--debug\"]}}\\3|g")
  fi
fi

# Write the new config
echo "$NEW_CONFIG" > "$CONFIG_FILE"

echo ""
echo "Claude Desktop configuration updated successfully!"
echo ""
echo "Please restart Claude Desktop for the changes to take effect."
echo ""
echo "To verify the configuration, you can check:"
echo "$CONFIG_FILE"
