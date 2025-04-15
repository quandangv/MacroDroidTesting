import { $byId, $byText, $byType } from "../helpers/selectors.js";
import Page from "./page.js";

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class ComponentPage extends Page {
  public async clickCategory(name: string) {
    await $byId("category_name", name).click();
  }

  public async clickItem(name: string) {
    await $byId("select_item_name", name).click();
  }

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
