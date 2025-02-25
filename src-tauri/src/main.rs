// Prevents additional console window on Windows in release mode, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};

fn main() {
    // Start the Node.js server and capture stdout
    let mut child = Command::new("node")
        .arg("server/server.js") // Path to your Node.js API
        .stdout(Stdio::piped()) // Capture stdout for reading the port
        .stderr(Stdio::inherit()) // Show stderr in Tauri logs for debugging
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
