import allureReporter from "@wdio/allure-reporter";
import fs from "fs";
import path from "path";
import xlsx, { CellAddress } from "xlsx";

const savePassedRecordings = true;
const specsPath = "./features";
const generatedSpecsPath = "./generated/features";
const allureResultsDir = "allure-results";

async function generateFeatureFiles(directory: string, exportDir: string) {
  for (const entry of fs.readdirSync(directory, {
    withFileTypes: true,
    recursive: true,
  })) {
    const fullPath = path.join(directory, entry.name);
    const exportFullPath = path.join(exportDir, entry.name);
    if (entry.isDirectory()) generateFeatureFiles(fullPath, exportFullPath);
    else if (entry.name.endsWith(".feature")) {
      if (!fs.existsSync(exportDir))
        fs.mkdirSync(exportDir, { recursive: true });
      fs.copyFileSync(fullPath, exportFullPath);
    } else if (entry.name.endsWith(".feature.template")) {
      if (!fs.existsSync(exportDir))
        fs.mkdirSync(exportDir, { recursive: true });
      console.log(`processing ${fullPath}`);
      const content = fs.readFileSync(fullPath, { encoding: "utf-8" });
      const output = fs.createWriteStream(
        exportFullPath.substring(0, exportFullPath.length - 9)
      );
      for (const line of content.split(/\r?\n/)) {
        const match = line.match(/<([^>]*\.example\.xlsx)>/);
        if (match) {
          let indent = line.substring(0, match.index);
          if (indent.trim().length > 0)
            throw Error(
              `Error in file ${fullPath}: .example.xlsx tokens must be at the start of the line`
            );
          indent = `\n${indent}|`;
          const workbook = xlsx.readFile(path.join(directory, match[1]));
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const address: CellAddress = { c: 0, r: 0 };
          while (true) {
            const a1Address = xlsx.utils.encode_cell(address);
            if (!(a1Address in sheet)) break;
            address.c++;
          }
          const columnCount = address.c;
          const row: string[] = [];
          while (true) {
            let hasCell = false;
            for (address.c = 0; address.c < columnCount; address.c++) {
              const a1Address = xlsx.utils.encode_cell(address);
              if (a1Address in sheet) {
                row.push(sheet[a1Address].w);
                hasCell = true;
              } else row.push("");
            }
            if (!hasCell) break;
            output.write(indent);
            for (const cell of row) {
              output.write(cell);
              output.write("|");
            }
            row.length = 0;
            address.r++;
          }
        } else {
          output.write("\n" + line);
        }
      }
    }
  }
}

export const config: WebdriverIO.Config = {
  runner: "local",
  tsConfigPath: "./tsconfig.json",

  port: 4723,
  specs: ["./generated/features/**/*.feature"],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      platformName: "Android",
      "appium:automationName": "UiAutomator2",
      "appium:appPackage": "com.arlosoft.macrodroid",
      "appium:appWaitActivity": "com.arlosoft.macrodroid.intro.IntroActivity",
    },
  ],

  logLevel: "info",
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ["appium"],
  framework: "cucumber",

  reporters: [
    [
      "allure",
      {
        outputDir: allureResultsDir,
        disableWebdriverStepsReporting: true,
        useCucumberStepReporter: true,
      },
    ],
  ],

  cucumberOpts: {
    require: ["./features/step-definitions/**/*.ts"],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    name: [],
    snippets: true,
    source: true,
    strict: false,
    tagExpression: "",
    timeout: 60000,
    ignoreUndefinedDefinitions: false,
  },

  onPrepare(_config, _cap) {
    fs.rmSync(allureResultsDir, { force: true, recursive: true });
    fs.rmSync(generatedSpecsPath, { force: true, recursive: true });
    generateFeatureFiles(specsPath, generatedSpecsPath);
  },

  async beforeScenario(_world, _context) {
    await driver.executeScript("mobile: startMediaProjectionRecording", [
      { resolution: "480x320" },
    ]);
  },

  async afterScenario(world, { passed }, context) {
    const recording = await driver.executeScript(
      "mobile: stopMediaProjectionRecording",
      []
    );
    if (!savePassedRecordings && passed) return;
    context.parameters.lastPickleId = world.pickle.id;
    allureReporter.addAttachment(
      `${world.pickle.name} - ${world.result?.status} - ${world.testCaseStartedId}`,
      Buffer.from(recording, "base64"),
      "video/mp4"
    );
  },
};
