import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-10 p-5 text-center">
      <div className="flex flex-col justify-center items-center">
        <p className="font-bold text-6xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          404
        </p>
        <p className="text-xl font-medium">Page Not Found</p>
      </div>
      <div className="flex flex-col space-y-4">
        <p className="text-muted-foreground">
          Don&apos;t Worry. Sometimes even Good things gets lost.
        </p>
        <div className="flex justify-center items-center ">
          <Link href={"/"}>
            <Button>
              <ArrowLeft className="hover:text-primary" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
