import Logo from "@/components/Logo";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
        <Logo iconSize={40} fontSize="text-4xl"/>
        {children}
    </div>
  );
}

export default layout;
