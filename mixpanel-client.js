/**
 * SimpleClient for Mixpanel
 * A simple Promise-based API client for Mixpanel that works around the callback issues
 */

import https from 'https';

export class MixpanelClient {
  constructor(token) {
    this.token = token;
    this.host = 'api.mixpanel.com';
  }

  /**
   * Make a request to the Mixpanel API
   */
  async makeRequest(endpoint, data) {
    return new Promise((resolve, reject) => {
      const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
      
      const options = {
        hostname: this.host,
        port: 443,
        path: `${endpoint}?data=${encodedData}`,
        method: 'GET'
      };
      
      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(responseData === '1' ? true : responseData);
          } else {
            reject(new Error(`HTTP Error: ${res.statusCode} - ${responseData}`));
          }
        });
      });
      
      req.on('error', (e) => {
        reject(e);
      });
      
      req.end();
    });
  }

  /**
   * Track an event in Mixpanel
   */
  async trackEvent(event, properties = {}) {
    const data = {
      event: event,
      properties: {
        ...properties,
        token: this.token,
        time: Math.floor(Date.now() / 1000)
      }
    };
    
    return this.makeRequest('/track', data);
  }

  /**
   * Set user profile properties
   */
  async setProfile(distinctId, properties = {}) {
    const data = {
      $token: this.token,
      $distinct_id: distinctId,
      $set: properties
    };
    
    return this.makeRequest('/engage', data);
  }

  /**
   * Track a page view
   */
  async trackPageView(distinctId, pageName, properties = {}) {
    return this.trackEvent('Page View', {
      distinct_id: distinctId,
      $page: pageName,
      ...properties,
      $ip: 0 // Disable geolocation
    });
  }

  /**
   * Track user signup and create profile
   */
  async trackSignup(userName, email, plan = 'free') {
    // Create deterministic ID from email
    const distinctId = `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    
    // First track signup event
    await this.trackEvent('Sign Up', {
      distinct_id: distinctId,
      plan: plan,
      $ip: 0
    });
    
    // Then set profile
    await this.setProfile(distinctId, {
      $name: userName,
      $email: email,
      plan: plan
    });
    
    return distinctId;
  }
}
