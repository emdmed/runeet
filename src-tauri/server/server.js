/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const cors = require("cors");
const findPackagesRoute = require("./routes/find-packages")
const killCommandRoute = require("./routes/kill-command")
const monitorProcessesRoute = require("./routes/monitor-processes")
const openEditorRoute = require("./routes/open-editor")
const runCommandRoute = require("./routes/run-command")
const switchBranchRoute = require("./routes/switch-branch")

const app = express();
app.use(cors());
app.use(express.json());

//Routes
app.use("/", findPackagesRoute)
app.use("/", killCommandRoute)
app.use("/", monitorProcessesRoute)
app.use("/", openEditorRoute)
app.use("/", runCommandRoute)
app.use("/", switchBranchRoute)

// Start the server
const DEFAULT_PORT = 3001;
const server = app.listen(DEFAULT_PORT, () => {
    const { port } = server.address();
    console.log(`Server running at http://localhost:${port}`);
}).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        // If the default port is in use, find an available port dynamically
        const dynamicServer = app.listen(0, () => {
            const { port } = dynamicServer.address();
            console.log(`Default port ${DEFAULT_PORT} was in use. Running on available port: http://localhost:${port}`);
        });
    } else {
        console.error("Server failed to start:", err);
    }
});