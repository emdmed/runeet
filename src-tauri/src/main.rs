// Prevents additional console window on Windows in release mode, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};

use tauri::{api::path::resource_dir, generate_context, Env};

fn main() {
    // Generate Tauri context (includes package_info, config, etc.)
    let context = generate_context!();

    // Determine the correct path for server.js
    let server_path: PathBuf = if cfg!(debug_assertions) {
        // Development mode (`npm run tauri dev`)
        PathBuf::from("src-tauri/server/server.js")
    } else {
        // Production mode → load from Tauri resources
        resource_dir(context.package_info(), &Env::default())
        .expect("Could not locate resources directory")
        .join("server")
        .join("server.js")
    };

    if !server_path.exists() {
        eprintln!("❌ Error: server.js not found at {:?}", server_path);
        return;
    }

    println!("🚀 Starting Node.js server at: {:?}", server_path);

    // Start the Node.js server
    let mut child = match Command::new("node")
        .arg(server_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .spawn()
    {
        Ok(child) => child,
        Err(err) => {
            eprintln!("❌ Failed to start Node.js server: {}", err);
            return;
        }
    };

    // Read the dynamic port from server logs
    if let Some(stdout) = child.stdout.take() {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(output) = line {
                if output.contains("http://localhost:") {
                    println!("✅ Node.js Server Started at: {}", output);
                    break;
                }
            }
        }
    }

    println!("🟢 Launching Tauri application...");

    // Start Tauri
    if let Err(err) = tauri::Builder::default().run(context) {
        eprintln!("❌ Error while running Tauri application: {}", err);
    }
}
