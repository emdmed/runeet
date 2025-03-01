/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express");
const cors = require("cors");
const findPackagesRoute = require("./routes/find-packages")
const killCommandRoute = require("./routes/kill-command")
const monitorProcessesRoute = require("./routes/monitor-processes")
const openEditorRoute = require("./routes/open-editor")
const runCommandRoute = require("./routes/run-command")
const switchBranchRoute = require("./routes/switch-branch")
const checkUpdates = require("./routes/check-updates")

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//Routes
app.use("/api", findPackagesRoute)
app.use("/api", killCommandRoute)
app.use("/api", monitorProcessesRoute)
app.use("/api", openEditorRoute)
app.use("/api", runCommandRoute)
app.use("/api", switchBranchRoute)
app.use("/api", checkUpdates)

// Start the server
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})