import { Page, $macrodroid } from "./page.js"

export default class VariablePage extends Page {
  private get btnOk() {
    return $macrodroid("okButton")
  }

  private get btnCancel() {
    return $macrodroid("cancelButton")
  }

  public async clickOk() {
    await driver.hideKeyboard()
    await this.btnOk.click()
  }

  public async clickCancel() {
    await driver.hideKeyboard()
    await this.btnCancel.click()
  }
}
