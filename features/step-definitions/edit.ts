import { When, DataTable } from "@wdio/cucumber-framework";
import createVariablePage from "../pageobjects/variable.create.page.js";
import { componentPage } from "../pageobjects/component.page.js";
import variableEditPage from "../pageobjects/variable.edit.page.js";
import { BaseList, EntityList } from "../pageobjects/entityList.js";
import { getEntityPage, getListPage, World } from "../helpers/steps.js";

/**If the current page is a list, click its add button */
When("(I )add an item", async function (this: World) {
  this.parameters.page = await getListPage().clickAdd();
});

/**If the named component of the page is a list, click its add button */
When(
  "(I )add an item in the {word} list",
  async function (this: World, component: string) {
    this.parameters.page = await getEntityPage()
      .componentList(component)
      .clickAdd();
  }
);

/**If the current page is a ComponentPage (for choosing triggers, actions, or constraints), select the component category and item*/
When(
  "(I )choose {string} category and {string} item",
  async function (this: World, category: string, item: string) {
    await componentPage.clickCategory(category);
    await componentPage.clickItem(item);
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

/**Add components (triggers, actions, or constraints) to the current entity page */
When("(I )add (a )component(s)", async function (dataTable: DataTable) {
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
  async function (this: World, type: string, name: string) {
    const varList =
      this.parameters.page instanceof BaseList
        ? (this.parameters.page as BaseList)
        : getEntityPage().componentList("variable");
    await varList.clickAdd();
    await createVariablePage.createVariable(name, type);
  }
);

When("(I )open the item named {string}", async function (name: string) {
  await (await getListPage().retrieveItem(name)).click();
});

When("(I )add variables", async function (this: World, dataTable: DataTable) {
  const variables = dataTable.hashes();
  for (const variable of variables) {
    const varList =
      this.parameters.page instanceof EntityList
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
