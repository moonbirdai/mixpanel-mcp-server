# Mixpanel MCP Server

A Model Context Protocol (MCP) server for integrating Mixpanel analytics with Claude and other MCP clients.

## Features

- Track custom events in Mixpanel
- Track page views
- Track user signups
- Update user profiles
- Simple, clean implementation following the MCP specification

## Installation

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- A Mixpanel account and project token

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/mixpanel-mcp-server.git
   cd mixpanel-mcp-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Make the script executable:
   ```
   chmod +x index.js
   ```

## Usage

### Running the Server

Run the server directly, providing your Mixpanel token:

```
./index.js --token YOUR_MIXPANEL_TOKEN
```

For verbose logging:

```
./index.js --token YOUR_MIXPANEL_TOKEN --debug
```

### Installing to use with Claude Desktop

1. Make the server globally accessible (optional):
   ```
   npm install -g .
   ```

2. Configure Claude Desktop to use the server:

   Edit your Claude Desktop configuration file located at:
   - MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   Add the following configuration:

   ```json
   {
     "mcpServers": {
       "mixpanel-analytics": {
         "command": "mixpanel-mcp-server",
         "args": ["--token", "YOUR_MIXPANEL_TOKEN"]
       }
     }
   }
   ```

   If you didn't install globally, specify the full path:

   ```json
   {
     "mcpServers": {
       "mixpanel-analytics": {
         "command": "node",
         "args": ["/path/to/mixpanel-mcp-new/index.js", "--token", "YOUR_MIXPANEL_TOKEN"]
       }
     }
   }
   ```

3. Restart Claude Desktop

### Available Tools

Once connected, the following tools will be available to Claude:

- **track_event**: Track a custom event in Mixpanel
- **track_pageview**: Track a page view event
- **track_signup**: Track a user signup and create a profile
- **set_user_profile**: Update a user's profile properties

## Testing

To test if the server is working correctly:

1. Run it in debug mode:
   ```
   ./index.js --token YOUR_MIXPANEL_TOKEN --debug
   ```

2. Use MCP Inspector to test the tools directly:
   ```
   npx @modelcontextprotocol/inspector server ./index.js --token YOUR_MIXPANEL_TOKEN
   ```

3. Check your Mixpanel dashboard to confirm events are being recorded.

## Troubleshooting

- **Server exits immediately**: Make sure you're providing a valid Mixpanel token.
- **Claude doesn't list tools**: Verify your claude_desktop_config.json is correctly configured.
- **Events not showing in Mixpanel**: There might be a delay before events appear in the Mixpanel UI.

## License

MIT
