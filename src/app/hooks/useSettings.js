'use client';

import { useState, useEffect } from "react";

export const defaultSettings = {
    launchIDECommand: "code ."
};

export const useSettings = () => {
    const [currentSettings, setCurrentSettings] = useState(defaultSettings);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedSettings = JSON.parse(localStorage.getItem("runeet_settings") || "false") || defaultSettings;
            setCurrentSettings(storedSettings);
        }
    }, []);

    const saveSettings = (newSettings) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("runeet_settings", JSON.stringify(newSettings));
        }
        setCurrentSettings(newSettings);
    };

    return { currentSettings, defaultSettings, saveSettings };
};
