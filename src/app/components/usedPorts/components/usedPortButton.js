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

const UsedPortButton = ({ port }) => {
    const [isHover, setIsHover] = useState(false)

    return <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                variant="outline"
                className="border-destructive h-[18px] w-[52px] max-w-[52px] px-1 hover:bg-destructive hover:text-black"
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
                <AlertDialogAction className="bg-destructive text-black" onClick={() => console.log("kill process")}>
                    Continue
                    <Skull />
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}

export default UsedPortButton
