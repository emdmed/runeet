/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import PathCard from "./components/path-card/pathCard";
import { useEffect, useState } from "react";
import { FastForward, Folder } from "lucide-react";
import { usePathCardPersistence } from "./hooks/usePathCardsPersistence";
import { useApi } from "./hooks/useApi"
import MenuBar from "./components/menuBar/menuBar"
import Socials from "./components/socials"
import UsedPorts from "./components/usedPorts/usedPorts"

export default function Home() {
  const storedPathCards = usePathCardPersistence();
  const [isCoolMode, setIsCoolMode] = useState(true)
  const [monitoringSettings, setMonitoringSettings] = useState({
    autoMonitoring: true,
    interval: 10,
  });
  const [allActiveTerminals, setAllActiveTerminals] = useState();

  const { routes } = useApi()

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
    }

    setPathCards(state => ([newPathCard, ...state]));
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
    handleMonitoringIntervalChange
  }

  return (
    <div className={`h-screen max-h-screen p-8 ${isCoolMode ? "screen-container" : ""}`}>
      <div className="flex gap-2 justify-between mb-4 items-center">
        <div className={`flex items-center  ${isCoolMode ? "flicker" : ""}`}>
          <h1 className={`font-bold me-3 text-2xl mb-0 text-primary`}>./RunDeck</h1>

          <FastForward
            className="text-primary"
            style={{ bottom: 3 }}
          />

        </div>
        <Socials />
      </div>

      <MenuBar
        setIsCoolMode={setIsCoolMode}
        isCoolMode={isCoolMode}
        menuBarActions={menuBarActions}
        monitoringSettings={monitoringSettings}
        setMonitoringSettings={setMonitoringSettings}
        monitorTerminals={monitorTerminals}
      />
      <UsedPorts />
      <div
        className="flex flex-col gap-3 w-full flex-1 min-h-0"
        style={{ maxHeight: "calc(100% - 100px" }}
      >
        <div className="flex justify-start gap-2">
          <h5 className="font-bold">Folders</h5>
          <Folder/>
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
  );
}
