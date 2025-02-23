"use client";

import PathCard from "@/app/components/path-card/pathCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FastForward, FolderPlus, Trash } from "lucide-react";
import { usePathCardPersistence } from "./hooks/usePathCardsPersistence";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  useEffect(() => {
    if (storedPathCards) setPathCards(storedPathCards);
  }, [storedPathCards]);

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

  const handleClearAll = () => {
    const defaultPathCards = [
      {
        path: "",
        id: new Date().getTime(),
      },
    ];
    localStorage.setItem("pathCards", JSON.stringify(defaultPathCards));
    setPathCards([...defaultPathCards]);
  };

  console.log("PATH CARDS ARRAY", pathCards);

  return (
    <div className="h-screen max-h-screen p-8">
      <div className="flex gap-2 items-center mb-4 relative">
        <h1 className="font-bold me-3 text-2xl mb-0 text-primary">./RunDeck</h1>
        <div>
          <FastForward
            className="text-primary absolute"
            style={{ bottom: 3 }}
          />
        </div>
      </div>
      <div className="flex my-2 gap-2">
        <Button
          onClick={handleAddPathCard}
          size="sm"
          variant="default"
          className="p-2"
        >
          <FolderPlus />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="p-2">
              <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                You are about to delete all Project cards, continue?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearAll}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="pt-2">
        <h5>Folders</h5>
      </div>
      <div
        className="flex gap-3 w-full mt-3 flex-1 min-h-0"
        style={{ maxHeight: "calc(100% - 120px" }}
      >
        {pathCards.map((card, index) => (
          <PathCard
            pathCard={card}
            pathCards={pathCards}
            setPathCards={setPathCards}
            handleRemovePathCard={handleRemovePathCard}
            index={index}
            key={`${index}_${card.path}`}
            card
          />
        ))}
      </div>
    </div>
  );
}
