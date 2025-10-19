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

    // Aggressive performance optimizations for development
    if (dev && !isServer) {
      // Disable file watching polling for maximum performance
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 100,
        ignored: [
          'node_modules',
          '.git',
          '.next',
          'out',
          'dist',
          'coverage',
          '.nyc_output',
          '.cache',
        ],
      };
      
      // Optimize webpack configuration for fastest builds
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false, // Disable code splitting for faster builds
        moduleIds: 'natural',
        chunkIds: 'natural',
      };

      // Minimize resolve operations
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      };

      // Optimize module resolution
      config.resolve.modules = ['node_modules'];
      config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx'];
      
      // Use eval-source-map for development (Next.js recommended)
      config.devtool = 'eval-source-map';
      
      // Disable performance hints
      config.performance = {
        hints: false,
      };
    }

    return config;
  },
  
  output: 'standalone',
  
  // Minimal experimental features for speed
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'zustand'],
    swcMinify: true,
  },
  
  // Performance settings
  trailingSlash: false,
  assetPrefix: '',
  compress: true,
  poweredByHeader: false,
  
  // Minimal rewrites
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
