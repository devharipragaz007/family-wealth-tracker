/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['prisma', '@prisma/client'],
    optimizePackageImports: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },
  
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Enable SWC minification
  swcMinify: true,
  
  // Configure images
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    minimumCacheTTL: 86400, // 24 hours
    formats: ['image/avif', 'image/webp'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add file-loader for CSV, XLSX files
    config.module.rules.push({
      test: /\.(csv|xlsx|xls)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/files',
            outputPath: `${isServer ? '../' : ''}static/files`,
            name: '[name].[ext]',
          },
        },
      ],
    });
    
    return config;
  },
  
  // Environment variables that should be exposed to the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_EXCEL_SYNC: process.env.NEXT_PUBLIC_EXCEL_SYNC || 'false',
    NEXT_PUBLIC_RD_ADVANCED_COMPOUNDING: process.env.NEXT_PUBLIC_RD_ADVANCED_COMPOUNDING || 'false',
  },
};

module.exports = nextConfig;
