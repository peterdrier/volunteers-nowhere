import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'

// Rate limit magic link verification: 10 attempts per IP per hour
DDPRateLimiter.addRule({
  type: 'method',
  name: 'accounts.fistbump.check',
}, 10, 60 * 60 * 1000) // 10 calls per hour

// Rate limit login attempts: 5 per second per connection
DDPRateLimiter.addRule({
  type: 'method',
  name: 'accounts.fistbump.login',
}, 5, 1000) // 5 calls per second

// Rate limit password reset: 3 per minute per connection
DDPRateLimiter.addRule({
  type: 'method',
  name(name) {
    return name.startsWith('Accounts.')
  },
}, 3, 60 * 1000) // 3 calls per minute
