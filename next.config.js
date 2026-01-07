/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ============================================
  // 输出配置（用于 Docker 部署）
  // Output Configuration
  // ============================================
  output: 'standalone',

  // ============================================
  // 图片优化配置
  // Image Optimization Configuration
  // ============================================
  images: {
    domains: [
      'your-project.supabase.co',
      'images.unsplash.com',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // ============================================
  // 压缩配置
  // Compression Configuration
  // ============================================
  compress: true,
  poweredByHeader: false,

  // ============================================
  // 实验性功能
  // Experimental Features
  // ============================================
  experimental: {
    // 优化包导入
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // ============================================
  // 性能优化
  // Performance Optimization
  // ============================================
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ============================================
  // 环境变量
  // Environment Variables
  // ============================================
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },

  // ============================================
  // 生产源映射（仅在开发环境）
  // Production Source Maps
  // ============================================
  productionBrowserSourceMaps: false,

  // ============================================
  // Webpack 配置
  // Webpack Configuration
  // ============================================
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },

  // ============================================
  // 日志配置
  // Logging Configuration
  // ============================================
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
}

module.exports = nextConfig
