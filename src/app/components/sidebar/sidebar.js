import { Badge } from "../../../components/ui/badge"
import { Card, CardContent } from "../../../components/ui/card"
import { useTheme } from "next-themes"

const getFolderName = (folderPath) => {
    try {
        const folderPathArray = folderPath.split("/")
        return folderPathArray[folderPathArray.length - 1]
    } catch (err) {
        console.log(err)
        return "Error"
    }
}

function scrollElementIntoView(elementId) {
    const element = document.getElementById(elementId);

    if (element) {
        element.scrollIntoView({
            behavior: 'instant',
            block: 'nearest'
        });
        return true;
    }

    return false;
}

const Sidebar = ({ pathCards }) => {
    const { theme } = useTheme()
    return <Card className={`${theme === "alien" ? "rounded-none" : ""}`}>
        <CardContent className={`flex flex-col justify-start p-1`}>
            {pathCards.length > 0 && pathCards.map(card => <div className="m-2 flex" key={card.path}>
                <Badge className="cursor-pointer" onClick={() => scrollElementIntoView(`pathCard_${card.path}`)}>./{getFolderName(card.path)}</Badge>
            </div>)}
            {pathCards.length === 0 && <span className="p-2 opacity-70">No folders yet</span>}
        </CardContent>
    </Card>
}

export default Sidebar