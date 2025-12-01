/** @type {import('next').NextConfig} */
const nextConfig = {
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
