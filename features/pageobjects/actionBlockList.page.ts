import actionBlockPage from "./actionBlock.page.js";
import { EntityList } from "./entityList.js";

/**Represents the list of action blocks on the app */
class ActionBlockListPage extends EntityList {
  constructor() {
    super("fab", "actionBlocksList", actionBlockPage);
  }

  protected override get nameId(): string {
    return "name";
  }

  protected override get detailId(): string {
    return "actionsList";
  }
}
export default new ActionBlockListPage();
