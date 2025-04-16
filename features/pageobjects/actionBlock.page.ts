import { ChainablePromiseElement } from "webdriverio";
import { $byId } from "../helpers/selectors.js";
import { CollapsibleList, EntityList } from "./entityList.page.js";
import EntityPage from "./entity.page.js";
/**
 * sub page containing specific selectors and methods for a specific page
 */
class ActionBlockPage extends EntityPage {
  override get nameInput(): ChainablePromiseElement {
    return $byId("actionBlockNameText");
  }

  public input = new CollapsibleList(
    "addInputVariableButton",
    "inputVarsList",
    null,
    "inputCollapseExpandButton"
  );

  public action = new EntityList("addActionButton", "actionsList", null);

  public output = new CollapsibleList(
    "addOutputVariableButton",
    "outputVarsList",
    null,
    "outputCollapseExpandButton"
  );
}
export default new ActionBlockPage();
