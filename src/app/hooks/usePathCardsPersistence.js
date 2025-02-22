import { useEffect } from "react"
import { useState } from "react"

export const usePathCardPersistence = () => {
    const [storedData, setStoredData] = useState(null)

    useEffect(() => {
        const stringData = localStorage.getItem("pathCards")
        if (!stringData) return

        const pathCards = JSON.parse(stringData)
        setStoredData(pathCards)
    }, [])


    return storedData
}

