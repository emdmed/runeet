import {
    Card,
    CardContent,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Play } from "lucide-react";
import { Square, Code } from "lucide-react";
import { useEffect, useState } from "react";

import GitDisplay from "./components/gitDisplay"
import { useApi } from "@/app/hooks/useApi";
import Port from "./components/port"
import { toast } from "sonner";
import FavoriteButton from "./components/favoriteButton"
import { useFavorites } from "@/app/hooks/useFavorites";
import { useSettings } from "../../../hooks/useSettings";
import { TooltipTrigger, Tooltip, TooltipContent } from "../../../../components/ui/tooltip";
import { useTheme } from "next-themes";

const ProcessCard = ({ packageFile, allActiveTerminals, isRunningFilterOn, setPackageFiles, packageFiles, isFavoriteFilter }) => {

    const [currentProcess, setCurrentProcess] = useState()
    const { routes } = useApi()
    const [port, setPort] = useState("")

    const { currentSettings } = useSettings()

    const { theme } = useTheme()

    const { isFavorite, toggleFavorite } = useFavorites(packageFile.path)

    const createCommand = (process, port) => {
        const portHandler = {
            vite: "-- --port",
            server: "-- --port",
            next: "-- -p",
            default: "-- --p",
            react: "-- --port"
        }

        const command = `${process.command} ${port ? `${portHandler[process?.framework || portHandler.default]} ${port}` : ""}`
        return command
    }

    async function runProcess(process) {

        const startCommand = createCommand(process, port)

        const response = await fetch(routes.runCommand, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                command: startCommand,
                path: process.path,
                port,
                framework: packageFile.framework
            }),
        })

        const jsonRes = await response.json()

        if (!response.ok) {
            toast.error(jsonRes?.error || "Unknown error", {
                description: jsonRes?.details || "",
            });

            return
        }

        if (jsonRes?.isPortUnavailable) {
            setCurrentProcess({ ...jsonRes, isPortUnavailable: true })
        } else {
            setCurrentProcess({ ...jsonRes, state: "running", startCommand })
        }
    }

    async function killProcess() {
        const response = await fetch(routes.killCommand, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                path: currentProcess?.executedPath || currentProcess?.cwd || currentProcess?.path || null
            }),
        })

        if (response.ok) {
            setCurrentProcess(null)
        } else {
            console.log("error terminating process")
        }

    }

    const openEditor = async () => {
        const response = await fetch(routes.openEditor, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                path: currentProcess?.path || packageFile?.path || null,
                command: currentSettings.launchIDECommand || "code . "
            }),
        })

        if (response.ok) {
            setCurrentProcess(null)
        } else {
            console.log("error terminating process")
        }

    }
    const handleStartProcess = async (process) => {
        await runProcess(process)
    }

    const handleStopProcess = async () => {
        await killProcess()
    }

    useEffect(() => {
        if (!allActiveTerminals || allActiveTerminals.length === 0) return
        const foundCurrentProcess = allActiveTerminals?.find(element => element.cwd === packageFile?.path) || null
        setCurrentProcess({ ...packageFile, state: foundCurrentProcess ? "running" : "stopped" })
    }, [allActiveTerminals])

    if (isRunningFilterOn && currentProcess?.state !== "running") return null
    if (!currentProcess?.name && !packageFile?.projectName && packageFile?.framework === "unknown") return null
    if (isFavoriteFilter && !isFavorite) return null

    return <Card className={`my-1 overflow-hidden ${theme === "alien" ? "rounded-none" : ""}`} key={packageFile.filePath}>
        <CardContent className="p-2 flex items-center gap-2">

            {currentProcess?.state === "running" && <Button onClick={handleStopProcess} className="p-2 text-destructive hover:text-black hover:bg-destructive" variant="ghost" size="icon"><Square /></Button>}
            {currentProcess?.state === "stopped" || !currentProcess ? <Button onClick={() => handleStartProcess(packageFile)} className={`p-2 hover:text-black hover:bg-primary`} variant="ghost" size="icon"><Play /></Button> : null}

            <div className="flex items-center gap-2 justify-between w-full">
                <div className="flex items-center me-2 justify-end w-fit gap-2">
                    <Tooltip>
                        <TooltipTrigger>
                            {currentProcess?.state === "running" ?
                                <Button onClick={openEditor}> <Code /> {packageFile.projectName}</Button> :
                                <Button onClick={openEditor} variant="outline"><Code /> {packageFile.projectName}</Button>}
                        </TooltipTrigger>
                        <TooltipContent>
                            Open IDE
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className="flex items-center gap-2 mx-2">
                    <small className="text-secondary" style={{ opacity: 0.7 }}>{packageFile.framework}</small>
                    <Port currentProcess={currentProcess} port={port} setPort={setPort}></Port>
                    <GitDisplay packageFile={packageFile} />
                </div>
            </div>

            <FavoriteButton isFavorite={isFavorite} packageFile={packageFile} setPackageFiles={setPackageFiles} toggleFavorite={toggleFavorite} packageFiles={packageFiles} />
        </CardContent>
    </Card >

}

export default ProcessCard