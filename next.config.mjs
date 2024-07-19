/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/authentication/sign-in", // Change '/your-custom-route' to your desired path
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
