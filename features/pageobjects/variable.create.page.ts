import VariablePage from "./variable.page.js"
import { $macrodroid, $text } from "./page.js"

class CreateVariablePage extends VariablePage {
  public get nameInput() {
    return $macrodroid("variable_new_variable_dialog_name")
  }

  public get typeDropdown() {
    return $macrodroid("variable_new_variable_type_spinner")
  }

  public async createVariable(name: string, type: string) {
    await this.nameInput.setValue(name)
    await this.typeDropdown.click()
    await $text("android.widget.CheckedTextView", type).click()
    await this.clickOk()
  }
}

export default new CreateVariablePage()
