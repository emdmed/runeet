// Prevents additional console window on Windows in release mode, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio};
use std::env;
use std::io::{BufRead, BufReader};
use std::path::PathBuf;

fn main() {
    // Determine the correct path for server.js
    let server_path = if cfg!(debug_assertions) {
        // Dev mode (when running `npm run tauri dev`)
        PathBuf::from("src-tauri/server/server.js")
    } else {
        // Production mode (when running the installed app)
        env::current_exe()
            .expect("Failed to get executable path")
            .parent()
            .expect("Failed to get executable directory")
            .join("server/server.js")
    };

    // Convert to string for execution
    let server_path_str = server_path.to_str().expect("Invalid UTF-8 path");

    println!("Starting Node.js server at: {:?}", server_path_str);

    // Start the Node.js server
    let mut child = Command::new("node")
        .arg(server_path_str)
        .stdout(Stdio::piped()) // Capture stdout for reading the port
        .stderr(Stdio::inherit()) // Show stderr in Tauri logs
        .spawn()
        .expect("Failed to start Node.js server");

    // Read the dynamic port from the server logs
    if let Some(stdout) = child.stdout.take() {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(output) = line {
                if output.contains("http://localhost:") {
                    println!("Node.js Server Started at: {}", output);
                    break;
                }
            }
        }
    }

    // Start Tauri application
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
