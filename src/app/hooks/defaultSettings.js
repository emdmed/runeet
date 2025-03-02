import { useState } from "react"

export const defaultSettings = {
    launchIDECommand: "code ."
}

export const useDefaultSettings = () => {
    const storedSettings = JSON.parse(localStorage.getItem("rundeck_settings") || "false")
    const [currentSettings, setCurrentSettings] = useState(storedSettings || defaultSettings)


    const saveSettings = (newSettings) => {
        localStorage.setItem("rundeck_settings", JSON.stringify(newSettings))
    }

    return { currentSettings, defaultSettings, saveSettings }
}