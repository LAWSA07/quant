/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack configuration for WASM support
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },

  // Moved server external packages to root level
  serverExternalPackages: [
    "@tensorflow/tfjs-node",
    "sharp",
    "pdf-parse",
    "aws-sdk",
    "mock-aws-s3",
    "nock",
  ],

  // Optional: Enable Turbopack (Next.js 13.1+)
  experimental: {
    turbo: true,
  },
};

module.exports = nextConfig;
