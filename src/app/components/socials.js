"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Github, Twitter } from "lucide-react";

const Socials = () => {
    const [openExternalLink, setOpenExternalLink] = useState(() => (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    });

    useEffect(() => {
        if (window.__TAURI__) {
            import("@tauri-apps/api/shell").then(({ open }) => {
                setOpenExternalLink(() => async (url) => {
                    try {
                        await open(url);
                    } catch (error) {
                        console.error("Failed to open URL in Tauri:", error);
                    }
                });
            });
        }
    }, []);

    return (
        <div className="flex gap-1">
            <Button
                onClick={() => openExternalLink('https://github.com/emdmed/rundeck')}
                className="rounded-full h-[25px] w-[25px] text-foreground"
                variant="link"
                size="icon"
            >
                <Github />
            </Button>
            <Button
                onClick={() => openExternalLink('https://x.com/e7r1us')}
                className="rounded-full h-[25px] w-[25px] text-foreground"
                variant="link"
                size="icon"
            >
                <Twitter />
            </Button>
        </div>
    );
};

export default Socials;
