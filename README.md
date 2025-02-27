## RunDeck

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
