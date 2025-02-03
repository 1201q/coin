import { NextConfig } from 'next/types';

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  images: {
    domains: ['static.upbit.com'],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

module.exports = nextConfig;
