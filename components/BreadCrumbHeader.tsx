"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";

function BreadCrumbHeader() {
  const pathName = usePathname();
  const paths = pathName === "/" ? [""] : pathName?.split("/");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => (
          <React.Fragment key={index}>
            {path !== "" && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink className="capitalize" href={`/${path}`}>
                {path === "" ? "home" : path}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadCrumbHeader;
