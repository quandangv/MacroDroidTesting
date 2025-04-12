import VariablePage from "./variable.page.js"
import { $macrodroid } from "./page.js"

class CreateVariablePage extends VariablePage {
  public get trueRadioBtn() {
    return $macrodroid("trueRadio")
  }

  public get falseRadioBtn() {
    return $macrodroid("falseRadio")
  }

  public get valueInput() {
    return $macrodroid("enter_variable_dialog_value")
  }

  public async setValue(value: string | boolean | number) {
    if (typeof value === "boolean")
      await (value ? this.trueRadioBtn : this.falseRadioBtn).click()
    else if (["string", "number"].includes(typeof value))
      await this.valueInput.setValue(value)
    await this.clickOk()
  }
}

export default new CreateVariablePage()
