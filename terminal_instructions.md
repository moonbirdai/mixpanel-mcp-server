# Terminal Instructions

Follow these steps to install and test the Mixpanel MCP server:

## Installation

1. Navigate to the project directory:

```bash
cd /Users/ciaraadkins/Documents/github_repos/mb/mixpanel-mcp-new
```

2. Make scripts executable:

```bash
chmod +x index.js test-mixpanel.js install.sh
```

3. Run the installation script:

```bash
./install.sh 0fa0b5e4615f6676bc5e131ab16eb636
```

The script will:
- Install dependencies
- Test the Mixpanel connection
- Provide instructions for Claude Desktop integration

## Manual Testing

If you prefer to test each component manually:

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Test Mixpanel connection

```bash
./test-mixpanel.js --token 0fa0b5e4615f6676bc5e131ab16eb636
```

### 3. Run the MCP server directly

```bash
./index.js --token 0fa0b5e4615f6676bc5e131ab16eb636 --debug
```

### 4. Test with MCP Inspector

In a new terminal:

```bash
npm install -g @modelcontextprotocol/inspector
npx @modelcontextprotocol/inspector server ./index.js --token 0fa0b5e4615f6676bc5e131ab16eb636
```

## Claude Desktop Integration

1. Edit your Claude Desktop configuration:

```bash
# For macOS
mkdir -p ~/Library/Application\ Support/Claude/
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

2. Add the MCP server configuration:

```json
{
  "mcpServers": {
    "mixpanel-analytics": {
      "command": "node",
      "args": ["/Users/ciaraadkins/Documents/github_repos/mb/mixpanel-mcp-new/index.js", "--token", "0fa0b5e4615f6676bc5e131ab16eb636", "--debug"]
    }
  }
}
```

3. Restart Claude Desktop

4. Monitor logs:

```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

## Troubleshooting

If you encounter any issues:

1. Check that the Mixpanel token is correct
2. Ensure all scripts are executable
3. Verify that Claude Desktop is configured correctly
4. Check the logs for error messages
