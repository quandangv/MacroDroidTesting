import actionBlockPage from "./actionBlock.page.js";
import { EntityList } from "./entityList.page.js";
/**
 * sub page containing specific selectors and methods for a specific page
 */
class ActionBlockListPage extends EntityList {
  constructor() {
    super("fab", "actionBlocksList", actionBlockPage);
  }

  protected override get nameId(): string {
    return "name";
  }

  protected override get descriptionId(): string {
    return "actionsList";
  }
}

export default new ActionBlockListPage();
