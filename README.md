## RunDeck v0.5.6

Website https://exhilarated-aims-580481.framer.app/ (sorry, no domain yet)

## ✨ What's RunDeck?

It's a desktop/web app that makes managing your React, Next.js, Vite, and Node servers effortless!

Web version Supports windows, ubuntu, ios. (tested only in ubuntu for now)

Desktop app right now only available for Ubuntu

✅ Auto-detect projects – Just enter a folder path, and RunDeck lists all available servers.

⭐ Favorite projects – Keep important projects at the top for quick access.

🚀 One-click start & stop – Launch or stop dev servers instantly.

🌐 Open in browser – Click the terminal URL to preview your app.

🔁 Git branch management – Switch between branches with ease.

🖥 Open in VS Code – Jump straight into coding with a single click.

🌐 Manage ports - lists in use ports - kill processes using ports (> 3000 ports only)





![image](https://github.com/user-attachments/assets/e6a50c2c-ce3b-4217-82a2-48515aff20ad)


RunDeck can be ran as a local web app or as a desktop app. The desktop app has been only tested in Ubuntu 22.04 for now.

## RUN AS WEBAPP
1) ```npm run rundeck:web```

## RUN AS DESKTOP DEV MODE (no installation)
1) Clone repo
2) ```npm install```
3) ```npm run rundeck:desk```

## RUN AS DESKTOP - BUILD & INSTALL DEB PACKAGE
1) Clone repo
2) ```npm install```
3) ```npm run rundeck:build```
4) navigate to /src-tauri/target/release/bundle/deb
5) ```sudo dpkg -i rundeck_0.1.0_amd64.deb```

## RUN AS DESKTOP - DOWNLOAD DEB PACKAGE AND INSTALL
1) download deb package
2) navigate to download dir
3) ```sudo dpkg -i rundeck_0.1.0_amd64.deb```
