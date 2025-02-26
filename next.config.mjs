/** @type {import('next').NextConfig} */
const static_site = false
const nextConfig = {
    ...static_site && { output: "export" },
};

export default nextConfig;
