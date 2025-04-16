import { $byId, xpath } from "../helpers/selectors.js";
import Page from "./page.js";

export class BaseList extends Page {
  addButtonId: string;
  listId: string;
  addPage: Page | undefined;

  /**
   * @param addButtonId Id of the button to add list items
   * @param listId Id of the element containing all list items (when expanded)
   * @param addPage The page that the app will open when the add button is clicked
   */
  constructor(addButtonId: string, listId: string, addPage?: Page) {
    super();
    this.addButtonId = addButtonId;
    this.listId = listId;
    this.addPage = addPage;
  }

  /**The button to add list items */
  protected get btnAdd() {
    return $byId(this.addButtonId);
  }

  /**The element containing all list items (when expanded) */
  protected get list() {
    return $byId(this.listId);
  }

  /**The element in each list item whose text is the item name */
  protected get nameId() {
    return "macro_edit_entry_name";
  }

  /**
   * Expand the list (if needed) and click the add button.
   */
  public async clickAdd() {
    await this.btnAdd.click();
    return this.addPage;
  }

  /**
   * Expand the list (if needed) and return the element containing all items in the list.
   * @returns The element containing all list items
   */
  public async expandList() {
    return this.list;
  }

  /**
   * Expand the list (if needed) and get the item element with a specific name from the list.
   * @param name The text to search the item with
   * @returns The item element with the specified name
   */
  public async retrieveItem(name: string) {
    return (await this.expandList()).$(
      `//${xpath("text", this.nameId, name)}/parent::*`
    );
  }

  /**
   * Expand the list (if needed) and get the data object of an item element from the list.
   * @param name The text to search the item with
   * @returns The data object of the item
   */
  public async retrieveData(name: string): Promise<Record<string, string>> {
    return (await (await this.retrieveItem(name)).isExisting())
      ? {
          NAME: name,
        }
      : { NAME: "" };
  }
}

/**Represents lists whose items contain a name and a detail text */
export class EntityList extends BaseList {
  protected get detailId() {
    return "macro_edit_entry_detail";
  }

  public async retrieveData(name: string): Promise<Record<string, string>> {
    const description = (await this.retrieveItem(name)).$(
      "//" + xpath("text", this.detailId)
    );
    return {
      NAME: name,
      DETAILS: (await description.isExisting())
        ? await description.getText()
        : "",
    };
  }
}

/**Represents lists the can be collapsed and expanded */
export class CollapsibleList extends EntityList {
  toggleId: string;

  /**
   * @param addButtonId Id of the button to add list items
   * @param listId Id of the element containing all list items (when expanded)
   * @param toggleId Id of the element to expand and collapse the list
   * @param addPage The page that the app will open when the add button is clicked
   */
  constructor(
    addButtonId: string,
    listId: string,
    toggleId: string,
    addPage?: Page
  ) {
    super(addButtonId, listId, addPage);
    this.toggleId = toggleId;
  }

  public async toggle() {
    await $byId(this.toggleId).click();
  }

  public override async clickAdd() {
    if (!(await this.btnAdd.isExisting())) await this.toggle();
    if (!(await this.btnAdd.isExisting())) await this.toggle();
    return super.clickAdd();
  }

  public override async expandList() {
    if (!(await this.list.isExisting())) await this.toggle();
    if (!(await this.list.isExisting())) await this.toggle();
    return this.list;
  }
}
