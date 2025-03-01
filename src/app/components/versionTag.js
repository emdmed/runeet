import { Badge } from "../../components/ui/badge"

const VersionTag = () => {

    const version = "v0.5.0"

    return <Badge
        variant="outline"
        className="absolute bottom-5 right-0 mx-8 opacity-50"
    >{version}</Badge>
}

export default VersionTag