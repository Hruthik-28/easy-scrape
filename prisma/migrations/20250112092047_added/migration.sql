-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN     "lastRunAt" TIMESTAMP(3),
ADD COLUMN     "lastRunId" TIMESTAMP(3),
ADD COLUMN     "lastRunStatus" TIMESTAMP(3);
