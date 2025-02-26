// Prevents additional console window on Windows in release mode, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::env;
use std::io::{BufRead, BufReader};
use tauri::api::path::resource_dir;

fn main() {
    // Determine the correct path for server.js
    let server_path: PathBuf = if cfg!(debug_assertions) {
        // Development mode (`npm run tauri dev`)
        PathBuf::from("src-tauri/server/server.js")
    } else {
        // Production mode → load from Tauri resources
        let resources = resource_dir().expect("Could not locate resources directory");
        resources.join("server").join("server.js")
    };

    // Convert to string for execution
    let server_path_str = server_path.to_str().expect("Invalid UTF-8 path");

    // Ensure the server.js file exists before attempting to run it
    if !server_path.exists() {
        eprintln!("❌ Error: server.js not found at {:?}", server_path);
        return;
    }

    println!("🚀 Starting Node.js server at: {:?}", server_path_str);

    // Start the Node.js server
    let mut child = match Command::new("node")
        .arg(server_path_str)
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
    if let Err(err) = tauri::Builder::default().run(tauri::generate_context!()) {
        eprintln!("❌ Error while running Tauri application: {}", err);
    }
}
