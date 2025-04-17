# MacroDroid Automated Testing

## Get Started

Install [Android Studio](https://developer.android.com/studio) and set ANDROID_HOME variable to your Android/Sdk folder.

Install dependencies with `npm install`

Connect your Android device, and check the connection with `adb devices`

Run the automated tests: `npx wdio`

## Managing Test Cases

Data for test cases are stored in /features/\*.example.xlsx files. They are inserted to corresponding .feature.template files as [Data Tables](https://cucumber.io/docs/gherkin/reference#data-tables) before being run by Cucumber.

The code for each steps of the .feature.template files are located at /features/step-definitions. It uses helpers from /features/helpers and page objects from /features/pageobjects.

All platform-specific code should be in a helper file, such as features/helpers/selectors.ts, to improve scalability.

## Test Report

After running the tests, an Allure report can be generated and served using `allure generate && allure open`

Reports from previous runs can be found as artifacts in the Actions page of the Github repo. They can be extracted and served by running `allure open` in the folder containing `allure-report`
