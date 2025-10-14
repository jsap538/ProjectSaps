import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  clerkId: z.string().min(1, 'Clerk ID is required'),
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username too long').optional(),
  profileImageUrl: z.string().url('Invalid profile image URL').optional(),
  isSeller: z.boolean().default(false),
  stripeAccountId: z.string().optional(),
  rating: z.number().min(0).max(5).default(0),
  totalSales: z.number().min(0).default(0),
});

// Item validation schemas
export const itemSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title too long')
    .regex(/^[a-zA-Z0-9\s\-&.,()'"]+$/, 'Title contains invalid characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description too long'),
  brand: z.string()
    .min(1, 'Brand is required')
    .max(50, 'Brand name too long')
    .regex(/^[a-zA-Z0-9\s\-&.,()'"]+$/, 'Brand contains invalid characters'),
  price_cents: z.number()
    .int('Price must be an integer')
    .min(100, 'Minimum price is $1.00')
    .max(1000000, 'Maximum price is $10,000.00'),
  shipping_cents: z.number()
    .int('Shipping must be an integer')
    .min(0, 'Shipping cannot be negative')
    .max(2000, 'Maximum shipping is $20.00'),
  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
  condition: z.enum(['New', 'Like New', 'Good', 'Fair', 'Poor']),
  category: z.enum([
    // Original categories
    'tie', 'belt', 'cufflinks', 'pocket-square',
    // Tops
    'dress-shirt', 'casual-shirt', 't-shirt', 'polo-shirt', 'sweater',
    // Bottoms
    'dress-pants', 'jeans', 'chinos', 'shorts',
    // Outerwear
    'suit-jacket', 'blazer', 'coat',
    // Footwear
    'dress-shoes', 'sneakers', 'boots',
    // Accessories
    'watch', 'bag', 'wallet', 'sunglasses', 'hat', 'scarf',
  ]),
  color: z.string()
    .min(1, 'Color is required')
    .max(30, 'Color name too long')
    .regex(/^[a-zA-Z\s\-]+$/, 'Color contains invalid characters'),
  material: z.string()
    .max(50, 'Material name too long')
    .regex(/^[a-zA-Z\s\-,/()]+$/, 'Material contains invalid characters')
    .optional(),
  location: z.string()
    .min(1, 'Location is required')
    .max(50, 'Location name too long')
    .regex(/^[a-zA-Z\s\-.,]+$/, 'Location contains invalid characters'),
}).passthrough(); // Allow additional dynamic fields

// Update item schema (partial)
export const updateItemSchema = itemSchema.partial().extend({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid item ID'),
});

// Query validation schemas
export const browseQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).default(12),
  category: z.string().optional(),
  brand: z.string().optional(),
  condition: z.string().optional(),
  color: z.string().optional(),
  minPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().max(100, 'Search term too long').optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'created_desc', 'created_asc']).default('created_desc'),
});

// Image upload validation
export const imageUploadSchema = z.object({
  files: z.array(z.instanceof(File))
    .min(1, 'At least one file is required')
    .max(5, 'Maximum 5 files allowed'),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
  skip: z.number().int().min(0).optional(),
});

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  details: z.any().optional(),
});

// Success response schema
export const successResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  message: z.string().optional(),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }).optional(),
});

// Validation helper function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Sanitize and validate helper
export function sanitizeAndValidate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  // Basic sanitization
  const sanitized = JSON.parse(JSON.stringify(data, (key, value) => {
    if (typeof value === 'string') {
      return value.trim().replace(/[<>]/g, '');
    }
    return value;
  }));

  const result = validateInput(schema, sanitized);
  
  if (!result.success && result.errors) {
    return {
      success: false,
      errors: result.errors?.issues.map((err) => `${err.path.join('.')}: ${err.message}`) || []
    };
  }

  return { success: true, data: result.data };
}
