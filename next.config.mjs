/** @type {import('next').NextConfig} */
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    '\x1b[41m\x1b[37m%s\x1b[0m',
    ' [CRITICAL WARNING] NEXT_PUBLIC_API_URL is not set for production build! Requests will fallback to localhost:4000. ',
  );
}

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      ...(process.env.NEXT_PUBLIC_BACKEND_URL
        ? [
            {
              protocol: process.env.NEXT_PUBLIC_BACKEND_URL.startsWith('https') ? 'https' : 'http',
              hostname: new URL(process.env.NEXT_PUBLIC_BACKEND_URL).hostname,
              pathname: '/**',
            },
          ]
        : []),
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
