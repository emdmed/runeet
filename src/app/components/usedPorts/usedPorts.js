import { useEffect, useState } from "react"
import { useApi } from "../../hooks/useApi"
import UsedPortButton from "./components/usedPortButton"
import { Button } from "../../../components/ui/button"

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

    return <>
        <Button onClick={handleRefetchUnavailablePorts} size="icon" variant="outline"><RefreshCw /></Button>
        <Button onClick={() => setIsCollapsed(prev => !prev)} variant="outline">{usedPorts?.length || 0} used ports {isCollapsed ? <ChevronRight /> : <ChevronLeft />}</Button>

        {usedPorts && !isCollapsed && usedPorts.length > 0 && <div className="flex items-center gap-1 ms-1">
            {usedPorts.map(port => <UsedPortButton getPorts={getPorts} key={`port_btn_${port}`} port={port} />)}
        </div>}
    </>
}

export default UsedPorts