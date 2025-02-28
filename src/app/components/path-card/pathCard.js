/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

import ProcessCard from "./components/processCard"
import { LoaderCircle, Minus, Square, Trash, X } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Filter } from "lucide-react";
import { useApi } from "@/app/hooks/useApi";

const PathCard = ({ handleRemovePathCard, pathCard, setPathCards, pathCards, allActiveTerminals }) => {
    const [folderPath, setFolderPath] = useState(pathCard?.path || "");
    const [packageFiles, setPackageFiles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const { routes } = useApi()

    const [isRunningFilterOn, setIsRunningFilterOn] = useState(false)


    async function searchPackages(directory) {
        setIsLoading(true)
        const response = await fetch(routes.findPackages, {
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

    const toggleFavorite = (packageFile) => {
        const newPackageFiles = packageFiles.map(element => {
            if (element.path === packageFile.path) {
                return { ...element, favorite: !element.favorite }
            } else {
                return element
            }
        })

        setPackageFiles([...newPackageFiles])
    }

    const handleDeleteFolderPath = () => {
        setPackageFiles([])
        setFolderPath("")
    }

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchPackages()
        }
    }

    return (
        <div className="px-2 mb-2 flex">
            <Card className="w-fit min-w-[500px] flex flex-col h-full">
                <CardHeader className={`${isCollapsed ? "p-0 px-2" : ""}`}>
                    <CardTitle className="flex justify-between items-center">
                        {packageFiles?.length === 0 && "Select directory"}
                        {packageFiles?.length > 0 && <div className="flex items-center gap-1">
                            <Badge className="me-3">{"./"}{getFolderName()}</Badge>
                        </div>}
                        <div className="gap-1 flex">
                            <Button onClick={() => setIsRunningFilterOn(prev => !prev)} variant="ghost" size="sm" className={`${isRunningFilterOn ? "text-primary" : "text-stone-700 "} p-2 hover:bg-primary hover:text-black`}><Filter /></Button>
                            <Button onClick={handleDeleteFolderPath} variant="ghost" size="sm" className="p-2 bg-dark text-destructive hover:bg-destructive hover:text-black"><Trash /></Button>
                            <Button onClick={() => setIsCollapsed(prev => !prev)} size="sm" variant="ghost" className="text-stone-200 p-2">{isCollapsed ? <Square /> : <Minus />}</Button>
                            <Button onClick={() => handleRemovePathCard(pathCard)} variant="ghost" size="sm" className="text-stone-200 p-2"><X /></Button>
                        </div>
                    </CardTitle>
                    {packageFiles?.length === 0 && <CardDescription>
                        {"Directory absolute path where all your apps are (ex. projects, monorepo)"}
                    </CardDescription>}
                </CardHeader>
                {!isCollapsed && <CardContent className={`flex-1 flex flex-col min-h-0 swing-in-top-fwd`}>
                    {isLoading && <div className="flex items-center justify-center w-full p-2">
                        <LoaderCircle className="spinner" /></div>}

                    {packageFiles?.length === 0 && !isLoading ? <div className="flex flex-col">
                        <div className="flex gap-2">
                            <Input onKeyDown={onKeyDown} onChange={e => setFolderPath(e.target.value)} value={folderPath} placeholder="Projects absolute path..." />
                            <Button onClick={handleSearchPackages} size="sm">Find</Button>
                        </div>
                    </div> : null}

                    {packageFiles?.length > 0 && !isLoading && <div className="flex items-center justify-end">

                    </div>}

                    <div className="flex-1 overflow-y-auto px-2">
                        {packageFiles?.length > 0 && packageFiles.filter(element => element.favorite).map(packageFile => {
                            return <ProcessCard setPackageFiles={setPackageFiles} isRunningFilterOn={isRunningFilterOn} toggleFavorite={toggleFavorite} allActiveTerminals={allActiveTerminals} key={packageFile?.filePath} packageFile={packageFile} />
                        })}

                        {packageFiles?.length > 0 && packageFiles.filter(element => !element.favorite).map(packageFile => {
                            return <ProcessCard isRunningFilterOn={isRunningFilterOn} toggleFavorite={toggleFavorite} allActiveTerminals={allActiveTerminals} key={packageFile?.filePath} packageFile={packageFile} />
                        })}
                    </div>

                </CardContent>}
            </Card>
        </div>
    );
};

export default PathCard;
