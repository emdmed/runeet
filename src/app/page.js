"use client";

import PathCard from "./components/path-card/pathCard";
import { useEffect, useState } from "react";
import { FastForward, FolderPlus, X, Minus, Square } from "lucide-react";
import { usePathCardPersistence } from "./hooks/usePathCardsPersistence";
import { useApi } from "./hooks/useApi";
import MenuBar from "./components/menuBar/menuBar";
import UsedPorts from "./components/usedPorts/usedPorts";
import { TooltipProvider } from "../components/ui/tooltip";
import { Button } from "../components/ui/button";

// Remove the top-level import for appWindow
// import { appWindow } from '@tauri-apps/api/window';

export default function Home() {
  const [appWindow, setAppWindow] = useState(null);

  useEffect(() => {
    import("@tauri-apps/api/window").then((module) => {
      setAppWindow(module.appWindow);
    });
  }, []);

  const storedPathCards = usePathCardPersistence();
  const [isCoolMode, setIsCoolMode] = useState(true);
  const [monitoringSettings, setMonitoringSettings] = useState({
    autoMonitoring: true,
    interval: 10,
  });

  const [allActiveTerminals, setAllActiveTerminals] = useState(null);
  const { routes } = useApi();

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
    const newPathCard = {
      path: "",
      id: new Date().getTime(),
    };
    setPathCards((state) => [newPathCard, ...state]);
  };

  async function monitorTerminals() {
    const response = await fetch(routes.monitorProcess);
    const data = await response.json();
    setAllActiveTerminals(data.terminals);
  }

  const monitoringIntervals = [1, 3, 5, 10, 20];

  const handleMonitoringIntervalChange = () => {
    const arrayLength = monitoringIntervals.length;
    const index = monitoringIntervals.indexOf(monitoringSettings.interval);
    if (index < arrayLength - 1) {
      setMonitoringSettings((prev) => ({
        ...prev,
        interval: monitoringIntervals[index + 1],
      }));
    } else {
      setMonitoringSettings((prev) => ({
        ...prev,
        interval: monitoringIntervals[0],
      }));
    }
  };

  useEffect(() => {
    monitorTerminals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      monitorTerminals();
    }, monitoringSettings.interval * 1000);

    if (!monitoringSettings.autoMonitoring) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [monitoringSettings]);

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

  const menuBarActions = {
    handleAddPathCard,
    handleClearAll,
    handleMonitoringIntervalChange,
  };

  return (
    <TooltipProvider>
      <div className="overflow-auto h-screen px-3">
        <div data-tauri-drag-region className="flex gap-2 justify-between items-center border-primary">
          <div className={`flex items-center`}>
            <h1 className="font-bold me-3 text-xl mb-0 text-primary flicker">
              ./RunDeck
            </h1>
            <FastForward className="text-primary me-4" style={{ bottom: 3 }} />
            <MenuBar
              setIsCoolMode={setIsCoolMode}
              isCoolMode={isCoolMode}
              menuBarActions={menuBarActions}
              monitoringSettings={monitoringSettings}
              setMonitoringSettings={setMonitoringSettings}
              monitorTerminals={monitorTerminals}
            />
          </div>
          <div className="flex gap-2">
            {appWindow && (
              <>
                <Button
                  onClick={() => appWindow.minimize()}
                  variant="link"
                  size="icon"
                >
                  <Minus />
                </Button>
                <Button
                  onClick={() => appWindow.toggleMaximize()}
                  variant="link"
                  size="icon"
                >
                  <Square />
                </Button>
                <Button
                  onClick={() => appWindow.close()}
                  variant="link"
                  size="icon"
                >
                  <X />
                </Button>
              </>
            )}
          </div>
        </div>

        <div
          className="flex flex-col gap-3 w-full flex-1 min-h-0 my-3 ps-2"
          style={{ maxHeight: "calc(100% - 60px)" }}
        >
          <div className="flex justify-start gap-2 items-center border-b py-1">
            <span className="font-bold">Folders</span>
            <Button
              onClick={menuBarActions.handleAddPathCard}
              size="sm"
              variant="ghost"
              className="text-primary hover:text-black hover:bg-primary p-2"
            >
              <FolderPlus />
            </Button>
            <UsedPorts />
          </div>
          <div className="overflow-auto px-2">
            {pathCards.map((card) => (
              <PathCard
                allActiveTerminals={allActiveTerminals}
                pathCard={card}
                pathCards={pathCards}
                setPathCards={setPathCards}
                handleRemovePathCard={handleRemovePathCard}
                key={`${card.path}_${card.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
