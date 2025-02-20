"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import{Input} from "@/components/ui/"

const PathCard = () => {
  const [folderPath, setFolderPath] = useState();



  return (
    <Card>
      <CardHeader>
        <CardTitle>Select directory</CardTitle>
        <CardDescription>
          Directory absolute path where all your apps are (ex. projects, monorepo)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <Input placeholder="Projects absolute path..."/>
        </div>
      </CardContent>
    </Card>
  );
};

export default PathCard;
