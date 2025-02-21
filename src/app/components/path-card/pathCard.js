"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import ProcessCard from "./components/processCard"

const PathCard = () => {
    const [folderPath, setFolderPath] = useState("/home/enrique/projects");
    const [packageFiles, setPackageFiles] = useState(false)

    async function searchPackages(directory) {
        const response = await fetch("/api/find-packages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ directory }),
        });

        const data = await response.json();
        setPackageFiles(data.packageJsonFiles)
    }

    const handleSearchPackages = async () => {
        const response = await searchPackages(folderPath)
        console.log("handleSearchPackages response", response)
    }

    return (
        <Card className="w-[30%] min-w-[400px] bg-stone-900">
            <CardHeader>
                <CardTitle>{packageFiles.length === 0 ? "Select directory" : "Process list"}</CardTitle>
                <CardDescription>
                    {packageFiles.length === 0 ? "Directory absolute path where all your apps are (ex. projects, monorepo)" : "Run apps and servers from this list"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!packageFiles && <div className="flex gap-2">
                    <Input onChange={e => setFolderPath(e.target.value)} value={folderPath} placeholder="Projects absolute path..." />
                    <Button onClick={handleSearchPackages} size="sm">Create</Button>
                </div>}
                {
                    packageFiles && packageFiles.map(packageFile => {
                        return <ProcessCard key={packageFile.filePath} packageFile={packageFile} />
                    }
                    )
                }

            </CardContent>
        </Card>
    );
};

export default PathCard;
