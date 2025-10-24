import * as Sentry from '@sentry/nextjs';

/**
 * Business metrics tracking for marketplace analytics
 */

// Track conversion funnel events
export const trackConversionEvent = (event: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    category: 'conversion',
    message: event,
    level: 'info',
    data,
  });
  
  // Track as custom metric
  Sentry.addBreadcrumb({
    category: 'conversion_metric',
    message: `conversion.${event}`,
    level: 'info',
    data: { event, count: 1 },
  });
};

// Track user actions
export const trackUserAction = (action: string, userId?: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    category: 'user_action',
    message: action,
    level: 'info',
    data: { userId, ...data },
  });
};

// Track API performance
export const trackApiPerformance = (endpoint: string, duration: number, status: number) => {
  Sentry.addBreadcrumb({
    category: 'api_performance',
    message: `API call to ${endpoint}`,
    level: 'info',
    data: {
      endpoint,
      duration,
      status,
      slow: duration > 2000,
    },
  });
  
  if (duration > 2000) { // Alert on slow APIs
    Sentry.captureMessage(`Slow API endpoint: ${endpoint} took ${duration}ms`, 'warning');
  }
};

// Track business events
export const trackBusinessEvent = (event: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    category: 'business',
    message: event,
    level: 'info',
    data,
  });
  
  Sentry.addBreadcrumb({
    category: 'business_metric',
    message: `business.${event}`,
    level: 'info',
    data: { event, count: 1 },
  });
};

// Track errors with context
export const trackError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    contexts: {
      custom: context,
    },
  });
};

// Track payment events
export const trackPaymentEvent = (event: string, orderId?: string, amount?: number) => {
  Sentry.addBreadcrumb({
    category: 'payment',
    message: event,
    level: 'info',
    data: { orderId, amount },
  });
  
  Sentry.addBreadcrumb({
    category: 'payment_metric',
    message: `payment.${event}`,
    level: 'info',
    data: { event, orderId, amount, count: 1 },
  });
};

// Track search analytics
export const trackSearchEvent = (query: string, resultsCount: number, hasResults: boolean) => {
  Sentry.addBreadcrumb({
    category: 'search',
    message: 'Search performed',
    level: 'info',
    data: { query, resultsCount, hasResults },
  });
  
  Sentry.addBreadcrumb({
    category: 'search_metric',
    message: 'search.performed',
    level: 'info',
    data: { query, resultsCount, hasResults, count: 1 },
  });
  
  if (!hasResults) {
    Sentry.addBreadcrumb({
      category: 'search_metric',
      message: 'search.no_results',
      level: 'info',
      data: { query, count: 1 },
    });
  }
};

// Track cart events
export const trackCartEvent = (event: string, itemId?: string, quantity?: number) => {
  Sentry.addBreadcrumb({
    category: 'cart',
    message: event,
    level: 'info',
    data: { itemId, quantity },
  });
  
  Sentry.addBreadcrumb({
    category: 'cart_metric',
    message: `cart.${event}`,
    level: 'info',
    data: { event, itemId, quantity, count: 1 },
  });
};

// Track item events
export const trackItemEvent = (event: string, itemId: string, category?: string, price?: number) => {
  Sentry.addBreadcrumb({
    category: 'item',
    message: event,
    level: 'info',
    data: { itemId, category, price },
  });
  
  Sentry.addBreadcrumb({
    category: 'item_metric',
    message: `item.${event}`,
    level: 'info',
    data: { event, itemId, category, price, count: 1 },
  });
};

// Set user context for better error tracking
export const setUserContext = (user: { id: string; email?: string; isSeller?: boolean }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.email,
  });
  
  Sentry.setTag('user_type', user.isSeller ? 'seller' : 'buyer');
};

// Track performance metrics
export const trackPerformance = (metric: string, value: number, unit?: string) => {
  Sentry.addBreadcrumb({
    category: 'performance_metric',
    message: `performance.${metric}`,
    level: 'info',
    data: { metric, value, unit: unit || 'ms' },
  });
};

