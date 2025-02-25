"use client";

import PathCard from "./components/path-card/pathCard";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { FastForward, FolderPlus, Trash } from "lucide-react";
import { usePathCardPersistence } from "./hooks/usePathCardsPersistence";
import { RefreshCw, SquareActivity } from "lucide-react";

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
} from "../components/ui/alert-dialog";

export default function Home() {
  const storedPathCards = usePathCardPersistence();
  const [monitoringSettings, setMonitoringSettings] = useState({
    autoMonitoring: true,
    interval: 5,
  });
  const [allActiveTerminals, setAllActiveTerminals] = useState();

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

  async function monitorTerminals() {
    const response = await fetch("/api/monitor-processes");

    const data = await response.json();

    setAllActiveTerminals(data.terminals);
  }

  const monitoringIntervals = [1, 3, 5, 10, 20];

  const handleMonitoringIntervalChange = () => {
    const arrayLength = monitoringIntervals.length;

    const index = monitoringIntervals.indexOf(monitoringSettings.interval);

    if (index < arrayLength)
      setMonitoringSettings((prev) => ({
        ...prev,
        interval: monitoringIntervals[index + 1],
      }));
    if (index === arrayLength - 1)
      setMonitoringSettings((prev) => ({
        ...prev,
        interval: monitoringIntervals[0],
      }));
  };

  useEffect(() => {
    monitorTerminals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      monitorTerminals();
    }, monitoringSettings?.interval * 1000);

    if (!monitoringSettings?.autoMonitoring) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [monitoringSettings]);

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
        <Button
          onClick={monitorTerminals}
          variant="ghost"
          size="sm"
          className="p-2 bg-dark text-primary hover:bg-primary hover:text-black"
        >
          <RefreshCw />
        </Button>
        <Button
          onClick={() =>
            setMonitoringSettings((prev) => ({
              ...prev,
              autoMonitoring: !prev.autoMonitoring,
            }))
          }
          size="sm"
          className={`p-2 bg-dark ${
            monitoringSettings.autoMonitoring
              ? "text-primary"
              : "text-stone-700"
          } hover:bg-primary hover:text-black`}
        >
          <SquareActivity />
        </Button>
        <Button
          className={`ps-0 ${
            monitoringSettings.autoMonitoring
              ? "text-primary"
              : "text-stone-700"
          }`}
          variant="link"
          size="sm"
          onClick={handleMonitoringIntervalChange}
        >
          {monitoringSettings.interval} secs
        </Button>
      </div>

      <div
        className="flex flex-col gap-3 w-full mt-3 flex-1 min-h-0 overflow-auto px-2"
        style={{ maxHeight: "calc(100% - 100px" }}
      >
        <div className="pt-2 flex justify-start">
          <h5>Folders</h5>
        </div>
        {pathCards.map((card, index) => (
          <PathCard
            allActiveTerminals={allActiveTerminals}
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
