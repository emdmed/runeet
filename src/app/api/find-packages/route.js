import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const IGNORE_LIST = ["node_modules", ".next"];

/**
 * Gets the Git branch of a given directory.
 * @param {string} dir - The directory path.
 * @returns {Promise<string>} - The Git branch or "Not a Git repo".
 */
const getGitBranch = async (dir) => {
  try {
    const { stdout } = await execAsync(`git -C "${dir}" rev-parse --abbrev-ref HEAD`);
    return stdout.trim();
  } catch (error) {
    console.log(error)
    return "Not a Git repo";
  }
};

/**
 * Recursively searches for package.json files in a given directory.
 * Skips `node_modules` directories.
 *
 * @param {string} dir - The directory to search in.
 * @param {number} maxDepth - Maximum recursion depth (to prevent infinite loops)
 * @param {number} currentDepth - Tracks the current depth of recursion
 * @returns {Promise<Array>} - A list of package.json details.
 */
const findPackageJsonFiles = async (dir, maxDepth = 5, currentDepth = 0) => {
  let results = [];

  if (currentDepth >= maxDepth) return results;

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const filePath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (IGNORE_LIST.includes(entry.name)) continue;

        const nestedResults = await findPackageJsonFiles(filePath, maxDepth, currentDepth + 1);
        results = results.concat(nestedResults);
      } else if (entry.name === "package.json") {
        const content = await fs.readFile(filePath, "utf-8");
        const jsonPackage = JSON.parse(content);

        const findFramework = (jsonPackage) => {
          if (jsonPackage?.scripts?.dev?.includes("vite")) return { framework: "vite", command: "npm run dev" };
          if (jsonPackage?.scripts?.start?.includes("node")) return { framework: "server", command: "npm start" };
          if (jsonPackage?.scripts?.dev?.includes("next")) return { framework: "next", command: "npm run dev" };
          if (jsonPackage?.scripts?.start?.includes("react") || jsonPackage?.scripts?.start.includes("webpack")) 
            return { framework: "react", command: "npm start" };
          return { framework: "unknown", command: "N/A" };
        };

        const projectDir = path.dirname(filePath);
        const gitBranch = await getGitBranch(projectDir);

        results.push({
          filePath,
          path: projectDir,
          projectName: jsonPackage.name,
          framework: findFramework(jsonPackage).framework,
          dependencies: jsonPackage.dependencies,
          devDependencies: jsonPackage.devDependencies,
          command: findFramework(jsonPackage).command,
          gitBranch, // Added Git branch info
        });
      }
    }
  } catch (error) {
    console.error(`Error parsing directory: ${dir}`, error);
  }

  return results;
};

// **POST route to search for package.json files**
export async function POST(req) {
  try {
    const { directory } = await req.json();


    if (!directory || typeof directory !== "string") {
      return NextResponse.json(
        { error: "Invalid directory path" },
        { status: 400 }
      );
    }

    try {
      await fs.access(directory);
    } catch {
      return NextResponse.json(
        { error: "Directory does not exist or cannot be accessed" },
        { status: 404 }
      );
    }

    const packageJsonFiles = await findPackageJsonFiles(directory);

    console.log("packageJsonFiles", packageJsonFiles);

    return NextResponse.json({ packageJsonFiles });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
