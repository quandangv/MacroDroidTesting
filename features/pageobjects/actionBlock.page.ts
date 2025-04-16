import { ChainablePromiseElement } from "webdriverio";
import { $byId } from "../helpers/selectors.js";
import { CollapsibleList, EntityList } from "./entityList.js";
import EntityPage from "./entity.js";

/**Represents the page to create/edit action blocks on the app */
class ActionBlockPage extends EntityPage {
  override get nameInput(): ChainablePromiseElement {
    return $byId("actionBlockNameText");
  }

  /**The list of input variables */
  public input = new CollapsibleList(
    "addInputVariableButton",
    "inputVarsList",
    "inputCollapseExpandButton"
  );

  /**The list of actions in the block */
  public action = new EntityList("addActionButton", "actionsList");

  /**The list of output variables */
  public output = new CollapsibleList(
    "addOutputVariableButton",
    "outputVarsList",
    "outputCollapseExpandButton"
  );
}
export default new ActionBlockPage();
