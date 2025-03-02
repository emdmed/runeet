import { useEffect, useState } from "react"
import { useApi } from "../../hooks/useApi"
import UsedPortButton from "./components/usedPortButton"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"

import { ChevronLeft, RefreshCw, ChevronRight } from "lucide-react"

const UsedPorts = () => {

    const [usedPorts, setUsedPorts] = useState([])
    const [isCollapsed, setIsCollapsed] = useState(true)

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
        <Button onClick={handleRefetchUnavailablePorts} size="sm" variant="outline">Unavailable ports <RefreshCw /></Button>
        <Button onClick={() => setIsCollapsed(prev => !prev)} className="text-white px-1" size="sm" variant="outline">
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
        {usedPorts && !isCollapsed && usedPorts.length > 0 && <div className="flex items-center gap-1">
            {usedPorts.map(port => <UsedPortButton getPorts={getPorts} key={`port_btn_${port}`} port={port} />)}
        </div>}
        {isCollapsed && <Badge className="text-foreground border-destructive h-[20px]" variant="outline">{usedPorts?.length || 0} used ports</Badge>}
    </div>
}

export default UsedPorts