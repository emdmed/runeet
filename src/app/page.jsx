"use client";

import PathCard from "@/app/components/path-card/pathCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FolderPlus } from "lucide-react";

export default function Home() {
  const [pathCards, setPathCards] = useState([
    {
      path: "",
      id: new Date().getTime(),
    },
  ]);

  const handleAddPathCard = () => {
    setPathCards((state) => [
      ...state,
      {
        path: "",
        id: new Date().getTime(),
      },
    ]);
  };

  const handleRemovePathCard = (pathCard) => {
    setPathCards(pathCards.filter((card) => card.id !== pathCard.id));
  };

  return (
    <div className="h-screen p-3">
      <div className="flex gap-2 items-center mb-4">
        <h1>DEV - DASHBOARD</h1>
        <Button onClick={handleAddPathCard} variant="outline" className="p-2">
          <FolderPlus />
        </Button>
      </div>
      <div className="flex gap-3 w-full p-2" style={{ overflow: "auto" }}>
        {pathCards.map((card, index) => (
          <PathCard pathCard={card} handleRemovePathCard={handleRemovePathCard} index={index} key={card.id} card />
        ))}
      </div>
    </div>
  );
}
