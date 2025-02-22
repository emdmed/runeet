import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Square } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const ProcessCard = ({ packageFile, allActiveTerminals, toggleFavorite }) => {

    const [currentProcess, setCurrentProcess] = useState()

    console.log("package file", packageFile)

    async function runProcess(process) {
        const response = await fetch("/api/run-command", {
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
        console.log("kill ", currentProcess)
        const response = await fetch("/api/kill-command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                path: currentProcess?.executedPath || currentProcess?.cwd || null
            }),
        })

        console.log("response", response, response?.ok)

        if (response.ok) {
            setCurrentProcess(null)
        } else {
            console.log("error terminating process")
        }

    }

    const getProjectTypeTag = (packageFile) => {
        if (packageFile.framework === "vite") return { color: "text-purple-200" }
        if (packageFile.framework === "server") return { color: "text-emerald-200" }
        if (packageFile.framework === "next") return { color: "text-white" }
        if (packageFile.framework === "react") return { color: "text-sky-200" }
        return { color: "text-stone-500" }
    }

    const handleStartProcess = async (process) => {
        await runProcess(process)
    }

    const handleStopProcess = async () => {
        await killProcess()
    }



    useEffect(() => {
        if (!allActiveTerminals || allActiveTerminals.length === 0) return
        const foundCurrentProcess = allActiveTerminals?.find(element => element.cwd === packageFile?.path && element?.command === packageFile.command) || null

        console.log("foundCurrentProcess", foundCurrentProcess, packageFile?.name)
        setCurrentProcess({ ...packageFile, state: foundCurrentProcess ? "running" : "stopped" })
    }, [allActiveTerminals])

    console.log("current process", currentProcess)

    const { color } = getProjectTypeTag(packageFile)

    return <Card className={`my-1`} key={packageFile.filePath}>
        <CardContent className="p-2 flex items-center gap-2">

            {currentProcess?.state === "running" && <Button onClick={handleStopProcess} className="p-2 text-rose-500" variant="ghost" size="sm"><Square /></Button>}

            {currentProcess?.state === "stopped" || !currentProcess ? <Button onClick={() => handleStartProcess(packageFile)} className={`p-2 ${currentProcess?.processId ? "text-emerald-500" : ""}`} variant="ghost" size="sm"><Play /></Button> : null}


            <div className="flex items-baseline gap-2 justify-between w-full">
                <div className="flex items-baseline me-2 justify-between w-full">
                    {currentProcess?.state === "running" ? <Badge className="bg-lime-300">{packageFile.projectName}</Badge> : <Badge variant="outline">{packageFile.projectName}</Badge>}
                    <small className="text-stone-700">{packageFile?.command || "None"}</small>
                </div>
                <small className={`${color}`}>{packageFile.framework}</small>

            </div>
            <Button onClick={() => toggleFavorite(packageFile)} variant="ghost" className={`${packageFile?.favorite ? "text-yellow-500" : "text-stone-700"} p-2`}><Star /></Button>
        </CardContent>
    </Card >

}

export default ProcessCard