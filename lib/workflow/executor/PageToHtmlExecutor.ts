import { ExecutionEnvironment } from "@/types/executor";
import { PageToHtml } from "../task/PageToHtml";

export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtml>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Html", html);

    return true;
  } catch (error) {
    console.error("Error while running PageToHtmlExecutor", error);
    return false;
  }
}
