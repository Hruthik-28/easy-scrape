/*
  Warnings:

  - Added the required column `defination` to the `WorkflowExecution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkflowExecution" ADD COLUMN     "defination" TEXT NOT NULL;
