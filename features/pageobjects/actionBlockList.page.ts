import actionBlockPage from "./actionBlock.page.js";
import { ComponentList } from "./componentList.section.js";
/**
 * sub page containing specific selectors and methods for a specific page
 */
class ActionBlockListPage extends ComponentList {
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
