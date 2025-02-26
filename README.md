**RunDeck

![Screenshot from 2025-02-26 23-50-15](https://github.com/user-attachments/assets/3d6e0403-37f8-4d4c-a3bc-cbf62581bf5b)

## RUN AS WEBAPP
1) delete .env.local if you have it or remove NEXT_PUBLIC_API_URL env var
2) in next.conf.mjs change static_site to false
2) ```npm run dev```

## RUN AS DESKTOP DEV MODE (no installation)
1) create .env.local & add ```NEXT_PUBLIC_API_URL="http://localhost:5552"```
2) in next.conf.mjs change ```static_site``` to true
3) ```npm run rundeck:dev```

## BUILD DEB PACKAGE
1) create .env.local & add ```NEXT_PUBLIC_API_URL="http://localhost:5552"```
2) in next.conf.mjs change static_site to true
3) ```npm run rundeck:build```
4) navigate to /src-tauri/target/release/bundle/deb
5) ```sudo dpkg -i rundeck_0.1.0_amd64.deb```

## DOWNLOAD DEB PACKAGE AND INSTALL
1) download deb package
2) navigate to download dir
3) ```sudo dpkg -i rundeck_0.1.0_amd64.deb```
