import { Given, When, DataTable } from "@wdio/cucumber-framework"

import DashboardPage from "../pageobjects/dashboard.page.js"
import MacroPage from "../pageobjects/macro.page.js"
import CreateVariablePage from "../pageobjects/variable.create.page.js"
import macroPage from "../pageobjects/macro.page.js"
import { soft, TryThen } from "../helpers/softAssert.js"

Given(
  /^I open the app on (\w+)$/,
  async (tab: "homeTab" | "macrosTab" | "templatesTab" | "settingsTab") => {
    await DashboardPage.goToDashboard()
    await DashboardPage[tab].click()
  }
)

When(
  /^I click on the "([^"]+)" tile$/,
  async (name: "Add Macro" | "Action Blocks") => {
    await DashboardPage.clickTile(name)
  }
)

When(/^I add macro components$/, async (dataTable: DataTable) => {
  const components = dataTable.hashes()
  for (const component of components) {
    await MacroPage.clickAddBtn(component.TYPE)
    await MacroPage.clickCategory(component.CATEGORY)
    await MacroPage.clickItem(component.ITEM)
    for (const option of component.OPTIONS.split(","))
      await MacroPage.fillDialog(option.trim())
  }
})

When(/^I add local variables$/, async (dataTable: DataTable) => {
  const variables = dataTable.hashes()
  for (const variable of variables) {
    await MacroPage.addLocalVariable()
    CreateVariablePage.createVariable(variable.NAME, variable.TYPE)
    let value
    switch (variable.TYPE) {
      case "Integer":
        value = parseInt(variable.VALUE)
        break
      case "String":
        value = variable.VALUE
        break
      case "Boolean":
        switch (variable.VALUE.toLowerCase()) {
          case "true":
            value = true
            break
          case "false":
            value = false
            break
          default:
            throw TypeError("Boolean value must be either true or false")
        }
        break
    }
    await MacroPage.editVariable(variable.NAME, value)
  }
})

TryThen(/^the macro includes$/, async (dataTable: DataTable) => {
  const items = dataTable.hashes()
  for (const item of items) {
    if (item.TYPE === "variable") await MacroPage.expandLocalVariables()
    const list =
      MacroPage[
        (item.TYPE + "sList") as
          | "triggersList"
          | "actionsList"
          | "constraintsList"
          | "variablesList"
      ]
    await soft(async () => {
      await expect(list).toBeExisting()
      await expect(macroPage.getListItem(list, item.NAME)).toBeExisting()
      expect(await MacroPage.getListItemDescription(list, item.NAME)).toBe(
        item.DETAILS
      )
    })
  }
})
