import fs from "fs/promises";
import path from "path";

const IGNORE_LIST = ["node_modules", ".next"];

const findPackageJsonFiles = async (
    dir,
    maxDepth,
    currentDepth
) => {
    let results = [];

    // Prevent infinite recursion
    if (currentDepth >= maxDepth) return results;

    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const filePath = path.join(dir, entry.name);

            // Skip `node_modules` directories
            if (entry.isDirectory()) {
                if (IGNORE_LIST.includes(entry.name)) continue; // 🚀 Skip node_modules

                const nestedResults = await findPackageJsonFiles(
                    filePath,
                    maxDepth,
                    currentDepth + 1
                );
                results = results.concat(nestedResults);
            } else if (entry.name === "package.json") {
                const content = await fs.readFile(filePath, "utf-8");
                const jsonPackage = JSON.parse(content)

                console.log("json package dev", jsonPackage?.scripts?.dev, "start", jsonPackage?.name)

                const findFramework = (jsonPackage) => {
                    if (jsonPackage?.scripts?.dev?.includes("vite")) return { framework: "vite", command: "npm run dev" }
                    if (jsonPackage?.scripts?.start?.includes("node")) return { framework: "server", command: "npm start" }
                    if (jsonPackage?.scripts?.dev?.includes("next")) return { framework: "next", command: "npm run dev" }
                    if (jsonPackage?.scripts?.start?.includes("react") || jsonPackage?.scripts?.start.includes("webpack")) return { framework: "react", command: "npm start" }
                    return "unknown"
                }



                results.push({
                    filePath,
                    path: entry.path,
                    projectName: jsonPackage.name,
                    framework: findFramework(jsonPackage).framework,
                    dependencies: jsonPackage.dependencies,
                    devDependencies: jsonPackage.devDependencies,
                    command: findFramework(jsonPackage).command
                });
            }
        }
    } catch (error) {
        console.error(`Error parsing directory: ${dir}`, error);
    }

    return results;
};

export async function findCommands(req, res) {
    try {
        const { directory } = await req.body;

        console.log("Searching in directory:", directory);

        if (!directory || typeof directory !== "string") {
            return NextResponse.json(
                { error: "Invalid directory path" },
                { status: 400 }
            );
        }

        // Ensure the directory exists
        try {
            await fs.access(directory);
        } catch {
            return res.status(404).json({ error: "Directory does not exist or cannot be accessed" })
        }

        // Find all package.json files (excluding node_modules)
        const packageJsonFiles = await findPackageJsonFiles(directory);

        return res.json({ packageJsonFiles });
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
