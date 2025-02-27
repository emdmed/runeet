/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

const filePath = path.join(process.cwd(), 'next.config.mjs');
const envFilePath = path.join(process.cwd(), '.env.local');

const expectedContent = `/** @type {import('next').NextConfig} */
const static_site = true

const nextConfig = {
    ...static_site && { output: "export" },
};

export default nextConfig;
`;

const expectedEnvContent = `NEXT_PUBLIC_API_URL="http://localhost:5552"\n`;

// Check if next.config.mjs exists
if (fs.existsSync(filePath)) {
    const existingContent = fs.readFileSync(filePath, 'utf8');
    
    // Compare content
    if (existingContent.trim() === expectedContent.trim()) {
        console.log('next.config.mjs is already correct. No changes made.');
    } else {
        fs.writeFileSync(filePath, expectedContent, 'utf8');
        console.log('next.config.mjs was different. It has been overwritten with the correct content.');
    }
} else {
    // Create the file if it doesn't exist
    fs.writeFileSync(filePath, expectedContent, 'utf8');
    console.log('next.config.mjs was missing. It has been created.');
}

// Check if .env.local exists
if (fs.existsSync(envFilePath)) {
    const existingEnvContent = fs.readFileSync(envFilePath, 'utf8');
    if (existingEnvContent.trim() !== expectedEnvContent.trim()) {
        fs.writeFileSync(envFilePath, expectedEnvContent, 'utf8');
        console.log('.env.local was different. It has been overwritten with the correct content.');
    } else {
        console.log('.env.local is already correct. No changes made.');
    }
} else {
    fs.writeFileSync(envFilePath, expectedEnvContent, 'utf8');
    console.log('.env.local was missing. It has been created.');
}
