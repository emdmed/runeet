/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

const filePath = path.join(process.cwd(), 'next.config.mjs');
const envFilePath = path.join(process.cwd(), '.env.local');

const expectedContent = `/** @type {import('next').NextConfig} */
const static_site = false

const nextConfig = {
    ...static_site && { output: "export" },
};

export default nextConfig;
`;

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

// Delete .env.local if it exists
if (fs.existsSync(envFilePath)) {
    fs.unlinkSync(envFilePath);
    console.log('.env.local existed and has been deleted.');
}
