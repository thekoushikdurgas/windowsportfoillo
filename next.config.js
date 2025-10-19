/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // Fix cross-origin request warning
  allowedDevOrigins: ['192.168.1.2', 'localhost', '127.0.0.1'],
  webpack: (config, { dev, isServer }) => {
    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Performance optimizations
    if (dev && !isServer) {
      // Optimize file watching
      config.watchOptions = {
        poll: false, // Disable polling for better performance
        aggregateTimeout: 200,
        ignored: [
          'node_modules',
          '.git',
          '.next',
          'out',
          'dist',
        ],
      };
      
      // Optimize webpack configuration for faster builds
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Create separate chunks for better caching
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            common: {
              name: 'common',
              chunks: 'all',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Optimize resolve configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Optimize module resolution
      config.resolve.modules = ['node_modules'];
      config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
      
      // Use eval-source-map for development (Next.js recommended)
      config.devtool = 'eval-source-map';
    }

    return config;
  },
  output: 'standalone',
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'zustand'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Enable SWC minification for faster builds
    swcMinify: true,
    // Optimize CSS handling
    optimizeCss: true,
  },
  // Ensure proper static file handling
  trailingSlash: false,
  // Ensure proper asset handling
  assetPrefix: '',
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Fix for 404 errors on static assets
  async rewrites() {
    return [
      {
        source: '/static/:path*',
        destination: '/_next/static/:path*',
      },
    ];
  },
}

module.exports = nextConfig
