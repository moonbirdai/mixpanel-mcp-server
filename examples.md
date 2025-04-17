# Mixpanel MCP Server Examples

This document provides practical examples of how to use the Mixpanel MCP server with Claude Desktop and other MCP clients.

## Basic Claude Desktop Examples

Here are some example prompts you can use with Claude Desktop after setting up the Mixpanel MCP server.

### Tracking a Simple Event

```
You: Can you track an event in Mixpanel called "documentation_read" with the property "document_name" set to "user guide"?

Claude: I'll help you track that event in Mixpanel. Let me use the tracking tool.

[Claude uses the Mixpanel track_event tool]

Claude: Successfully tracked the "documentation_read" event in Mixpanel with the document_name property set to "user guide".
```

### Tracking a Page View

```
You: Please track a page view in Mixpanel for the pricing page. The referrer was our blog.

Claude: I'll track that page view in Mixpanel for you.

[Claude uses the Mixpanel track_pageview tool]

Claude: I've tracked a page view for the "pricing" page with "blog" set as the referrer in Mixpanel.
```

### Creating a User Profile

```
You: Create a Mixpanel profile for our new user Jane Smith who signed up with jane@example.com for the premium plan.

Claude: I'll create that user profile in Mixpanel right away.

[Claude uses the Mixpanel track_signup tool]

Claude: Successfully created a profile for Jane Smith with email jane@example.com on the premium plan in Mixpanel.
```

### Updating User Properties

```
You: Update the Mixpanel profile for user john@example.com to set their company to "Acme Inc" and role to "Manager".

Claude: I'll update that user profile in Mixpanel.

[Claude uses the Mixpanel set_user_profile tool]

Claude: Successfully updated the Mixpanel profile for user john@example.com with company set to "Acme Inc" and role set to "Manager".
```

## Advanced Usage Patterns

### Tracking Multiple Events in a Conversation

You can track multiple events throughout a conversation. For example:

```
You: Track that a user visited our homepage.

Claude: I've tracked the page view for the homepage.

You: Now they clicked on the signup button. Can you track that too?

Claude: I've tracked the "button_clicked" event with the button property set to "signup".

You: Great! Now they've completed signup with email user@example.com. Track that as a signup.

Claude: I've tracked the signup event and created a user profile for user@example.com.
```

### Tracking Conversion Funnel

You can track a user's journey through a conversion funnel:

```
You: I want to track a user's journey through our funnel. Start by tracking a page view for the landing page.

Claude: Tracked the page view for the landing page.

You: Now track that they viewed the product page.

Claude: Tracked the page view for the product page.

You: They added an item to their cart. Track that event.

Claude: Tracked the "add_to_cart" event.

You: Finally, they completed checkout with order ID 12345. Track that conversion.

Claude: Tracked the "purchase_completed" event with the order_id property set to 12345.
```

## Programmatic Usage (for Developers)

If you're building your own MCP client, you can call the Mixpanel MCP server tools programmatically:

```javascript
// Example using the MCP client SDK
const client = new McpClient(/* your configuration */);
await client.initialize();

// Track an event
const result = await client.callTool({
  name: "track_event",
  arguments: {
    event_name: "button_clicked",
    distinct_id: "user123",
    properties: {
      button_id: "signup",
      page: "homepage"
    }
  }
});

console.log(result);
```

## Tips for Best Practices

1. **Use Consistent User IDs**: When possible, use the same `distinct_id` across events to build a coherent user journey.

2. **Add Context to Events**: Include relevant properties with each event to make your analytics more useful.

3. **Track Meaningful Events**: Focus on tracking events that provide actionable insights rather than tracking everything.

4. **Follow Privacy Best Practices**: Always comply with privacy regulations and only track data you have permission to collect.

5. **Check Mixpanel Dashboard**: Regularly check your Mixpanel dashboard to ensure events are being tracked correctly.
