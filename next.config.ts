import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Externalize database drivers for server-side only
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        'pg-native',
        'sqlite3',
        'mysql',
        'mysql2',
        'oracledb',
        'mssql'
      );
    }

    return config;
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  serverExternalPackages: ["pg-native"],
};

export default nextConfig;
