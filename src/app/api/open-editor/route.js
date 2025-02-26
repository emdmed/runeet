import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req) {
    try {
        const { command = "code .", path } = await req.json();

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        const fullCommand = `cd ${path} && ${command}`

        try {
            await execAsync(
                fullCommand
            );
        } catch (err) {
            console.log("err", err)
            return NextResponse.json({ error: "Invalid or inaccessible path" }, { status: 400 });
        }

        return NextResponse.json({
            message: "Command executed successfully",
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
