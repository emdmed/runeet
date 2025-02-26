// Prevents an extra console window on Windows in release mode, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};

use tauri::{api::path::resource_dir, generate_context, Env};

fn main() {
    // Generate Tauri's default context (includes package info, config, etc.)
    let context = generate_context!();

    // Determine the path to your server bundle
    let server_path: PathBuf = if cfg!(debug_assertions) {
        // Development mode: direct path
        PathBuf::from("src-tauri/server/server.js")
    } else {
        // Production mode: load from Tauri's resource directory
        resource_dir(context.package_info(), &Env::default())
            .expect("Could not locate Tauri resource directory")
            .join("server-bundle.js")
    };

    if !server_path.exists() {
        eprintln!("❌ Error: server bundle not found at {:?}", server_path);
        return;
    }

    println!("🚀 Starting Node.js server at: {:?}", server_path);

    // Spawn the Node.js server process, forcing it to use port 5552
    let mut child = match Command::new("node")
        .arg(server_path.to_str().unwrap())
        .stdout(Stdio::piped())   // Capture stdout for logging (if needed)
        .stderr(Stdio::inherit()) // Show errors in Tauri logs
        .spawn()
    {
        Ok(child) => child,
        Err(err) => {
            eprintln!("❌ Failed to start Node.js server: {}", err);
            return;
        }
    };

    // Optionally, read and log Node's stdout for debugging purposes.
    if let Some(stdout) = child.stdout.take() {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(output) = line {
                println!("{}", output);
            }
        }
    }

    println!("✅ Node.js server is set to use port 5552.");
    println!("🟢 Launching Tauri application...");

    // Start Tauri application
    if let Err(err) = tauri::Builder::default().run(context) {
        eprintln!("❌ Error while running Tauri application: {}", err);
    }
}
