# 🔍 Production Monitoring Setup Guide

## Overview

This guide will help you set up comprehensive monitoring for your SAPS marketplace to prevent revenue loss and maintain optimal performance.

## 1. Sentry Setup (Error Tracking & Performance)

### Step 1: Create Sentry Account
1. Go to [sentry.io](https://sentry.io) and create an account
2. Create a new project for "Next.js"
3. Note down your DSN (Data Source Name)

### Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token
```

### Step 3: Deploy to Vercel

Add the same environment variables to your Vercel project:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all the Sentry variables above
3. Redeploy your project

## 2. Critical Alerts Setup

### In Sentry Dashboard:

1. **Go to Alerts → Create Alert Rule**
2. **Set up these critical alerts:**

#### Alert 1: High Error Rate
- **Condition:** Error rate > 5% in 5 minutes
- **Action:** Send to Slack/Email
- **Message:** "High error rate detected: {{value}}%"

#### Alert 2: Payment Failures
- **Condition:** Payment error rate > 10%
- **Action:** Immediate notification
- **Message:** "Payment failure spike: {{value}}%"

#### Alert 3: API Performance
- **Condition:** API latency p95 > 2 seconds
- **Action:** Send notification
- **Message:** "Slow API detected: {{endpoint}}"

#### Alert 4: Webhook Failures
- **Condition:** Webhook failure rate > 1%
- **Action:** Critical alert
- **Message:** "Webhook failures detected"

## 3. Business Metrics Dashboard

### Key Metrics to Track:

1. **Conversion Funnel:**
   - Browse → Cart → Checkout → Success
   - Track drop-off at each step

2. **Search Analytics:**
   - Queries with no results
   - Most searched terms
   - Search success rate

3. **Payment Metrics:**
   - Success rate
   - Average order value
   - Payment method distribution

4. **User Behavior:**
   - Cart abandonment rate
   - Session duration
   - Page views per session

## 4. Testing Your Monitoring

### Test Error Tracking:
```javascript
// Add this to any page to test error tracking
function testError() {
  throw new Error('Test error for monitoring');
}
```

### Test Performance Tracking:
- Use slow 3G network in DevTools
- Monitor API response times
- Check database query performance

## 5. Monitoring Checklist

### ✅ Setup Complete When:
- [ ] Sentry DSN configured
- [ ] Error tracking working (test with deliberate error)
- [ ] Performance monitoring active
- [ ] Critical alerts configured
- [ ] Business metrics dashboard created
- [ ] Team notifications set up

### ✅ Daily Monitoring:
- [ ] Check error rate (should be < 1%)
- [ ] Review performance metrics
- [ ] Check payment success rate
- [ ] Monitor search analytics

### ✅ Weekly Review:
- [ ] Analyze conversion funnel
- [ ] Review top errors
- [ ] Check user behavior patterns
- [ ] Optimize based on data

## 6. Troubleshooting

### Common Issues:

**Sentry not tracking errors:**
- Check DSN is correct
- Verify environment variables
- Check browser console for Sentry errors

**Performance data missing:**
- Ensure `tracesSampleRate` > 0
- Check network requests to Sentry
- Verify user context is set

**Alerts not firing:**
- Test alert conditions
- Check notification settings
- Verify webhook endpoints

## 7. Advanced Configuration

### Custom Metrics:
```typescript
// Track custom business events
import { trackBusinessEvent } from '@/lib/monitoring';

trackBusinessEvent('item_sold', {
  itemId: '123',
  price: 5000,
  category: 'shirt'
});
```

### User Context:
```typescript
// Set user context for better error tracking
import { setUserContext } from '@/lib/monitoring';

setUserContext({
  id: user.id,
  email: user.email,
  isSeller: user.isSeller
});
```

## 8. Cost Optimization

### Sentry Pricing:
- **Free Tier:** 5K errors/month, 1K performance transactions
- **Team Plan:** $26/month for 50K errors, 10K performance
- **Business Plan:** $80/month for 200K errors, 50K performance

### Optimization Tips:
- Use sampling for high-traffic events
- Filter out non-critical errors
- Set up data retention policies
- Use performance monitoring selectively

## 9. Next Steps

After monitoring is set up:

1. **Week 1:** Monitor and fix any critical errors
2. **Week 2:** Optimize based on performance data
3. **Week 3:** Implement business metric improvements
4. **Week 4:** Set up advanced analytics and A/B testing

## 10. Support Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Next.js Monitoring Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Alert Rules](https://docs.sentry.io/product/alerts/)

---

**Status:** ✅ Ready for Production  
**Setup Time:** 30 minutes  
**Monthly Cost:** $0 (free tier) to $26 (team plan)  
**ROI:** Prevents $1K-10K+ in lost revenue from undetected issues

