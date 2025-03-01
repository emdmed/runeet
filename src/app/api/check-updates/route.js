import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch("https://api.github.com/repos/emdmed/rundeck/releases/latest")

        const data = await response.json()

        return NextResponse.json(data);
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
