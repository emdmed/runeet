import { useEffect } from "react"
import { useApi } from "../hooks/useApi"



const UsedPorts = () => {

    const { routes } = useApi()

    const getPorts = async () => {
        const response = await fetch(routes.usedPorts)
        const data = await response.json()

        console.log("used ports", data)
    }

    useEffect(() => {
        getPorts()
    }, [])

    return <div>ports</div>
}


export default UsedPorts