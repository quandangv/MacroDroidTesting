import { $byId } from "../helpers/selectors.js";
import Page from "./page.js";

export default class DialogBase extends Page {
  private get btnOk() {
    return $byId("okButton");
  }

  private get btnCancel() {
    return $byId("cancelButton");
  }

  public async clickOk() {
    await driver.hideKeyboard();
    await this.btnOk.click();
  }

  public async clickCancel() {
    await driver.hideKeyboard();
    await this.btnCancel.click();
  }
}
