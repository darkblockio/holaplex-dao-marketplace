/**
 * @type {import('next').NextConfig}
 */

const { i18n } = require('./next-i18next.config');
const withGraphql = require('next-plugin-graphql');

const securityHeaders = [
  {
    key: 'Referrer-Policy',
    value: 'same-origin'
  }
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  // env: {
  //   gql: 'NEXT_PUBLIC_GRAPHQL_URL',
  //   rpc: 'NEXT_PUBLIC_SOLANA_RPC_URL',
  // },
  i18n,
  async rewrites() {
    return [
      // {
      //   source: '/nfts/:path*/details',
      //   destination: 'https://unpkg.com/@google/model-viewer@1.12.0/dist/model-viewer.min.js',
      // },
    ]
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/nfts/:path*/details',
        headers: securityHeaders,
      },
    ]
  }
};

module.exports = withGraphql(nextConfig);
