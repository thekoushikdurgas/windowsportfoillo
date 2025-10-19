/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  webpack: (config, { dev, isServer }) => {
    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Development-specific optimizations
    if (dev && !isServer) {
      // Enhanced file watching
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: 'node_modules',
      };
      
      // Fix for webpack hot-update.json 404 errors
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
        chunkIds: 'named',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Create a separate chunk for vendor libraries
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
            },
          },
        },
      };

      // Ensure proper HMR configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Enable source maps for better debugging
      config.devtool = 'eval-source-map';
    }

    return config;
  },
  output: 'standalone',
  // Enhanced Fast Refresh configuration
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Development-specific settings
  trailingSlash: false,
  swcMinify: true,
  assetPrefix: '',
  // Handle static assets
  async rewrites() {
    return [
      {
        source: '/static/:path*',
        destination: '/_next/static/:path*',
      },
    ];
  },
  // Development headers for better debugging
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
