import { Page, $macrodroid, $text } from "./page.js"
import EditVariablePage from "./variable.edit.page.js"
import { ChainablePromiseElement } from "webdriverio"

/**
 * sub page containing specific selectors and methods for a specific page
 */
class MacroPage extends Page {
  public get btnAddTrigger() {
    return $macrodroid("edit_macro_addTriggerButton")
  }

  public get btnAddAction() {
    return $macrodroid("edit_macro_addActionButton")
  }

  public get btnAddConstraint() {
    return $macrodroid("edit_macro_addConstraintButton")
  }

  public get btnAddVariable() {
    return $macrodroid("addVariableButton")
  }
  public get localVariablesSection() {
    return $macrodroid("localVarsLabel")
  }

  public get triggersList() {
    return $macrodroid("triggersList")
  }

  public get actionsList() {
    return $macrodroid("actionsList")
  }

  public get constraintsList() {
    return $macrodroid("constraintsList")
  }

  public get variablesList() {
    return $macrodroid("localVarsList")
  }

  public itemList = {
    triggers: this.triggersList,
    variables: this.variablesList,
  }

  public async expandLocalVariables() {
    if (!(await this.btnAddVariable.isExisting()))
      await this.localVariablesSection.click()
  }

  public async addLocalVariable() {
    await this.expandLocalVariables()
    await this.btnAddVariable.click()
  }

  public async clickAddBtn(itemType: string) {
    switch (itemType.toLowerCase()) {
      case "trigger":
        await this.btnAddTrigger.click()
        break
      case "action":
        await this.btnAddAction.click()
        break
      case "constraint":
        await this.btnAddConstraint.click()
        break
      default:
        throw new TypeError(
          "itemType must be either trigger, action, or constraint"
        )
    }
  }

  public async clickCategory(name: string) {
    await $macrodroid("category_name", name).click()
  }

  public async clickItem(name: string) {
    await $macrodroid("select_item_name", name).click()
  }

  public async fillDialog(content: string) {
    if (await $("android.widget.CheckedTextView").isExisting())
      await $text("android.widget.CheckedTextView", content).click()
    else if (await $("android.widget.EditText").isExisting())
      await $("android.widget.EditText").setValue(content)
    else throw Error("Can't find the field to enter content")
    await $text("android.widget.Button", "OK").click()
  }

  public async editVariable(name: string, value: any) {
    await this.getListItem(this.variablesList, name).click()
    await EditVariablePage.setValue(value)
  }

  public getListItem(list: ChainablePromiseElement, name: string) {
    return list.$(
      `//android.widget.TextView[@resource-id="com.arlosoft.macrodroid:id/macro_edit_entry_name" and @text="${name}"]/parent::*`
    )
  }
  public async getListItemDescription(
    list: ChainablePromiseElement,
    name: string
  ) {
    const item = this.getListItem(list, name).$(
      "id=com.arlosoft.macrodroid:id/macro_edit_entry_detail"
    )
    if (await item.isExisting()) return await item.getText()
    return ""
  }
}

export default new MacroPage()
