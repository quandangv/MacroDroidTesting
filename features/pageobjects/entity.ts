import { $byId } from "../helpers/selectors";
import { EntityList } from "./entityList";
import Page from "./page";

export default class EntityPage extends Page {
  /**The input to enter the name of the entity */
  public get nameInput() {
    return $byId("name");
  }

  /**The input to enter the description of the entity */
  protected get descriptionInput() {
    return $byId("description");
  }

  /**Button to show or hide the description input */
  public get btnToggleDescription() {
    return $byId("menu_toggle_description");
  }

  /**Button to save the entity */
  protected get btnSave() {
    return $byId("acceptButton");
  }

  /**Set the description for the entity, automatically expand the input if collapsed */
  public async setDescription(value: string) {
    if (!(await this.descriptionInput.isExisting()))
      await this.btnToggleDescription.click();
    await this.descriptionInput.setValue(value);
  }

  /**
   * Get the value of a property of this object, and verify that it is an EntityList before returning
   * @param name The name of the property to retrieve
   * @returns The value of the named property, if that value is instance of EntityList
   */
  public componentList(name: string): EntityList {
    const prop = this[name as keyof typeof this];
    if (prop instanceof EntityList) return prop;
    throw Error(`${name} is not a component list in ${this.constructor.name}`);
  }

  /**Click the save button and skip any ad that appear */
  public async save() {
    await this.btnSave.click();
    await this.skipAds();
  }
}
