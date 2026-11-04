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
        const standaloneOntapUrl = (process.env.NEXT_PUBLIC_ONTAP_STANDALONE_URL || '').replace(/\/+$/, '');
        return [
            {
                source: '/ontap/:path*',
                destination: standaloneOntapUrl
                    ? `${standaloneOntapUrl}/ontap/:path*`
                    : '/ontap/index.html',
            },
            {
                source: '/food/:path*',
                destination: '/food/index.html',
            },
        ];
    },
};

export default nextConfig;
