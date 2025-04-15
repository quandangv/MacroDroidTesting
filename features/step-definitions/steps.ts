import { Given, When, Then, DataTable, world } from "@wdio/cucumber-framework";

import dashboardPage from "../pageobjects/dashboard.page.js";
import macroPage from "../pageobjects/macro.page.js";
import createVariablePage from "../pageobjects/variable.create.page.js";
import TryThen from "../helpers/softAssert.js";
import { ComponentPage, componentPage } from "../pageobjects/component.page.js";
import variableEditPage from "../pageobjects/variable.edit.page.js";
import actionBlockListPage from "../pageobjects/actionBlockList.page.js";
import EntityPage from "../pageobjects/entity.page.js";
import { ComponentList } from "../pageobjects/componentList.section.js";
import { $byId, $byText, ElementType, xpath } from "../helpers/selectors.js";
import variableListPage from "../pageobjects/variableList.page.js";

const knownPages: Record<string, any> = {
  "Add Macro": macroPage,
  "Action Blocks": actionBlockListPage,
  Variables: variableListPage,
};

function getPageAsserter<T>(
  type: { new (...args: any[]): T },
  descriptor: string
): () => T {
  return () => {
    const page = world.parameters.page;
    if (page instanceof type) return page;
    throw Error(`Current page (${page}) is not ${descriptor}`);
  };
}
// function getEntityPage() {
//   const page = world.parameters.page;
//   if (page instanceof EntityPage) return page;
//   throw Error("Current page is not an entity page");
// }

// function getListPage() {
//   const page = world.parameters.page;
//   if (page instanceof ComponentList) return page;
//   throw Error("Current page is not a list page");
// }

// function getComponentPage() {
//   const page = world.parameters.page;
//   if (page instanceof ComponentPage) return page;
//   throw Error("Current page is not a component page");
// }

const getEntityPage = getPageAsserter(EntityPage, "an entity page");
const getListPage = getPageAsserter(ComponentList, "a list page");
const getComponentPage = getPageAsserter(ComponentPage, "a component page");

async function gotoTab(
  tab: "homeTab" | "macrosTab" | "templatesTab" | "settingsTab"
) {
  await dashboardPage.goToDashboard();
  await dashboardPage[tab].click();
}

Given(/^I open the app on (\w+Tab)$/, gotoTab);

When(/^I go to (\w+Tab)$/, gotoTab);

When("(I )click on the {} tile", async function (name: string) {
  await dashboardPage.clickTile(name);
  if (name in knownPages) this.parameters.page = knownPages[name];
});

Then("I'm at the {} page", async function (name: string) {
  if (name == "Add Macro") {
    await expect($byId("editMacroContainer")).toExist();
    this.parameters.page = macroPage;
  } else {
    const title = $(`//${xpath(undefined, "toolbar")}/${xpath("text")}`);
    await expect(title).toHaveText(name);
    if (name in knownPages) this.parameters.page = knownPages[name];
  }
});

When("(I )add an item", async function () {
  this.parameters.page = await this.parameters.page!.clickAdd();
});

When("(I )add an item in the {word} list", async function (component: string) {
  this.parameters.page = await getEntityPage()
    .componentList(component)
    .clickAdd();
});

When(
  "(I )choose {string} category and {string} item",
  async function (category: string, item: string) {
    const component = getComponentPage();
    await component.clickCategory(category);
    await component.clickItem(item);
  }
);

When("(I )name it {string}", async function (name: string) {
  await getEntityPage().nameInput.setValue(name);
});

When(
  "(I )set its description to {string}",
  async function (description: string) {
    await getEntityPage().setDescription(description);
  }
);

When("(I )save it", async function () {
  await getEntityPage().save();
});

When("(I )add components", async function (dataTable: DataTable) {
  const components = dataTable.hashes();
  for (const component of components) {
    await getEntityPage().componentList(component.TYPE).clickAdd();
    await componentPage.clickCategory(component.CATEGORY);
    await componentPage.clickItem(component.ITEM);
    for (const option of component.OPTIONS.split(","))
      await componentPage.fillDialog(option.trim());
  }
});

When("(I )choose {string}", async function (option: string) {
  await componentPage.fillDialog(option);
});

When(
  "(I )add a(n) {word} variable named {}",
  async function (type: string, name: string) {
    const varList =
      this.parameters.page instanceof ComponentList
        ? this.parameters.page
        : getEntityPage().componentList("variable");
    await varList.clickAdd();
    await createVariablePage.createVariable(name, type);
  }
);

When("(I )add variables", async function (dataTable: DataTable) {
  const variables = dataTable.hashes();
  for (const variable of variables) {
    const varList =
      this.parameters.page instanceof ComponentList
        ? this.parameters.page
        : getEntityPage().componentList(variable.DIRECTION ?? "variable");
    await varList.clickAdd();
    await createVariablePage.createVariable(variable.NAME, variable.TYPE);
    let value;
    switch (variable.TYPE.toLowerCase()) {
      case "integer":
        value = parseInt(variable.VALUE);
        break;
      case "decimal":
        value = parseFloat(variable.VALUE);
        break;
      case "string":
        value = variable.VALUE;
        break;
      case "boolean":
        switch (variable.VALUE.toLowerCase()) {
          case "1":
          case "true":
            value = true;
            break;
          case "0":
          case "false":
            value = false;
            break;
          default:
            throw TypeError(
              "Boolean value must be either true or false, got: " +
                variable.VALUE
            );
        }
        break;
      default:
        throw TypeError("Invalid variable type: " + variable.TYPE);
    }
    await (await varList.retrieveItem(variable.NAME)).click();
    await variableEditPage.setValue(value);
  }
});

TryThen("the entity includes", async function (soft, dataTable: DataTable) {
  const items = dataTable.hashes();
  for (const item of items) {
    const component = getEntityPage().componentList(item.TYPE);
    await soft(async () => {
      await expect(await component.expandList()).toBeExisting({
        message: `There is no item in the ${item.TYPE} list`,
      });
      await expect(await component.retrieveItem(item.NAME)).toBeExisting({
        message: `Can't find the ${item.TYPE} with name ${item.NAME}`,
      });
      expect(await component.retrieveDescription(item.NAME)).toBe(item.DETAILS);
    }, `From ${JSON.stringify(item)}`);
  }
});

TryThen("the list includes", async function (soft, dataTable: DataTable) {
  const items = dataTable.hashes();
  const component = getListPage();
  for (const item of items) {
    await soft(async () => {
      await expect(await component.expandList()).toBeExisting({
        message: `There is no item in the list`,
      });
      await expect(await component.retrieveItem(item.NAME)).toBeExisting({
        message: `Can't find the item with name ${item.NAME}`,
      });
      expect(await component.retrieveDescription(item.NAME)).toBe(item.DETAILS);
    }, `From ${JSON.stringify(item)}`);
  }
});

Then(
  "there is a {} {string}",
  async function (type: ElementType, text: string) {
    await expect($byText(type, text)).toExist();
  }
);
