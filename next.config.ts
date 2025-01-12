/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    API_URL: process.env.API_URL,
    MODE: process.env.MODE,
    // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    // GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    // SECRET: process.env.SECRET,
  },
};

export default nextConfig;
