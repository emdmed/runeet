/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const os = require("os");

const router = express.Router();
const execAsync = promisify(exec);
const IGNORE_LIST = ["node_modules", ".next"];

const executeCommand = async (command, dir) => {
    const shell = os.platform() === "win32" ? "cmd.exe" : "/bin/sh";
    const fullCommand = os.platform() === "win32"
        ? `cd /d "${dir}" && ${command}`
        : `cd "${dir}" && ${command}`;

    return execAsync(fullCommand, { shell });
};

const getCurrentGitBranch = async (dir) => {
    try {
        const { stdout } = await executeCommand(`git rev-parse --abbrev-ref HEAD`, dir);
        return stdout.trim();
    } catch (error) {
        console.error(`Error getting current branch for ${dir}:`, error.message);
        return null;
    }
};

const getAllGitBranches = async (dir) => {
    try {
        const { stdout } = await executeCommand(`git branch --format="%(refname:short)"`, dir);
        return stdout.trim().split("\n").map(branch => branch.trim());
    } catch (error) {
        console.error(`Error getting branches for ${dir}:`, error.message);
        return [];
    }
};

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
                    gitBranch: currentBranch,
                    availableBranches: allBranches.filter(branch => branch !== currentBranch),
                });
            }
        }
    } catch (error) {
        console.error(`Error parsing directory: ${dir}`, error);
    }

    return results;
};

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
