import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "../../../components/ui/dialog"

import { Button } from "../../../components/ui/button"
import { Settings2 } from "lucide-react"
import { Input } from "../../../components/ui/input"
import { useEffect, useState } from "react"
import { useDefaultSettings } from "../../hooks/useSettings"

const Settings = () => {
    const { currentSettings, saveSettings } = useDefaultSettings()
    const [launchIDEcommandValue, setLaunchIDECommandValue] = useState(currentSettings.launchIDECommand)
    const [newSettings, setNewSettings] = useState(currentSettings)


    useEffect(() => {
        setNewSettings(prev => ({ ...prev, launchIDECommand: launchIDEcommandValue.trim() }))
    }, [launchIDEcommandValue])

    return (<Dialog>
        <DialogTrigger>
            <Button size="icon"><Settings2 /></Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <div>
                <span>Launch IDE command</span>
                <Input value={launchIDEcommandValue} onChange={e => setLaunchIDECommandValue(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
                <DialogClose>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => saveSettings(newSettings)}>Save</Button>
            </div>
        </DialogContent>
    </Dialog>)
}

export default Settings