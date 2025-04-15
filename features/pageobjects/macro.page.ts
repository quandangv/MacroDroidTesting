import { CollapsibleList, ComponentList } from "./componentList.section.js";
import EntityPage from "./entity.page.js";
import { $byId } from "../helpers/selectors.js";
import { componentPage } from "./component.page.js";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class MacroPage extends EntityPage {
  override get nameInput() {
    return $byId("macroNameText");
  }

  override get descriptionInput() {
    return $byId("macroDescription");
  }

  public trigger = new ComponentList(
    "edit_macro_addTriggerButton",
    "triggersList",
    componentPage
  );

  public action = new ComponentList(
    "edit_macro_addActionButton",
    "actionsList",
    componentPage
  );

  public constraint = new ComponentList(
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
}

export default new MacroPage();
