import { $byId, xpath } from "../helpers/selectors.js";
import Page from "./page.js";

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class BaseList extends Page {
  addButtonId: string;
  listId: string;
  addPage: Page | null;

  constructor(addButtonId: string, listId: string, addPage: Page | null) {
    super();
    this.addButtonId = addButtonId;
    this.listId = listId;
    this.addPage = addPage;
  }

  protected get btnAdd() {
    return $byId(this.addButtonId);
  }

  protected get list() {
    return $byId(this.listId);
  }

  protected get nameId() {
    return "macro_edit_entry_name";
  }

  public async clickAdd() {
    await this.btnAdd.click();
    return this.addPage;
  }

  /**
   * Get the list element of this component.
   * Child classes extend this method to expand the list from the collapsed state before retrieving, hence the async keyword.
   * @returns The list element containing component items
   */
  public async expandList() {
    return this.list;
  }

  /**
   * Get the item element with a specific name from the list.
   * Child classes extend this method to expand the list from the collapsed state before retrieving, hence the async keyword.
   * @param name The text to search the item with
   * @returns The item element with the specified name
   */
  public async retrieveItem(name: string) {
    return (await this.expandList()).$(
      `//${xpath("text", this.nameId, name)}/parent::*`
    );
  }

  public async retrieveData(name: string): Promise<Record<string, string>> {
    await this.retrieveItem(name);
    return {
      NAME: name,
    };
  }
}
export class EntityList extends BaseList {
  protected get descriptionId() {
    return "macro_edit_entry_detail";
  }

  public async retrieveData(name: string): Promise<Record<string, string>> {
    const description = (await this.retrieveItem(name)).$(
      "//" + xpath("text", this.descriptionId)
    );
    return {
      NAME: name,
      DETAILS: (await description.isExisting())
        ? await description.getText()
        : "",
    };
  }
}

export class CollapsibleList extends EntityList {
  toggleId: string;

  constructor(
    addButtonId: string,
    listId: string,
    addPage: Page | null,
    toggleId: string
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
