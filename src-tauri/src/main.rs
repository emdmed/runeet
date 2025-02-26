// Prevents an extra console window on Windows in release mode, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use std::thread;

use tauri::{api::path::resource_dir, generate_context, Env};

fn main() {
    let context = generate_context!();

    let server_path: PathBuf = if cfg!(debug_assertions) {
        // Development mode: direct path
        PathBuf::from("./server/dist/server-bundle.js")
    } else {
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
        .env("PORT", "5552") // Force the Node server to use port 5552
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

    // Spawn a new thread to read Node's stdout so it doesn't block the main thread.
    if let Some(stdout) = child.stdout.take() {
        thread::spawn(move || {
            let reader = BufReader::new(stdout);
            for line in reader.lines() {
                if let Ok(output) = line {
                    println!("{}", output);
                }
            }
        });
    }

    println!("✅ Node.js server is set to use port 5552.");
    println!("🟢 Launching Tauri application...");

    // Start Tauri application (this call is blocking)
    if let Err(err) = tauri::Builder::default().run(context) {
        eprintln!("❌ Error while running Tauri application: {}", err);
    }

    // After the Tauri app closes, kill the Node.js server.
    match child.kill() {
        Ok(_) => println!("✅ Node.js server terminated successfully."),
        Err(e) => eprintln!("❌ Failed to kill Node.js server: {}", e),
    }

    // Optionally, wait for the process to exit completely.
    let _ = child.wait();
}
