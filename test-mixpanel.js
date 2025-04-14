#!/usr/bin/env node

/**
 * Test script for Mixpanel MCP Server
 * This sends a test event to Mixpanel using our custom client
 */

import { Command } from 'commander';
import { MixpanelClient } from './mixpanel-client.js';

// Parse command line arguments
const program = new Command();
program
  .name('test-mixpanel')
  .description('Test Mixpanel connectivity')
  .version('1.0.0')
  .requiredOption('--token <string>', 'Your Mixpanel project token')
  .parse();

const options = program.opts();
const mixpanelToken = options.token;

console.log(`Testing Mixpanel connection with token: ${mixpanelToken.substring(0, 3)}...`);

// Initialize Mixpanel client
const mixpanel = new MixpanelClient(mixpanelToken);

// Run test
async function runTest() {
  console.log('Sending test event to Mixpanel...');
  
  try {
    // Send a test event
    const result = await mixpanel.trackEvent('mcp_server_test', {
      distinct_id: 'test_user',
      timestamp: new Date().toISOString(),
      test: true,
      $ip: 0 // Disable geolocation
    });
    
    console.log('Test event sent successfully:', result);
    console.log('Test event sent to Mixpanel. Check your Mixpanel project events to confirm it was received.');
    console.log('Note: There may be a delay before the event appears in the Mixpanel UI.');
  } catch (error) {
    console.error('Error sending test event to Mixpanel:', error.message);
    process.exit(1);
  }
}

runTest();
