"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowPhaseDetails(phaseId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenicated request");
  }

  const phaseDetails = await prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      execution: {
        userId
      }
    },
  });

  if (!phaseDetails) {
    throw new Error("Failed to fetch phase details");
  }

  return phaseDetails;
}
