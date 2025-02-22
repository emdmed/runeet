import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Square } from "lucide-react";
import { useEffect, useState } from "react";

const ProcessCard = ({ packageFile, allActiveTerminals }) => {

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

        if (allActiveTerminals && allActiveTerminals.length === 0) return
        console.log("allActiveTerminals", allActiveTerminals, "packagefile", packageFile)
        const foundCurrentProcess = allActiveTerminals?.find(element => element.cwd === packageFile?.path && element?.command === packageFile.command) || null
        setCurrentProcess(foundCurrentProcess)
    }, [allActiveTerminals, packageFile?.command, packageFile?.path])

    /*     const getFolderName = (packageFile) => {
            try {
                const array = packageFile.path.split("/")
                console.log("array", array, packageFile.path)
                return array[array.length - 1]
            } catch (e) {
                console.log(e)
                return "Not found"
            }
        } */

    const { color } = getProjectTypeTag(packageFile)

    return <Card className={`my-1`} key={packageFile.filePath}>
        <CardContent className="p-2 flex items-center gap-2">
            {currentProcess?.processId || currentProcess?.pid ? <Button onClick={handleStopProcess} className="p-2 text-rose-500" variant="ghost" size="sm"><Square /></Button> : <Button onClick={() => handleStartProcess(packageFile)} className={`p-2 ${currentProcess?.processId ? "text-emerald-500" : ""}`} variant="ghost" size="sm"><Play /></Button>}

            <div className="flex items-baseline gap-2 justify-between w-full">
                <div className="flex items-baseline me-2 justify-between w-full">
                    <span className={currentProcess?.processId || currentProcess?.pid ? "text-emerald-400" : ""}>{packageFile.projectName}</span>
                    <small className="text-stone-700">{packageFile?.command || "None"}</small>
                </div>
                <small className={`${color}`}>{packageFile.framework}</small>

            </div>
        </CardContent>
    </Card>

}

export default ProcessCard