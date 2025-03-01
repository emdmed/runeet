import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(request) {
  try {
    const { port } = await request.json();
    if (!port) {
      return NextResponse.json({ error: "Port not provided" }, { status: 400 });
    }
    
    const numericPort = Number(port);
    if (isNaN(numericPort)) {
      return NextResponse.json({ error: "Port must be a valid number" }, { status: 400 });
    }

    const platform = process.platform;
    let command = "";

    if (platform === "win32") {
      command = `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${numericPort}') do taskkill /F /PID %a`;
    } else if (platform === "linux" || platform === "darwin") {
      command = `lsof -t -i :${numericPort} | xargs kill -9`;
    } else {
      return NextResponse.json({ error: "Unsupported platform" }, { status: 500 });
    }

    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      return NextResponse.json({ error: stderr.trim() }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: `Killed process(es) using port ${numericPort}`,
        output: stdout.trim(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
