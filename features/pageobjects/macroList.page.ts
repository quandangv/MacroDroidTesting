import { xpath } from "../helpers/selectors.js";
import { BaseList } from "./entityList.js";
import macroPage from "./macro.page.js";

/**Represents the Macros tab in the app */
class MacroListTab extends BaseList {
  constructor() {
    super("macro_list_add_button", "recycler_view", macroPage);
  }

  protected override get nameId(): string {
    return "macroNameText";
  }

  public override async retrieveItem(name: string) {
    return (await this.expandList()).$(
      `//${xpath("text", this.nameId, name)}/parent::*/parent::*`
    );
  }

  public override async retrieveData(name: string) {
    const item = await this.retrieveItem(name);
    const getChild = async (id: string) =>
      await item.$("//" + xpath("text", id)).getText();
    return {
      NAME: name,
      TRIGGERS: await getChild("macroTrigger"),
      ACTIONS: await getChild("macroActions"),
      CONSTRAINTS: await getChild("macroConstraints"),
    };
  }
}
export default new MacroListTab();
