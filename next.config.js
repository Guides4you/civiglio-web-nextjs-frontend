/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Supporto CSS/SCSS globale
  sassOptions: {
    includePaths: ['./src/assets/css'],
  },

  // Transpile Ant Design e altri moduli se necessario
  transpilePackages: ['antd', '@ant-design/icons'],

  // Ottimizzazioni immagini
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'civigliowebba8ebe1e07b047938f92b0cad411ac6f221800-test.s3.eu-west-1.amazonaws.com',
      },
    ],
  },

  // Env vars pubbliche
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Disabilita source maps in produzione (come React)
  productionBrowserSourceMaps: false,

  // Webpack config custom (necessario per AWS Amplify)
  webpack: (config, { isServer }) => {
    // Fix per moduli che usano fs/path/child_process/http2 (necessario per Amplify)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        child_process: false,
        http2: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
