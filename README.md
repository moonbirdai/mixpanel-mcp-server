# Mixpanel MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for integrating Mixpanel analytics into AI workflows. This server allows AI assistants like Claude to track events, page views, user signups, and update user profiles in Mixpanel.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Detailed Usage](#detailed-usage)
  - [With Claude Desktop](#with-claude-desktop)
  - [With Other MCP Clients](#with-other-mcp-clients)
- [Tool Reference](#tool-reference)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)

## Features

- Track custom events in Mixpanel
- Track page views with referrer information
- Track user signups and create user profiles
- Update existing user profiles
- Simple integration with Claude Desktop and other MCP clients

## Installation

### Prerequisites

- Node.js 16 or higher
- A Mixpanel project token (get one by signing up at [Mixpanel](https://mixpanel.com))

### NPM Installation (Recommended)

```bash
# Install globally
npm install -g mixpanel-mcp-server

# Or use directly with npx
npx mixpanel-mcp-server --token YOUR_MIXPANEL_TOKEN
```

### Manual Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mixpanel-mcp-server.git
cd mixpanel-mcp-server

# Install dependencies
npm install

# Run the server
node index.js --token YOUR_MIXPANEL_TOKEN
```

## Quick Start

To start using the Mixpanel MCP server with Claude Desktop:

1. Make sure Claude Desktop is installed on your machine (download from [claude.ai/download](https://claude.ai/download))

2. Create or edit the Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%AppData%\Claude\claude_desktop_config.json`

3. Add the Mixpanel MCP server configuration:

```json
{
  "mcpServers": {
    "mixpanel-analytics": {
      "command": "npx",
      "args": [
        "-y",
        "mixpanel-mcp-server",
        "--token",
        "YOUR_MIXPANEL_TOKEN"
      ]
    }
  }
}
```

4. Restart Claude Desktop and start tracking analytics!

## Detailed Usage

### With Claude Desktop

After setting up the configuration file as shown in the Quick Start section, you can use the Mixpanel analytics capabilities directly in your conversations with Claude.

Examples of prompts you can use:

- "Track a custom event in Mixpanel named 'document_generated' for user 'user123'"
- "Track a page view for the homepage in Mixpanel"
- "Create a new user profile in Mixpanel for John Doe with email john@example.com"
- "Update user profile information in Mixpanel for user 'user123'"

Claude will use the appropriate Mixpanel MCP tool based on your request.

### With Other MCP Clients

This server uses the standard Model Context Protocol and can be integrated with any MCP client:

1. Start the server:
   ```bash
   npx mixpanel-mcp-server --token YOUR_MIXPANEL_TOKEN
   ```

2. Connect your MCP client to the server using stdio transport

3. The client can discover and use the available tools (track_event, track_pageview, track_signup, set_user_profile)

## Tool Reference

The Mixpanel MCP server provides the following tools:

### track_event

Tracks a custom event in Mixpanel.

**Parameters:**
- `event_name` (string, required): The name of the event to track
- `distinct_id` (string, optional): User identifier. Defaults to 'anonymous'
- `properties` (object, optional): Additional properties to track with the event

**Example:**
```json
{
  "event_name": "button_clicked",
  "distinct_id": "user123",
  "properties": {
    "button_id": "submit_form",
    "page": "checkout"
  }
}
```

### track_pageview

Tracks a page view event in Mixpanel.

**Parameters:**
- `page_name` (string, required): The name of the page viewed
- `distinct_id` (string, optional): User identifier. Defaults to 'anonymous'
- `referrer` (string, optional): The referring page

**Example:**
```json
{
  "page_name": "homepage",
  "distinct_id": "user123",
  "referrer": "google.com"
}
```

### track_signup

Tracks a signup event and creates a user profile in Mixpanel.

**Parameters:**
- `user_name` (string, required): User's full name
- `email` (string, required): User's email address
- `plan` (string, optional): Signup plan. Defaults to 'free'

**Example:**
```json
{
  "user_name": "John Doe",
  "email": "john@example.com",
  "plan": "premium"
}
```

### set_user_profile

Updates a user's profile properties in Mixpanel.

**Parameters:**
- `distinct_id` (string, required): User identifier
- `properties` (object, required): Profile properties to set

**Example:**
```json
{
  "distinct_id": "user123",
  "properties": {
    "$name": "John Doe",
    "$email": "john@example.com",
    "plan": "premium",
    "company": "Acme Inc"
  }
}
```

## Examples

Here are some practical examples of using the Mixpanel MCP server with Claude:

### Tracking a Button Click

```
You: Can you track an event in Mixpanel when a user clicks the submit button?

Claude: I'll track that event for you. Let me use the Mixpanel analytics tool.

[Claude uses the track_event tool with appropriate parameters]

Claude: I've successfully tracked the 'button_clicked' event in Mixpanel with the properties you specified.
```

### Creating a User Profile

```
You: Create a new user profile in Mixpanel for Sarah Johnson who signed up with sarah@example.com on the premium plan.

Claude: I'll create that user profile in Mixpanel.

[Claude uses the track_signup tool with appropriate parameters]

Claude: I've successfully tracked the signup for Sarah Johnson and created a profile in Mixpanel with the premium plan.
```

## Troubleshooting

### Common Issues

1. **Server not starting:**
   - Ensure you've provided a valid Mixpanel token
   - Check that Node.js is installed and is version 16 or higher

2. **Claude Desktop not showing Mixpanel tools:**
   - Verify your claude_desktop_config.json file syntax
   - Make sure you've restarted Claude Desktop after editing the config
   - Check that the path to the server is correct

3. **Events not appearing in Mixpanel:**
   - Verify your Mixpanel token is correct
   - Check your Mixpanel project settings to ensure data is being received
   - Events may take a few minutes to appear in the Mixpanel interface

### Debug Mode

To run the server in debug mode for more verbose logging:

```bash
npx mixpanel-mcp-server --token YOUR_MIXPANEL_TOKEN --debug
```

## Security Notes

- Your Mixpanel token is stored in the Claude Desktop configuration file. Ensure this file has appropriate permissions
- Consider using environment variables for sensitive tokens in production environments
- This server does not implement rate limiting - consider adding additional security measures for production use
- Events are sent directly to Mixpanel's API - review Mixpanel's privacy policy for data handling practices

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
