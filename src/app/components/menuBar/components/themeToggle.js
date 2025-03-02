"use client";

import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { ArrowLeftRight } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme(); 

    const currentThemes = ["dark", "win", "alien", "light"];

    const handleCycleThemes = () => {
        const index = currentThemes.indexOf(theme);
        console.log("index", index, "theme", theme);

        // If theme is not found in the array, start from the first theme
        if (index === -1) {
            setTheme(currentThemes[0]);
            return;
        }

        // Cycle through themes, resetting if at the last index
        const newTheme = index === currentThemes.length - 1 ? currentThemes[0] : currentThemes[index + 1];
        setTheme(newTheme);

        // Ensure the class is applied to <html>
        document.documentElement.classList.remove(...currentThemes);
        document.documentElement.classList.add(newTheme);
    };

    // Ensure the theme class is set when the theme changes
    useEffect(() => {
        if (resolvedTheme) {
            document.documentElement.classList.remove(...currentThemes);
            document.documentElement.classList.add(resolvedTheme);
        }
    }, [resolvedTheme]);

    return (
        <Button onClick={handleCycleThemes} variant="outline">
            Themes <ArrowLeftRight/>
        </Button>
    );
}
