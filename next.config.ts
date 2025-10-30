import type {NextConfig} from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  devIndicators: false,
  
  // Performance optimizations for filesystem
  distDir: '.next',
  generateBuildId: async () => {
    // Use a consistent build ID for better caching
    return `build-${Date.now()}`;
  },
  
  // Optimize for local development and production
  compress: true,
  
  // Optimize build output
  output: 'standalone',
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    // Optimize for better performance
    resolveAlias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
  // Enable experimental features for better performance
  experimental: {
    // Optimize memory usage
    memoryBasedWorkersCount: true,
    // Enable faster builds
    webpackBuildWorker: true,
  },
  
  // Webpack optimizations (only used when not using Turbopack)
  webpack: (config, { dev }) => {
    // Only apply webpack optimizations when not using Turbopack
    if (process.env['TURBOPACK']) {
      return config;
    }
    
    // Fix Node.js modules for browser environment
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'tls': false,
      'net': false,
      'http2': false,
      'dns': false,
      'fs': false,
      'path': false,
      'os': false,
      'crypto': false,
      'stream': false,
      'util': false,
      'url': false,
      'querystring': false,
      'buffer': false,
      'process': false,
      'events': false,
      'assert': false,
      'constants': false,
      'timers': false,
      'child_process': false,
      'cluster': false,
      'worker_threads': false,
      'perf_hooks': false,
      'async_hooks': false,
      'inspector': false,
      'trace_events': false,
      'v8': false,
      'vm': false,
      'zlib': false,
      'readline': false,
      'repl': false,
      'tty': false,
      'punycode': false,
      'string_decoder': false,
      'sys': false,
      'http': false,
      'https': false,
    };
    
    // Optimize for development
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    
    // Optimize file system operations
    config.snapshot = {
      managedPaths: [path.resolve(__dirname, 'node_modules')],
    };

    // Advanced code splitting and optimization
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -5,
            reuseExistingChunk: true,
          },
          // AI-related chunks
          ai: {
            test: /[\\/]src[\\/]ai[\\/]/,
            name: 'ai',
            priority: 10,
            chunks: 'all',
          },
          // App components
          apps: {
            test: /[\\/]src[\\/]components[\\/]apps[\\/]/,
            name: 'apps',
            priority: 5,
            chunks: 'all',
          },
          // UI components
          ui: {
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            priority: 5,
            chunks: 'all',
          },
        },
      },
    };

    // Tree shaking optimization
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;
    
    // Handle OpenTelemetry instrumentation warnings
    config.module.rules.push({
      test: /node_modules\/@opentelemetry\/instrumentation\/build\/esm\/platform\/node\/instrumentation\.js$/,
      use: 'null-loader',
    });
    
    // Ignore critical dependency warnings for OpenTelemetry
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve 'tls'/,
      /Module not found: Can't resolve 'net'/,
      /Module not found: Can't resolve 'http2'/,
      /Module not found: Can't resolve 'dns'/,
    ];
    
    return config;
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configure allowed development origins for cross-origin requests
  allowedDevOrigins: ['192.168.1.2', 'localhost', '127.0.0.1'],
};

export default nextConfig;
