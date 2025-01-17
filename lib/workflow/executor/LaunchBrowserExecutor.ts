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
      args: isLocal
        ? puppeteer.defaultArgs()
        : [...chromium.args, "--no-sandbox"],
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
      timeout: 30000, // 30s
    });

    environment.setBrowser(browser);
    environment.log.info("Browser started successfully");

    const newPage = await browser.newPage();
    await newPage.goto(websiteUrl);
    environment.setPage(newPage);

    environment.log.info(`Opened page at: ${websiteUrl}`);

    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
