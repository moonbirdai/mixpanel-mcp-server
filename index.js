#!/usr/bin/env node

/**
 * Mixpanel MCP Server
 * A Model Context Protocol server for Mixpanel analytics integration
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";
import { Command } from 'commander';
import { MixpanelClient } from './mixpanel-client.js';

// Parse command line arguments
const program = new Command();
program
  .name('mixpanel-mcp-server')
  .description('MCP server for Mixpanel analytics')
  .version('1.0.0')
  .requiredOption('--token <string>', 'Your Mixpanel project token')
  .option('--debug', 'Enable debug mode for verbose logging', false)
  .parse();

const options = program.opts();
const mixpanelToken = options.token;
const debug = options.debug;

// Debug logging function
function log(...args) {
  if (debug) {
    console.error(`[${new Date().toISOString()}]`, ...args);
  }
}

log(`Initializing Mixpanel MCP server with token: ${mixpanelToken.substring(0, 3)}...`);

// Tool definitions
const tools = [
  {
    name: "mixpanel_track_event",
    description: "Track a custom event in Mixpanel",
    inputSchema: {
      type: "object",
      properties: {
        event_name: { 
          type: "string", 
          description: "Name of the event to track"
        },
        distinct_id: { 
          type: "string", 
          description: "User identifier (optional)"
        },
        properties: { 
          type: "object", 
          description: "Additional properties to track with the event (optional)"
        }
      },
      required: ["event_name"]
    }
  },
  {
    name: "mixpanel_track_pageview",
    description: "Track a page view event in Mixpanel",
    inputSchema: {
      type: "object",
      properties: {
        page_name: { 
          type: "string", 
          description: "Name of the page viewed"
        },
        distinct_id: { 
          type: "string", 
          description: "User identifier (optional)"
        },
        referrer: { 
          type: "string", 
          description: "Referring page (optional)"
        }
      },
      required: ["page_name"]
    }
  },
  {
    name: "mixpanel_track_signup",
    description: "Track a signup event and create a user profile in Mixpanel",
    inputSchema: {
      type: "object",
      properties: {
        user_name: { 
          type: "string", 
          description: "User's full name"
        },
        email: { 
          type: "string", 
          description: "User's email address"
        },
        plan: { 
          type: "string", 
          description: "Signup plan (optional)"
        }
      },
      required: ["user_name", "email"]
    }
  },
  {
    name: "mixpanel_set_user_profile",
    description: "Update a user's profile properties in Mixpanel",
    inputSchema: {
      type: "object",
      properties: {
        distinct_id: { 
          type: "string", 
          description: "User identifier"
        },
        properties: { 
          type: "object", 
          description: "Profile properties to set"
        }
      },
      required: ["distinct_id", "properties"]
    }
  }
];

// Create MCP server
const server = new Server(
  {
    name: "mixpanel-analytics",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Mixpanel client
const mixpanel = new MixpanelClient(mixpanelToken);

// Register tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  log('Received list_tools request');
  return { tools };
});

// Register tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    
    log(`Received call_tool request for: ${name}`);
    
    let result;
    
    switch (name) {
      case "mixpanel_track_event": {
        if (!args.event_name) {
          throw new Error("Missing required parameter: event_name");
        }
        
        const distinctId = args.distinct_id || 'anonymous';
        const properties = args.properties || {};
        
        log(`Tracking event: ${args.event_name} for user: ${distinctId}`);
        
        await mixpanel.trackEvent(args.event_name, {
          distinct_id: distinctId,
          ...properties
        });
        
        result = `Successfully tracked event '${args.event_name}' for user '${distinctId}'`;
        break;
      }
      
      case "mixpanel_track_pageview": {
        if (!args.page_name) {
          throw new Error("Missing required parameter: page_name");
        }
        
        const distinctId = args.distinct_id || 'anonymous';
        const properties = {};
        
        if (args.referrer) {
          properties.referrer = args.referrer;
        }
        
        log(`Tracking pageview: ${args.page_name} for user: ${distinctId}`);
        
        await mixpanel.trackPageView(distinctId, args.page_name, properties);
        
        result = `Successfully tracked page view for '${args.page_name}'`;
        break;
      }
      
      case "mixpanel_track_signup": {
        if (!args.user_name || !args.email) {
          throw new Error("Missing required parameters: user_name and email");
        }
        
        const plan = args.plan || 'free';
        
        log(`Tracking signup for: ${args.user_name} (${args.email}), plan: ${plan}`);
        
        const distinctId = await mixpanel.trackSignup(args.user_name, args.email, plan);
        
        result = `Successfully tracked signup for '${args.user_name}' and created profile with ID '${distinctId}'`;
        break;
      }
      
      case "mixpanel_set_user_profile": {
        if (!args.distinct_id || !args.properties) {
          throw new Error("Missing required parameters: distinct_id and properties");
        }
        
        log(`Updating profile for user: ${args.distinct_id}`);
        
        await mixpanel.setProfile(args.distinct_id, args.properties);
        
        result = `Successfully updated profile for user '${args.distinct_id}'`;
        break;
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
    
    return {
      content: [{ type: "text", text: result }],
    };
  } catch (error) {
    log(`Error in call_tool: ${error.message}`);
    
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start the server
async function runServer() {
  try {
    // Create transport for stdio
    log('Initializing stdio transport');
    const transport = new StdioServerTransport();
    
    // Connect server to transport
    log('Starting MCP server...');
    await server.connect(transport);
    
    log('Mixpanel MCP Server is running via stdio');
  } catch (error) {
    log(`Fatal error starting server: ${error.message}`);
    process.exit(1);
  }
}

// Handle errors and termination
process.on('SIGINT', () => {
  log('Received SIGINT, shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM, shutting down...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`);
  log(error.stack);
  process.exit(1);
});

// Run the server
runServer().catch((error) => {
  log(`Fatal error: ${error.message}`);
  log(error.stack);
  process.exit(1);
});
