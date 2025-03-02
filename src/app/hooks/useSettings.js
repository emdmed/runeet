'use client'

import { useState } from "react"

export const defaultSettings = {
    launchIDECommand: "code ."
}

export const useSettings = () => {
    const [currentSettings, setCurrentSettings] = useState(() => {
        return JSON.parse(localStorage.getItem("rundeck_settings") || "false") || defaultSettings;
    });

    const saveSettings = (newSettings) => {

        localStorage.setItem("rundeck_settings", JSON.stringify(newSettings));
        setCurrentSettings(newSettings);

    }

    return { currentSettings, defaultSettings, saveSettings };
}
