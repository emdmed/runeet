import { Button } from "../../../components/ui//button"
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
} from "../../../components/ui/alert-dialog";

//icons
import { FolderPlus, RefreshCw, SquareActivity, Trash } from "lucide-react"

const MenuBar = ({ handleAddPathCard, handleClearAll, setMonitoringSettings, handleMonitoringIntervalChange, setIsCoolMode, isCollMode, monitorTerminals, monitoringSettings }) => {
    return (
        <div className="flex my-2 gap-2">
            <Button
                onClick={handleAddPathCard}
                size="sm"
                variant="default"
                className="p-2"
            >
                <FolderPlus />
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="p-2">
                        <Trash />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            You are about to delete all Project cards, continue?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAll}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button
                onClick={monitorTerminals}
                variant="ghost"
                size="sm"
                className="p-2 bg-dark text-primary hover:bg-primary hover:text-black"
            >
                <RefreshCw />
            </Button>
            <Button
                onClick={() =>
                    setMonitoringSettings((prev) => ({
                        ...prev,
                        autoMonitoring: !prev.autoMonitoring,
                    }))
                }
                size="sm"
                className={`p-2 bg-dark ${monitoringSettings.autoMonitoring
                    ? "text-primary"
                    : "text-stone-700"
                    } hover:bg-primary hover:text-black`}
            >
                <SquareActivity />
            </Button>
            <Button
                className={`ps-0 ${monitoringSettings.autoMonitoring
                    ? "text-primary"
                    : "text-stone-700"
                    }`}
                variant="link"
                size="sm"
                onClick={handleMonitoringIntervalChange}
            >
                {monitoringSettings.interval} secs
            </Button>
            <Button
                onClick={() => setIsCoolMode(prev => !prev)}
                size="sm"
                className={`p-2 bg-dark ${isCollMode
                    ? "text-primary"
                    : "text-stone-700"
                    } hover:bg-primary hover:text-black`} >{isCollMode ? "Cool" : "Boring"} mode</Button>
        </div>
    )
}

export default MenuBar