import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "my-e-com-storage.s3.ap-south-1.amazonaws.com", "d13z55l2fkuutp.cloudfront.net"],
  },
  env: {
    API_URL: process.env.API_URL,
    MODE: process.env.MODE,
    IMGURL: process.env.IMGURL,
    // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    // GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    // SECRET: process.env.SECRET,
  },
};

export default nextConfig;
