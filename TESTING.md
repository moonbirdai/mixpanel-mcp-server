# Testing the Mixpanel MCP Server

This document outlines the steps to test the Mixpanel MCP server locally, both standalone and with Claude Desktop.

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- Mixpanel project token
- Claude Desktop app installed (for Claude integration tests)

## Setup Steps

1. Navigate to the project directory:
   ```
   cd /path/to/mixpanel-mcp-new
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Make scripts executable:
   ```
   chmod +x index.js
   chmod +x test-mixpanel.js
   chmod +x test.sh
   chmod +x claude_setup.sh
   ```

## Testing Mixpanel Connection

First, verify your Mixpanel token is valid and can successfully send events:

```
./test-mixpanel.js --token YOUR_MIXPANEL_TOKEN
```

You should see a confirmation message. Check your Mixpanel dashboard for the `mcp_server_test` event to confirm it's working.

## Running the Server Standalone

Run the MCP server in debug mode to see verbose logging:

```
./index.js --token YOUR_MIXPANEL_TOKEN --debug
```

The server should start and display initialization information. Since it's waiting for MCP protocol requests on stdin/stdout, there won't be further output until a client connects.

## Testing with MCP Inspector

The MCP Inspector is a tool for testing MCP servers. Install and use it to test the server:

```
npm install -g @modelcontextprotocol/inspector
npx @modelcontextprotocol/inspector server ./index.js --token YOUR_MIXPANEL_TOKEN
```

The Inspector provides a web interface where you can see the available tools and test them.

## Setting Up with Claude Desktop

1. Configure Claude Desktop to use the MCP server:

   ```
   ./claude_setup.sh YOUR_MIXPANEL_TOKEN
   ```

   This creates or updates the Claude Desktop configuration file to include the Mixpanel MCP server.

2. Restart Claude Desktop to load the new configuration.

3. Once Claude is running, click on the Claude menu and check that the server is listed under "MCP Connections".

## Testing with Claude Desktop

1. Open a new chat with Claude.

2. You should see a hammer icon in the Claude interface, indicating available tools.

3. Ask Claude to perform analytics tasks, such as:
   - "Track a signup event for a user named John Doe with email john@example.com"
   - "Track a page view for the pricing page"
   - "Track a custom event called 'feature_used' for the user 'test_user'"

4. Claude should use the appropriate tool and confirm the action was successful.

5. Check your Mixpanel dashboard to verify the events were recorded.

## Debugging Issues

If you encounter problems:

### Server Not Starting

- Check the error messages in the console
- Verify your Mixpanel token is valid
- Ensure all dependencies are installed correctly

### Claude Not Finding Tools

- Verify the configuration in `~/Library/Application Support/Claude/claude_desktop_config.json`
- Make sure the paths in the configuration are absolute
- Restart Claude Desktop completely
- Check Claude logs: `~/Library/Logs/Claude/mcp*.log`

### Events Not Appearing in Mixpanel

- Mixpanel can have a delay before events show up in the dashboard
- Verify the token is correct and belongs to the project you're checking
- Run the `test-mixpanel.js` script to verify the connection

## Automated Testing

For convenience, you can run a basic test sequence using:

```
./test.sh YOUR_MIXPANEL_TOKEN
```

This will test both the Mixpanel connection and start the server for manual testing.
