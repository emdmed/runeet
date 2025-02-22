"use client";

import PathCard from "@/app/components/path-card/pathCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FolderPlus } from "lucide-react";
import { usePathCardPersistence } from "./hooks/usePathCardsPersistence";

export default function Home() {
  const storedPathCards = usePathCardPersistence();


  const [pathCards, setPathCards] = useState(
    storedPathCards || [
      {
        path: "",
        id: new Date().getTime(),
      },
    ]
  );

  console.log("storedPathCards", storedPathCards);
  console.log("pathCards", pathCards);

  useEffect(() => {
    if(storedPathCards) setPathCards(storedPathCards)
  }, [storedPathCards])

  const handleAddPathCard = () => {
    setPathCards((state) => [
      ...state,
      {
        path: "",
        id: new Date().getTime(),
      },
    ]);
  };

  useEffect(() => {}, [pathCards]);

  const handleRemovePathCard = (pathCard) => {
    setPathCards(pathCards.filter((card) => card.id !== pathCard.id));
  };

  return (
    <div className="h-screen p-3">
      <div className="flex gap-2 items-center mb-4">
        <h1 className="font-bold me-3">DEV - DASHBOARD</h1>
        <Button onClick={handleAddPathCard} variant="outline" className="p-2">
          <FolderPlus />
        </Button>
      </div>
      <div className="flex gap-3 w-full p-2" style={{ overflow: "auto" }}>
        {pathCards.map((card, index) => (
          <PathCard
            pathCard={card}
            pathCards={pathCards}
            setPathCards={setPathCards}
            handleRemovePathCard={handleRemovePathCard}
            index={index}
            key={card.id}
            card
          />
        ))}
      </div>
    </div>
  );
}
