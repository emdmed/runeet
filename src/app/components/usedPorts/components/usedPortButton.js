import { useState } from "react"
import { Button } from "../../../../components/ui/button"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";
import { Skull } from "lucide-react";
import { useApi } from "../../../../app/hooks/useApi";

const UsedPortButton = ({ port, getPorts }) => {
    const [isHover, setIsHover] = useState(false)
    const { routes } = useApi()

    const killPortProcess = async (port) => {
        try {
            const response = await fetch(routes.killPortProcess, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    port
                }),
            })

            const data = await response.json()

            if (data.killed) {
                getPorts()
            } else {

            }

        } catch (err) {
            console.error(err)
        }
    }

    return <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                size="sm"
                variant="outline"
                className="border-destructive w-[58px] max-w-[58px] px-1 hover:bg-destructive hover:text-black p-2"
            >
                {isHover ? "kill" : port}
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    You are about to kill the process that is using this {port} port, continue?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action could disrupt running apps.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-black" onClick={() => killPortProcess(port)}>
                    Continue
                    <Skull />
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}

export default UsedPortButton
