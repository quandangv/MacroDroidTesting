import VariableBasePage from "./variableBase.page.js";
import { $byId } from "../helpers/selectors.js";

class EditVariablePage extends VariableBasePage {
  public get trueRadioBtn() {
    return $byId("trueRadio");
  }

  public get falseRadioBtn() {
    return $byId("falseRadio");
  }

  public get valueInput() {
    return $byId("enter_variable_dialog_value");
  }

  public async setValue(value: string | boolean | number) {
    if (typeof value === "boolean")
      await (value ? this.trueRadioBtn : this.falseRadioBtn).click();
    else if (["string", "number"].includes(typeof value))
      await this.valueInput.setValue(value);
    await this.clickOk();
  }
}

export default new EditVariablePage();
