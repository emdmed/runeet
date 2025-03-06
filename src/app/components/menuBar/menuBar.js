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

import Settings from "../settings/settings"

import { RefreshCw, Trash, Activity } from "lucide-react"

const MenuBar = ({ menuBarActions, setMonitoringSettings, setIsCoolMode, isCoolMode, monitorTerminals, monitoringSettings }) => {
    return (
        <div className="flex gap-3 justify-between items-center ms-5">
                <Button
                    onClick={() => monitorTerminals()}
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
                        variant="ghost"
                        className={`p-2 bg-dark ${monitoringSettings.autoMonitoring
                            ? "text-primary"
                            : "text-stone-700"
                            } hover:bg-primary hover:text-black`}
                    >
                        <Activity />
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
         
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-2 text-destructive hover:bg-destructive hover:text-black">
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
            <Settings
                isCoolMode={isCoolMode}
                setIsCoolMode={setIsCoolMode}
            />

        </div>
    )
}

export default MenuBar