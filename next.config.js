/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_API_KEY_FALLBACK: process.env.GEMINI_API_KEY_FALLBACK,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;