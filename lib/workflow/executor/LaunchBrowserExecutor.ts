import { ExecutionEnvironment } from "@/types/executor";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import { LaunchBrowserTask } from "../task/LaunchBrowserTask";

const isLocal = !!process.env.CHROME_EXECUTABLE_PATH_LOCAL;

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");

    const executablePath =
      process.env.CHROME_EXECUTABLE_PATH_LOCAL ||
      (await chromium.executablePath(
        process.env.CHROME_EXECUTABLE_PATH_PODUCTION
      ));

    const browser = await puppeteer.launch({
      args: isLocal ? puppeteer.defaultArgs() : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });

    environment.setBrowser(browser);
    const newPage = await browser.newPage();
    await newPage.goto(websiteUrl);
    environment.setPage(newPage);

    return true;
  } catch (error) {
    console.error("Error while running LaunchBrowserExecutor", error);
    return false;
  }
}
