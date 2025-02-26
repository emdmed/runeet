import {
    Card,
    CardContent,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { AppWindow, Play } from "lucide-react";
import { Square } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Star } from "lucide-react";
import GitDisplay from "./components/gitDisplay"

const ProcessCard = ({ packageFile, allActiveTerminals, toggleFavorite, isRunningFilterOn }) => {

    const [currentProcess, setCurrentProcess] = useState()

    console.log("package file", packageFile)

    async function runProcess(process) {
        const response = await fetch("http://localhost:5552/api/run-command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                command: process.command,
                path: process.path,
            }),
        })

        const jsonRes = await response.json()
        setCurrentProcess({ ...jsonRes, state: "running" })
    }

    async function killProcess() {
        const response = await fetch("http://localhost:5552/api/kill-command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                path: currentProcess?.executedPath || currentProcess?.cwd || currentProcess?.path || null
            }),
        })

        console.log("response", response, response?.ok)

        if (response.ok) {
            setCurrentProcess(null)
        } else {
            console.log("error terminating process")
        }

    }


    const openEditor = async () => {
        console.log("currentProcess", currentProcess, "packageFile", packageFile)
        const response = await fetch("http://localhost:5552/api/open-editor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                path: currentProcess?.path || packageFile?.path || null,
                command: "code . "
            }),
        })

        if (response.ok) {
            setCurrentProcess(null)
        } else {
            console.log("error terminating process")
        }

    }

    const getProjectTypeTag = (packageFile) => {
        if (packageFile.framework === "vite") return { color: "text-secondary" }
        if (packageFile.framework === "server") return { color: "text-secondary" }
        if (packageFile.framework === "next") return { color: "text-secondary" }
        if (packageFile.framework === "react") return { color: "text-secondary" }
        return { color: "text-stone-500" }
    }

    const handleStartProcess = async (process) => {
        await runProcess(process)
    }

    const handleStopProcess = async () => {
        await killProcess()
    }

    console.log("current process", currentProcess?.projectName, currentProcess)

    useEffect(() => {
        if (!allActiveTerminals || allActiveTerminals.length === 0) return
        const foundCurrentProcess = allActiveTerminals?.find(element => element.cwd === packageFile?.path && element?.command === packageFile.command) || null

        console.log("foundCurrentProcess", foundCurrentProcess, packageFile?.name)
        setCurrentProcess({ ...packageFile, state: foundCurrentProcess ? "running" : "stopped" })
    }, [allActiveTerminals])

    console.log("current process", currentProcess)

    const { color } = getProjectTypeTag(packageFile)

    if (isRunningFilterOn && currentProcess?.state !== "running") return null

    return <Card className={`my-1`} key={packageFile.filePath}>
        <CardContent className="p-2 flex items-center gap-1">

            {currentProcess?.state === "running" && <Button onClick={handleStopProcess} className="p-2 text-destructive hover:text-black hover:bg-destructive" variant="ghost" size="sm"><Square /></Button>}

            {currentProcess?.state === "stopped" || !currentProcess ? <Button onClick={() => handleStartProcess(packageFile)} className={`p-2 hover:text-black hover:bg-primary`} variant="ghost" size="sm"><Play /></Button> : null}


            <div className="flex items-center gap-1 justify-between w-full">
                <div className="flex items-center me-2 justify-end w-fit gap-2">
                    {currentProcess?.state === "running" ? <Badge className="bg-primary">{packageFile.projectName}</Badge> : <Badge variant="outline">{packageFile.projectName}</Badge>}
                    <small style={{ opacity: 0.7 }} className={`${color}`}>{packageFile.framework}</small>
                </div>
                <div className="flex items-center gap-2 mx-2">
                    <GitDisplay packageFile={packageFile} />
                </div>
            </div>
            <Button variant="ghost" onClick={openEditor} size="sm" className="p-2 text-secondary hover:bg-secondary"><AppWindow /></Button>
            <Button onClick={() => toggleFavorite(packageFile)} variant="ghost" size="sm" className={`p-2 hover:text-black hover:bg-yellow-400 ${packageFile?.favorite ? "text-yellow-400" : "text-stone-700"} p-2`}><Star /></Button>
        </CardContent>
    </Card >

}

export default ProcessCard