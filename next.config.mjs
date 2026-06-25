/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: false,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
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
    async redirects() {
        return [
            {
                source: '/amthuc/:path*',
                destination: '/food/:path*',
                permanent: true,
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/ontap/:path*',
                destination: '/ontap/index.html',
            },
            {
                source: '/food/:path*',
                destination: '/food/index.html',
            },
        ];
    },
};

export default nextConfig;
