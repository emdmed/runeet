import { Star } from "lucide-react";
import { Button } from "../../../../../components/ui/button"

const FavoriteButton = ({ toggleFavorite, isFavorite }) => {

    return <Button
        onClick={() => toggleFavorite()}
        variant="ghost"
        size="sm"
        className={`p-2 hover:text-black hover:bg-yellow-400 ${isFavorite ? "text-yellow-400" : "text-stone-700"} p-2`}>
        <Star />
    </Button>
}

export default FavoriteButton