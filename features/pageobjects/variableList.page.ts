import { xpath } from "../helpers/selectors.js";
import { EntityList } from "./entityList.page.js";
import variableCreatePage from "./variable.create.page.js";
/**
 * sub page containing specific selectors and methods for a specific page
 */
class VariableListPage extends EntityList {
  constructor() {
    super("fab", "variables_activity_list", variableCreatePage);
  }

  protected override get nameId(): string {
    return "variable_cell_variable_name";
  }
  public override async retrieveItem(name: string) {
    return (await this.expandList()).$(
      `//${xpath("text", this.nameId, name)}/parent::*/parent::*/parent::*`
    );
  }

  protected override get descriptionId(): string {
    return "variable_cell_badge";
  }
}

export default new VariableListPage();
