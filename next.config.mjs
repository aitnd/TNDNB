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
    async rewrites() {
        return [
            {
                source: '/ontap/:path*',
                destination: '/ontap/index.html',
            },
            {
                source: '/amthuc/:path*',
                destination: '/amthuc/index.html',
            },
        ];
    },
};

export default nextConfig;
