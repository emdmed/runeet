
import {
    Card,
    CardContent,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";
import { Github, Twitter } from "lucide-react";

let openExternalLink;

if (window.__TAURI__) {
    import("@tauri-apps/api/shell").then(({ open }) => {
        openExternalLink = async (url) => {
            try {
                await open(url);
            } catch (error) {
                console.error("Failed to open URL in Tauri:", error);
            }
        };
    });
} else {
    openExternalLink = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };
}

const Socials = () => {
    return <Card className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full">
        <CardContent className="p-2 flex gap-2 mx-1">
            <Button
                onClick={() => openExternalLink('https://github.com/emdmed/rundeck')}
                className="rounded-full hover:bg-primary hover:text-black"
                variant="ghost"
                size="icon"
            >
                <Github />
            </Button>
            <Button
                onClick={() => openExternalLink('https://x.com/e7r1us')}
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