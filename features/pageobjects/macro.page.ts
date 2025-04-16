import { CollapsibleList, EntityList } from "./entityList.page.js";
import EntityPage from "./entity.page.js";
import { $byId } from "../helpers/selectors.js";
import { componentPage } from "./component.page.js";

class MacroPage extends EntityPage {
  override get nameInput() {
    return $byId("macroNameText");
  }

  override get descriptionInput() {
    return $byId("macroDescription");
  }

  public trigger = new EntityList(
    "edit_macro_addTriggerButton",
    "triggersList",
    componentPage
  );

  public action = new EntityList(
    "edit_macro_addActionButton",
    "actionsList",
    componentPage
  );

  public constraint = new EntityList(
    "edit_macro_addConstraintButton",
    "constraintsList",
    componentPage
  );

  public variable = new CollapsibleList(
    "addVariableButton",
    "localVarsList",
    null,
    "localVarsLabel"
  );
  override async save() {
    if (!(await this.btnSave.isExisting())) await this.variable.toggle();
    if (!(await this.btnSave.isExisting())) await this.variable.toggle();
    await super.save();
  }
}

export default new MacroPage();
