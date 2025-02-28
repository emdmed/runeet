import { useEffect } from "react"
import { useState } from "react"

export const useFavorites = (path) => {
    const [favorites, setFavorites] = useState(() => 
        JSON.parse(localStorage.getItem("rundeck_favorites") || "[]")
    );
    
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        const foundFavorite = favorites.includes(path)
        setIsFavorite(!!foundFavorite)
    }, [favorites, path])

    const toggleFavorite = () => {

        const foundFavorite = favorites.includes(path)

        if (foundFavorite) {
            const updatedFavorites = favorites.filter(element => element !== path)
            setFavorites(updatedFavorites)
            localStorage.setItem("rundeck_favorites", JSON.stringify(updatedFavorites))
        } else {
            const updatedFavorites = [...favorites, path]
            setFavorites(updatedFavorites)
            localStorage.setItem("rundeck_favorites", JSON.stringify(updatedFavorites))
        }
    }

    return { favorites, isFavorite, toggleFavorite }

}