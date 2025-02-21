import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Square } from "lucide-react";
import { useState } from "react";

const ProcessCard = ({ packageFile }) => {

    const [currentProcess, setCurrentProcess] = useState()

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
        setCurrentProcess(jsonRes)
    }

    async function killProcess() {
        console.log("kill ", currentProcess)
        const response = await fetch("/api/kill-command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                path: currentProcess?.executedPath || null
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
        if (packageFile.isVite) return { type: "Vite", color: "text-purple-200" }
        if (packageFile.isServer) return { type: "Server", color: "text-emerald-200" }
        return { type: "unknown", color: "text-stone-500" }
    }

    const handleStartProcess = async (process) => {
        await runProcess(process)
    }

    const handleStopProcess = async () => {
        await killProcess()
    }

    const { type, color } = getProjectTypeTag(packageFile)

    return <Card className={`my-1`} key={packageFile.filePath}>
        <CardContent className="p-2 flex items-center gap-2">
            {currentProcess?.processId ? <Button onClick={handleStopProcess} className="p-2 text-rose-500" variant="ghost" size="sm"><Square /></Button> : <Button onClick={() => handleStartProcess(packageFile)} className={`p-2 ${currentProcess?.processId ? "text-emerald-500" : ""}`} variant="ghost" size="sm"><Play /></Button>}

            <div className="flex items-baseline gap-2 justify-between w-full">

                <span className={currentProcess?.processId ? "text-emerald-400" : ""}>{packageFile.projectName}</span>
                <small className={`${color}`}>{type}</small>

            </div>
        </CardContent>
    </Card>

}

export default ProcessCard