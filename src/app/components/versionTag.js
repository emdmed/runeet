import { Github } from "lucide-react"
import { Button } from "../../components/ui/button"
import { useApi } from "../hooks/useApi"
import { useEffect, useState } from "react"


const VersionTag = ({openExternalLink}) => {
    const [latestVersion, setLatestVersion] = useState()
    const [isUpdatePrompt, setIsUpdatePrompt] = useState()

    const { routes } = useApi()

    const version = "v0.5.8"

    const getVersionFromTag = (tag) => {
        try{
            return tag.split("_")[1]
        } catch(err) {
            console.error("Unknown tag", err, tag)
            return "Unknown tag"
        }
    }

    const fetchLatestVersion = async () => {
        const response = await fetch(routes.latestVersion)
        const data = await response.json();
        setLatestVersion(data)
    }

    useState(() => {
        fetchLatestVersion()
    }, [])

    useEffect(() => {
        if (!latestVersion) return

        if (getVersionFromTag(latestVersion.tag_name) !== version) {
            setIsUpdatePrompt(true)
        }
    }, [latestVersion])

    return <div>
        <div className="flex items-center gap-2">
            <Button
                onClick={() => openExternalLink('https://github.com/emdmed/rundeck')}
                size="sm"
                variant="outline"
                className={`${isUpdatePrompt ? "border-destructive text-destructive opacity-100 hover:bg-destructive hover:text-black" : "opacity-100"}`}
            ><Github/>{version}{isUpdatePrompt ? " Please update" : null}
            </Button>
        </div>
    </div>
}

export default VersionTag