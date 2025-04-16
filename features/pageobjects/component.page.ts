import { $byId, $byText, $byType } from "../helpers/selectors.js";
import Page from "./page.js";

/**Represents the pages to select the type of trigger, action, or constraint on the app */
class ComponentPage extends Page {
  public async clickCategory(name: string) {
    await $byId("category_name", name).click();
  }

  public async clickItem(name: string) {
    await $byId("select_item_name", name).click();
  }

  /**
   * Fill the current dialog and press Ok
   * If the dialog has radio buttons, select the button whose text matches `content`
   * If the dialog has a text box, enter `content` to it
   * @param content The content to fill the dialog with
   */
  public async fillDialog(content: string) {
    if (await $byType("radio button").isExisting())
      await $byText("radio button", content).click();
    else if (await $byType("text box").isExisting())
      await $byType("text box").setValue(content);
    else throw Error("Can't find the field to enter content");
    await $byText("button", "OK").click();
  }
}
export const componentPage = new ComponentPage();
