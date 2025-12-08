/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    async rewrites() {
        return [
            {
                source: '/ontap/:path*',
                destination: '/ontap/index.html',
            },
        ];
    },
};

export default nextConfig;
