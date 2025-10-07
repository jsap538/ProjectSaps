# 🚀 SAPS Production Deployment Guide

## Phase 1: Vercel Deployment

### 1.1 Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set framework preset: Next.js
# - Build command: npm run build
# - Output directory: .next
```

### 1.2 Environment Variables Setup
Set these in Vercel dashboard:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saps_prod

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Stripe (Production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Security
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-domain.com
```

## Phase 2: MongoDB Atlas Setup

### 2.1 Create Production Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create new cluster (M10 or higher for production)
3. Configure network access (whitelist Vercel IPs)
4. Create database user with read/write permissions

### 2.2 Database Configuration
```javascript
// Connection string format
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

## Phase 3: Domain & SSL

### 3.1 Custom Domain Setup
1. Purchase domain (recommend: .com, .co, or .io)
2. Configure DNS in Vercel
3. SSL certificate auto-provisioned

### 3.2 Clerk Domain Configuration
1. Add production domain to Clerk
2. Update webhook endpoints
3. Configure OAuth redirect URLs

## Phase 4: Production Testing

### 4.1 Performance Testing
- [ ] Lighthouse audit (90+ scores)
- [ ] Core Web Vitals optimization
- [ ] Load testing with realistic traffic
- [ ] Database query optimization

### 4.2 Security Testing
- [ ] Penetration testing
- [ ] OWASP security audit
- [ ] Rate limiting validation
- [ ] Authentication flow testing

### 4.3 User Experience Testing
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness
- [ ] Accessibility compliance (WCAG 2.1)
- [ ] Error handling and recovery

## Phase 5: Monitoring & Analytics

### 5.1 Application Monitoring
- Vercel Analytics (built-in)
- Sentry for error tracking
- MongoDB Atlas monitoring
- Custom performance metrics

### 5.2 Business Metrics
- Google Analytics 4
- Conversion tracking
- User behavior analytics
- Revenue tracking

## Production URLs Structure

```
Production: https://saps-marketplace.com
Staging:    https://staging-saps-marketplace.vercel.app
Admin:      https://saps-marketplace.com/admin
API:        https://saps-marketplace.com/api/items
Webhooks:   https://saps-marketplace.com/api/webhooks/clerk
```

## Rollback Strategy

1. **Database**: MongoDB Atlas point-in-time recovery
2. **Application**: Vercel deployment rollback
3. **DNS**: Quick DNS record changes
4. **Monitoring**: Real-time alerting for issues

## Cost Estimation

### Monthly Costs (Production Scale)
- **Vercel Pro**: $20/month (unlimited bandwidth)
- **MongoDB Atlas M10**: $57/month (2GB RAM, 10GB storage)
- **Domain**: $12/year
- **SSL**: Free (Let's Encrypt via Vercel)
- **Monitoring**: $0-50/month (depending on usage)

**Total: ~$80-130/month for production-ready setup**

## Next Steps

1. ✅ Deploy to Vercel staging
2. ✅ Configure MongoDB Atlas
3. ✅ Set up production environment variables
4. ✅ Configure custom domain
5. ✅ Conduct production testing
6. ✅ Set up monitoring and analytics
7. ✅ Launch to production
