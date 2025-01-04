import { TaskType } from "@/types/task";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowserTask";
import { PageToHtml } from "./PageToHtml";
import { WorkflowTask } from "@/types/workflow";

export type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtml,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
};
