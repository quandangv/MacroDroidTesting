import { Given, When, Then, world } from "@wdio/cucumber-framework";
import dashboardPage from "../pageobjects/dashboard.page.js";
import macroPage from "../pageobjects/macro.page.js";
import actionBlockListPage from "../pageobjects/actionBlockList.page.js";
import { $byId, xpath } from "../helpers/selectors.js";
import variableListPage from "../pageobjects/variableList.page.js";
import macroListTab from "../pageobjects/macroList.page.js";
import { World } from "../helpers/steps.js";

/**Mapping of page titles to page objects. Steps will use this to update world.parameters.page */
const knownPages: Record<string, any> = {
  "Add Macro": macroPage,
  "Action Blocks": actionBlockListPage,
  Variables: variableListPage,
};

async function gotoTab(
  tab: "homeTab" | "macrosTab" | "templatesTab" | "settingsTab"
) {
  await dashboardPage.goToDashboard();
  await dashboardPage[tab].click();
  if (tab == "macrosTab") world.parameters.page = macroListTab;
}

Given(/^I open the app on (\w+Tab)$/, gotoTab);

When(/^I go to (\w+Tab)$/, gotoTab);

When("(I )click on the {} tile", async function (this: World, name: string) {
  await dashboardPage.clickTile(name);
  if (name in knownPages) this.parameters.page = knownPages[name];
});

Then("I'm at the {} page", async function (this: World, name: string) {
  if (name == "Add Macro") {
    await expect($byId("editMacroContainer")).toExist();
    this.parameters.page = macroPage;
  } else if (name == "Macro List") {
    await expect(
      (await $byId("titleText").getText()).startsWith("Macros")
    ).toBeTruthy();
    this.parameters.page = macroListTab;
  } else {
    const title = $(`//${xpath(undefined, "toolbar")}/${xpath("text")}`);
    await expect(title).toHaveText(name);
    if (name in knownPages) this.parameters.page = knownPages[name];
  }
});
