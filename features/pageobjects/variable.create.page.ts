import VariableBasePage from "./variableBase.page.js";
import { $byId, $byText } from "../helpers/selectors.js";

class CreateVariablePage extends VariableBasePage {
  public get nameInput() {
    return $byId("variable_new_variable_dialog_name");
  }

  public get typeDropdown() {
    return $byId("variable_new_variable_type_spinner");
  }

  public async createVariable(name: string, type: string) {
    await this.nameInput.setValue(name);
    await this.typeDropdown.click();
    await $byText("radio button", type, false).click();
    await this.clickOk();
  }
}

export default new CreateVariablePage();
