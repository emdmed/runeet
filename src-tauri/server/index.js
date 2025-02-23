/* eslint-disable @typescript-eslint/no-require-imports */

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to list files in a directory
app.get("/api/find-packages", (req, res) => {
    const directoryPath = path.join(__dirname, "../user-files"); // Change this to the target directory
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Could not read directory" });
        }
        res.json({ files });
    });
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
