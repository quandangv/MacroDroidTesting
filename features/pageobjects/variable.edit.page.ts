import DialogBase from "./dialogBase.js";
import { $byId } from "../helpers/selectors.js";

/**Represents the dialog to edit variables on the app */
class EditVariablePage extends DialogBase {
  public get trueRadioBtn() {
    return $byId("trueRadio");
  }

  public get falseRadioBtn() {
    return $byId("falseRadio");
  }

  public get valueInput() {
    return $byId("enter_variable_dialog_value");
  }

  /**Set the value of the variable */
  public async setValue(value: string | boolean | number) {
    if (typeof value === "boolean")
      await (value ? this.trueRadioBtn : this.falseRadioBtn).click();
    else if (["string", "number"].includes(typeof value))
      await this.valueInput.setValue(value);
    await this.clickOk();
  }
}
export default new EditVariablePage();
