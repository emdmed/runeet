/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");

const router = express.Router();
const execAsync = promisify(exec);
const IGNORE_LIST = ["node_modules", ".next"];

/**
 * Gets the current Git branch of a given directory.
 * @param {string} dir - The directory path.
 * @returns {Promise<string | null>} - The current Git branch or null if not a Git repo.
 */
const getCurrentGitBranch = async (dir) => {
  try {
    const { stdout } = await execAsync(`git -C "${dir}" rev-parse --abbrev-ref HEAD`);
    return stdout.trim();
  } catch {
    return null;
  }
};

/**
 * Retrieves all local Git branches in a repository.
 * @param {string} dir - The Git repository path.
 * @returns {Promise<string[]>} - List of local branches (excluding the current one).
 */
const getAllGitBranches = async (dir) => {
  try {
    const { stdout } = await execAsync(`git -C "${dir}" branch --format="%(refname:short)"`);
    return stdout.trim().split("\n").map(branch => branch.trim());
  } catch {
    return [];
  }
};

/**
 * Recursively searches for package.json files in a given directory.
 * @param {string} dir - The directory to search in.
 * @param {number} maxDepth - Maximum recursion depth.
 * @param {number} currentDepth - Tracks the current depth of recursion.
 * @returns {Promise<Array>} - A list of package.json details with Git branches.
 */
const findPackageJsonFiles = async (dir, maxDepth = 5, currentDepth = 0) => {
  let results = [];

  console.log("dir", dir)

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
        const currentBranch = await getCurrentGitBranch(projectDir);
        const allBranches = await getAllGitBranches(projectDir);

        results.push({
          filePath,
          path: projectDir,
          projectName: jsonPackage.name,
          framework: findFramework(jsonPackage).framework,
          dependencies: jsonPackage.dependencies,
          devDependencies: jsonPackage.devDependencies,
          command: findFramework(jsonPackage).command,
          gitBranch: currentBranch, // Current branch
          availableBranches: allBranches.filter(branch => branch !== currentBranch), // Exclude current branch
        });
      }
    }
  } catch (error) {
    console.error(`Error parsing directory: ${dir}`, error);
  }

  return results;
};

// **POST route to search for package.json files and retrieve Git branches**
router.post("/find-packages", async (req, res) => {
  try {
    const { directory } = req.body;

    if (!directory || typeof directory !== "string") {
      return res.status(400).json({ error: "Invalid directory path" });
    }

    try {
      await fs.access(directory);
    } catch {
      return res.status(404).json({ error: "Directory does not exist or cannot be accessed" });
    }

    const packageJsonFiles = await findPackageJsonFiles(directory);

    return res.json({ packageJsonFiles });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
