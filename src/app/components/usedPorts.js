import { useEffect, useState } from "react"
import { useApi } from "../hooks/useApi"
import { Badge } from "../../components/ui/badge"



const UsedPorts = () => {

    const [usedPorts, setUsedPorts] = useState([])

    const { routes } = useApi()

    const getPorts = async () => {
        const response = await fetch(routes.usedPorts)
        const data = await response.json()

        setUsedPorts(data.ports)
    }

    useEffect(() => {
        getPorts()
    }, [])

    return <div className="flex gap-1 overflow-auto w-full py-4">
        <small className="me-2">Unavailable ports</small>
        {usedPorts.map(port => <Badge variant="outline" className="border-destructive" key={`port_${port}`}>{port}</Badge>)}
    </div>
}


export default UsedPorts