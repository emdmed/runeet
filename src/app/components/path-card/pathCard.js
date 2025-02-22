"use client";

import { useEffect, useState } from "react";
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
import { LoaderCircle, Trash, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

///home/enrique/projects

const PathCard = ({ index, handleRemovePathCard, pathCard, setPathCards, pathCards }) => {
    const [folderPath, setFolderPath] = useState(pathCard?.path || "");
    const [packageFiles, setPackageFiles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [allActiveTerminals, setAllActiveTerminals] = useState()
    const [isRunningFilterOn, setIsRunningFilterOn] = useState(false)

    async function searchPackages(directory) {
        setIsLoading(true)
        const response = await fetch("/api/find-packages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ directory }),
        });

        const data = await response.json();
        setPackageFiles(data.packageJsonFiles)
        setIsLoading(false)

        const newPathCards = pathCards.map(card => {
            if (card.path === pathCard.path) {
                return { ...pathCard, path: directory }
            } else {
                return card
            }
        })
        setPathCards([...newPathCards])

        localStorage.setItem("pathCards", JSON.stringify(newPathCards))
    }

    async function monitorTerminals() {

        const response = await fetch('/api/monitor-processes')

        const data = await response.json()

        setAllActiveTerminals(data.terminals)
    }

    const handleSearchPackages = async () => {
        await searchPackages(folderPath)
    }

    const getFolderName = () => {
        try {
            const folderPathArray = folderPath.split("/")
            return folderPathArray[folderPathArray.length - 1]
        } catch (err) {
            console.log(err)
            return "Error"
        }
    }

    useEffect(() => {
        if (pathCard?.path) handleSearchPackages()
    }, [pathCard?.path])

    useEffect(() => {
        monitorTerminals()
        const timer = setInterval(() => {
            monitorTerminals()
        }, 3000);

        return () => clearInterval(timer)
    }, [])

    const toggleFavorite = (packageFile) => {
        const newPackageFiles = packageFiles.map(element => {
            if (element.path === packageFile.path) {
                return { ...element, favorite: !element.favorite }
            } else {
                return element
            }
        })


        console.log("newPackageFiles", newPackageFiles)
        setPackageFiles([...newPackageFiles])
    }

    const handleDeleteFolderPath = () => {
        setPackageFiles([])
        setFolderPath("")
    }

    return (
        <div>
            <Card className="w-[30%] min-w-[600px] bg-stone-900 flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        {packageFiles?.length === 0 ? "Select directory" : "Process list"}
                        <Button onClick={() => handleRemovePathCard(pathCard)} disabled={index < 1} variant="ghost" size="sm" className="text-stone-200"><X /></Button>
                    </CardTitle>
                    <CardDescription>
                        {packageFiles?.length === 0 ? "Directory absolute path where all your apps are (ex. projects, monorepo)" : "Run apps and servers from this list"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0">
                    {isLoading && <div className="flex items-center justify-center w-full p-2">
                        <LoaderCircle className="spinner" /></div>}

                    {packageFiles?.length === 0 && !isLoading ? <div className="flex flex-col">
                        <div className="flex gap-2">
                            <Input onChange={e => setFolderPath(e.target.value)} value={folderPath} placeholder="Projects absolute path..." />
                            <Button onClick={handleSearchPackages} size="sm">Find</Button>
                        </div>
                    </div> : null}

                    {packageFiles?.length > 0 && !isLoading && <div className="flex items-center justify-between">
                        <Badge>{"./"}{getFolderName()}</Badge>
                        <div>
                            <Button onClick={() => setIsRunningFilterOn(prev => !prev)} variant="ghost" size="sm" className={isRunningFilterOn ? "text-lime-300" : "text-stone-700"}><Filter /></Button>
                            <Button onClick={handleDeleteFolderPath} variant="ghost" size="sm" className="text-stone-200"><Trash /></Button>
                        </div>
                    </div>}

                    <div className="mt-2 flex-1 overflow-y-auto px-2">
                        {packageFiles?.length > 0 && packageFiles.filter(element => element.favorite).map(packageFile => {
                            return <ProcessCard isRunningFilterOn={isRunningFilterOn} toggleFavorite={toggleFavorite} allActiveTerminals={allActiveTerminals} key={packageFile?.filePath} packageFile={packageFile} />
                        })}

                        {packageFiles?.length > 0 && packageFiles.filter(element => !element.favorite).map(packageFile => {
                            return <ProcessCard isRunningFilterOn={isRunningFilterOn} toggleFavorite={toggleFavorite} allActiveTerminals={allActiveTerminals} key={packageFile?.filePath} packageFile={packageFile} />
                        })}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default PathCard;
