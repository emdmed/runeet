import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Switches a Git branch in the specified directory.
 * @param {string} directory - The absolute path to the Git repository.
 * @param {string} branch - The branch name to switch to.
 * @returns {Promise<string>} - Git output message.
 */
const switchGitBranch = async (directory, branch) => {
  try {
    // Check if the directory is a Git repo
    await execAsync(`git -C "${directory}" rev-parse --is-inside-work-tree`);

    // Fetch the latest branches before switching
    await execAsync(`git -C "${directory}" fetch --all`);

    // Switch to the target branch
    const { stdout } = await execAsync(`git -C "${directory}" checkout ${branch}`);

    return stdout.trim();
  } catch (error) {
    throw new Error(error.stderr || error.message);
  }
};

/**
 * POST route to switch Git branch.
 * @param {Request} req - The incoming request.
 * @returns {Response} - JSON response.
 */
export async function POST(req) {
  try {
    const { directory, branch } = await req.json();

    if (!directory || !branch) {
      return NextResponse.json(
        { error: "Both 'directory' and 'branch' fields are required." },
        { status: 400 }
      );
    }

    console.log(`Switching to branch '${branch}' in '${directory}'...`);

    const output = await switchGitBranch(directory, branch);

    return NextResponse.json({ message: `Switched to branch '${branch}'`, output });
  } catch (error) {
    console.error("Git branch switch error:", error.message);
    return NextResponse.json(
      { error: "Failed to switch branch", details: error.message },
      { status: 500 }
    );
  }
}
