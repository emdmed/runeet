//tauri shell not working

import {
    Card,
    CardContent,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";
import { Github, Twitter } from "lucide-react";
import { useState, useEffect } from "react";

const Socials = () => {

    const [openLink, setOpenLink] = useState(() => (url) => window.open(url, "_blank")); // Default for web

    useEffect(() => {
        const loadTauriShell = async () => {
            if (typeof window !== "undefined" && window.__TAURI__) {
                try {
                    const tauri = await import("@tauri-apps/api");
                    setOpenLink(() => tauri.shell.open);
                } catch (error) {
                    console.error("Failed to load Tauri shell:", error);
                }
            }
        };

        loadTauriShell();
    }, []);

    return <Card className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full">
        <CardContent className="p-2 flex gap-2 mx-1">
            <Button
                onClick={() => openLink('https://github.com/emdmed/rundeck')}
                className="rounded-full hover:bg-primary hover:text-black"
                variant="ghost"
                size="icon"
            >
                <Github />
            </Button>
            <Button
                onClick={() => openLink('https://x.com/e7r1us')}
                className="rounded-full hover:bg-primary hover:text-black"
                variant="ghost"
                size="icon"
            >
                <Twitter />
            </Button>
        </CardContent>
    </Card>
}

export default Socials