import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections to maintain
      maxIdleTimeMS: 60000, // Close connections after 60s of inactivity
      serverSelectionTimeoutMS: 10000, // Timeout for server selection
      socketTimeoutMS: 45000, // Timeout for socket operations
      family: 4, // Use IPv4, skip trying IPv6
      // Performance optimizations
      retryWrites: true,
      retryReads: true,
      compressors: ['zlib'] as ('zlib' | 'snappy' | 'zstd')[], // Enable compression
    };

    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ MongoDB connected with optimized connection pool');
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;
