/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const { exec } = require("child_process");
const { promisify } = require("util");

const router = express.Router();
const execAsync = promisify(exec);

const switchGitBranch = async (directory, branch) => {
    try {
        await execAsync(`git -C "${directory}" rev-parse --is-inside-work-tree`);
        await execAsync(`git -C "${directory}" fetch --all`);
        const { stdout } = await execAsync(`git -C "${directory}" checkout ${branch}`);
        return stdout.trim();
    } catch (error) {
        throw new Error(error.stderr || error.message);
    }
};

router.post("/switch-branch", async (req, res) => {
    try {
        const { directory, branch } = req.body;

        if (!directory || !branch) {
            return res.status(400).json({ error: "Both 'directory' and 'branch' fields are required." });
        }

        console.log(`Switching to branch '${branch}' in '${directory}'...`);

        const output = await switchGitBranch(directory, branch);

        return res.json({ message: `Switched to branch '${branch}'`, output });
    } catch (error) {
        console.error("Git branch switch error:", error.message);
        return res.status(500).json({ error: "Failed to switch branch", details: error.message });
    }
});

module.exports = router;
