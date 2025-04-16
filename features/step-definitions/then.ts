import { Then, DataTable } from "@wdio/cucumber-framework";
import TryThen from "../helpers/softAssert.js";
import { $byText, ElementType } from "../helpers/selectors.js";
import { getEntityPage, getListPage } from "../helpers/steps.js";

/**Compares the components (triggers, actions, constraints, or variables) of the current entity page to the step's data table
 * This will complete all comparisons, supressing assertion errors before throwing them at the end of the step
 */
TryThen("the entity includes", async function (soft, dataTable: DataTable) {
  const items = dataTable.hashes();
  for (const item of items) {
    const component = getEntityPage().componentList(item.TYPE);
    await soft.wrap(async () => {
      await expect(await component.expandList()).toBeExisting({
        message: `There is no item in the ${item.TYPE} list`,
      });
      await expect(await component.retrieveItem(item.NAME)).toBeExisting({
        message: `Can't find the ${item.TYPE} with name ${item.NAME}`,
      });
    });
    const data = await component.retrieveData(item.NAME);
    for (const key in item)
      if (key != "TYPE") soft.expect(data[key]).toBe(item[key]);
  }
});

/**Compares the items of the current list page to the step's data table
 * This will complete all comparisons, supressing assertion errors before throwing them at the end of the step
 */
TryThen("the list includes", async function (soft, dataTable: DataTable) {
  const items = dataTable.hashes();
  const component = getListPage();
  for (const item of items) {
    await soft.wrap(async () => {
      await expect(await component.expandList()).toBeExisting({
        message: `There is no item in the list`,
      });
      await expect(await component.retrieveItem(item.NAME)).toBeExisting({
        message: `Can't find the item with name ${item.NAME}`,
      });
    });
    const data = await component.retrieveData(item.NAME);
    for (const key in item) soft.expect(data[key]).toBe(item[key]);
  }
});

Then(
  "there is a {} {string}",
  async function (type: ElementType, text: string) {
    await expect($byText(type, text)).toExist();
  }
);
