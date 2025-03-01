## RunDeck v0.5.5

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





![Screenshot from 2025-02-26 23-50-15](https://github.com/user-attachments/assets/3d6e0403-37f8-4d4c-a3bc-cbf62581bf5b)

## RUN AS WEBAPP
1) ```npm run rundeck:web```


## RUN AS DESKTOP DEV MODE (no installation)
1) ```npm run rundeck:desk```

## BUILD DEB PACKAGE
1) ```npm run rundeck:build```
2) navigate to /src-tauri/target/release/bundle/deb
3) ```sudo dpkg -i rundeck_0.1.0_amd64.deb```

## DOWNLOAD DEB PACKAGE AND INSTALL
1) download deb package
2) navigate to download dir
3) ```sudo dpkg -i rundeck_0.1.0_amd64.deb```
