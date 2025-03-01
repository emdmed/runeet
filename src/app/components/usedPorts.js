import { useEffect, useState } from "react"
import { useApi } from "../hooks/useApi"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { RefreshCw } from "lucide-react"

const UsedPorts = () => {

    const [usedPorts, setUsedPorts] = useState([])

    const { routes } = useApi()

    const getPorts = async () => {
        const response = await fetch(routes.usedPorts)
        const data = await response.json()

        setUsedPorts(data.ports)
    }

    const handleRefetchUnavailablePorts = () => {
        getPorts()
    }

    useEffect(() => {
        getPorts()
    }, [])

    return <div className="flex gap-1 overflow-auto w-full py-4 items-center">
        <Button onClick={handleRefetchUnavailablePorts} size="sm" variant="outline" className="me-2">Unavailable ports <RefreshCw /></Button>
        {usedPorts && usedPorts.length > 0 && <div className="flex items-center gap-1">
            {usedPorts.map(port => <Badge variant="outline" className="border-destructive" key={`port_${port}`}>{port}</Badge>)}
        </div>}
    </div>
}

export default UsedPorts