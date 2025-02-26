/** @type {import('next').NextConfig} */
const static_site = true

const nextConfig = {
    ...static_site && { output: "export" },
};

export default nextConfig;
