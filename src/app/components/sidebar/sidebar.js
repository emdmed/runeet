import { Badge } from "../../../components/ui/badge"

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
    return <div>
        {pathCards.length > 0 && pathCards.map(card => <div className="m-2" key={card.path}>
            <Badge className="cursor-pointer" onClick={() => scrollElementIntoView(`pathCard_${card.path}`)}>./{getFolderName(card.path)}</Badge>
        </div>)}
        {pathCards.length === 0 && <span className="p-2 opacity-70">No folders yet</span>}
    </div>
}

export default Sidebar