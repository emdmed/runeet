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

const PathCard = () => {
    const [folderPath, setFolderPath] = useState("/home/enrique/projects");
    //const [packageFiles, setPackageFiles]


    async function searchPackages(directory) {
        const response = await fetch("/api/find-packages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ directory }),
        });

        const data = await response.json();
        console.log("Found package.json files:", data.packageJsonFiles);
    }

    const handleSearchPackages = async () => {
        const response = await searchPackages(folderPath)
        console.log("handleSearchPackages response", response)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Select directory</CardTitle>
                <CardDescription>
                    Directory absolute path where all your apps are (ex. projects, monorepo)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Input onChange={e => setFolderPath(e.target.value)} value={folderPath} placeholder="Projects absolute path..." />
                    <Button onClick={handleSearchPackages} size="sm">Create</Button>
                </div>

            </CardContent>
        </Card>
    );
};

export default PathCard;
