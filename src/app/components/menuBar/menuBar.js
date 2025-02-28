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

const MenuBar = ({ menuBarActions, setMonitoringSettings, setIsCoolMode, isCoolMode, monitorTerminals, monitoringSettings }) => {
    return (
        <div className="flex my-2 gap-2 justify-between items-center">
            <div className="flex gap-2">
                <Button
                    onClick={menuBarActions.handleAddPathCard}
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
                            <AlertDialogAction onClick={menuBarActions.handleClearAll}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Button
                    onClick={() => monitorTerminals()}
                    variant="ghost"
                    size="sm"
                    className="p-2 bg-dark text-primary hover:bg-primary hover:text-black"
                >
                    <RefreshCw />
                </Button>
                <div className="flex items-center">
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
                        onClick={menuBarActions.handleMonitoringIntervalChange}
                    >
                        {monitoringSettings.interval} secs
                    </Button>
                </div>
            </div>
            <Button
                onClick={() => setIsCoolMode(prev => !prev)}
                variant="outline"
                size="sm"
                className={`p-2 bg-dark ${isCoolMode
                    ? "text-primary border-primary"
                    : "text-stone-700"
                    } hover:bg-primary hover:text-black`} >
                {isCoolMode ? "Cool" : "Boring"} style
            </Button>
        </div>
    )
}

export default MenuBar