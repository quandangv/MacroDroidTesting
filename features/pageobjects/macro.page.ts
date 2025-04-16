import { CollapsibleList, EntityList } from "./entityList.js";
import EntityPage from "./entity.js";
import { $byId } from "../helpers/selectors.js";
import { componentPage } from "./component.page.js";

/**Represents the page to create and edit macros on the app */
class MacroPage extends EntityPage {
  override get nameInput() {
    return $byId("macroNameText");
  }

  override get descriptionInput() {
    return $byId("macroDescription");
  }

  /**The list of triggers in the macro */
  public trigger = new EntityList(
    "edit_macro_addTriggerButton",
    "triggersList",
    componentPage
  );

  /**The list of actions in the macro */
  public action = new EntityList(
    "edit_macro_addActionButton",
    "actionsList",
    componentPage
  );

  /**The list of constraints in the macro */
  public constraint = new EntityList(
    "edit_macro_addConstraintButton",
    "constraintsList",
    componentPage
  );

  /**The list of local variables in the macro */
  public variable = new CollapsibleList(
    "addVariableButton",
    "localVarsList",
    "localVarsLabel"
  );

  /**Collapse the variable list and click save */
  override async save() {
    if (!(await this.btnSave.isExisting())) await this.variable.toggle();
    if (!(await this.btnSave.isExisting())) await this.variable.toggle();
    await super.save();
  }
}
export default new MacroPage();
