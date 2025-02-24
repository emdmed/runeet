"use client";

import { useState } from "react";
import { GitBranch, LoaderCircle } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const GitDisplay = ({ packageFile }) => {
    const [selectedBranch, setSelectedBranch] = useState(packageFile?.gitBranch || "none");
    const [branches] = useState([...packageFile?.availableBranches, packageFile?.gitBranch, "none"]);
    const [isFetching, setIsFetching] = useState(false);

    const changeBranchRequest = async (newBranch) => {
        setIsFetching(true);
        const response = await fetch("/api/switch-branch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                directory: packageFile?.path || null,
                branch: newBranch
            }),
        });

        const jsonRes = await response.json();
        setIsFetching(false);
        return jsonRes;
    };

    const handleBranchChange = async (newBranch) => {
        const jsonResponse = await changeBranchRequest(newBranch);
        console.log("jsonResponse", jsonResponse);
        if (jsonResponse.error) {
            toast.error(jsonResponse?.error || "Unknown error", {
                description: jsonResponse?.details || "",
            });
        } else {
            setSelectedBranch(newBranch);
        }
    };

    return (
        <div className={`${packageFile?.gitBranch ? "text-git" : "text-muted"} flex items-center gap-1 relative mx-2 h-8`}>
            {isFetching ? (
                <div className="flex items-center justify-center w-[140px]">
                    <LoaderCircle size={17} className="spinner text-git animate-spin p-0 m-0" />
                </div>
            ) : (
                <div className="flex items-center">
                    <GitBranch className="relative bottom-[2px]" size={15} />
                    <Select value={selectedBranch} onValueChange={handleBranchChange}>
                        <SelectTrigger className="w-[140px] border-0">
                            <SelectValue placeholder="Select a branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {branches.map(branch => (
                                    <SelectItem className="hover:text-git focus:text-git" key={branch} value={branch}>
                                        {branch}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
};

export default GitDisplay;
