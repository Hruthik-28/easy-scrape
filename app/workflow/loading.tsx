import { LoaderIcon } from "lucide-react";
import React from "react";

function loading() {
  return (
    <div className="flex justify-center items-center h-screen min-h-screen">
      <LoaderIcon size={16} className="animate-spin h-8 w-8 stroke-primary" />
    </div>
  );
}

export default loading;
