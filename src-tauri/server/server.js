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
const DEFAULT_PORT = 5552;
app.listen(DEFAULT_PORT, () => {
    console.log(`Server running at http://localhost:${DEFAULT_PORT}`);
})