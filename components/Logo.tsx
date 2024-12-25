import { cn } from "@/lib/utils";
import { Workflow } from "lucide-react";
import Link from "next/link";
import React from "react";

function Logo({
  fontSize = "text-2xl",
  iconSize = 30,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link
      href={"/"}
      className={cn(
        " p-4 rounded-xl text-2xl font-extrabold flex justify-center items-center gap-2",
        fontSize
      )}
    >
      <div>
        <Workflow size={iconSize} />
      </div>
      <div>
        <span className="bg-gradient-to-r from-primary/100 to-primary/60 bg-clip-text text-transparent">
          Easy
        </span>
        <span className="text-stone-700 dark:text-stone-300">Scrape</span>
      </div>
    </Link>
  );
}

export default Logo;
