import allureReporter from "@wdio/allure-reporter"
export const config: WebdriverIO.Config = {
  runner: "local",
  tsConfigPath: "./tsconfig.json",

  port: 4723,
  specs: ["./features/**/*.feature"],
  exclude: [],
  maxInstances: 10,
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
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
      },
    ],
  ],

  cucumberOpts: {
    require: ["./features/step-definitions/steps.ts"],
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

  beforeScenario: function (_world, _context) {
    driver.startRecordingScreen()
  },
  afterScenario: async function (world, _result, _ontext) {
    allureReporter.addAttachment(
      world.pickle.name,
      await driver.stopRecordingScreen(),
      "video/mp4"
    )
  },
}
