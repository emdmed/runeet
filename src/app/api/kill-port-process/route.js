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

    if (port < 3000) {
      return NextResponse.json({ error: "This port process might be not safe to kill" }, { status: 400 });
    }
    const numericPort = Number(port);
    if (isNaN(numericPort) || numericPort <= 0) {
      return NextResponse.json({ error: "Port must be a valid positive number" }, { status: 400 });
    }

    const platform = process.platform;
    let command = "";

    if (platform === "win32") {
      command = `for /f "tokens=5" %a in ('netstat -ano | findstr :${numericPort}') do taskkill /F /PID %a`;
    } else if (platform === "linux") {
      command = `fuser -k ${numericPort}/tcp 2>/dev/null || true`;
    } else if (platform === "darwin") {
      command = `lsof -t -i :${numericPort} | xargs kill -9 2>/dev/null || true`;
    } else {
      return NextResponse.json({ error: "Unsupported platform" }, { status: 500 });
    }

    try {
      const { stdout } = await execPromise(command);
      return NextResponse.json(
        {
          killed: true,
          message: `Killed process(es) using port ${numericPort}`,
          output: stdout.trim(),
        },
        { status: 200 }
      );
    } catch (execError) {
      return NextResponse.json({ error: `Failed to kill process: ${execError.message}` }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
