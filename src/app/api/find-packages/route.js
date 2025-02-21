import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

/**
 * Recursively searches for package.json files in a given directory.
 * Skips `node_modules` directories.
 *
 * @param dir - The directory to search in.
 * @param maxDepth - Maximum recursion depth (to prevent infinite loops)
 * @param currentDepth - Tracks the current depth of recursion
 * @returns A promise that resolves to an array of absolute paths to package.json files.
 */

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
        const content = await fs.readFile(`${entry.path}/${entry.name}`, "utf-8");
        const jsonPackage = JSON.parse(content)

        console.log("json package", jsonPackage)

        const isVite = jsonPackage?.scripts?.dev === "vite" || false
        const isServer = jsonPackage?.scripts?.start?.includes("node") || false
        const isNext = jsonPackage?.scripts?.dev?.includes("next") || false
        const isReact = jsonPackage?.scripts?.start?.includes("react") || false

        results.push({
          filePath,
          path: entry.path,
          projectName: jsonPackage.name,
          isVite,
          isServer,
          isNext,
          isReact,
          dependencies: jsonPackage.dependencies,
          devDependencies: jsonPackage.devDependencies,
          command: isVite ? "npm run dev" : isServer ? `node ${jsonPackage.main}` : null
        });
      }
    }
  } catch (error) {
    console.error(`Error accessing directory: ${dir}`, error);
  }

  return results;
};

// **POST route to search for package.json in all directories (excluding node_modules)**
export async function POST(req) {
  try {
    const { directory } = await req.json();

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
      return NextResponse.json(
        { error: "Directory does not exist or cannot be accessed" },
        { status: 404 }
      );
    }

    // Find all package.json files (excluding node_modules)
    const packageJsonFiles = await findPackageJsonFiles(directory);

    return NextResponse.json({ packageJsonFiles });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
