import { $byId } from "../helpers/selectors";
import { EntityList } from "./entityList.page";
import Page from "./page";

export default class EntityPage extends Page {
  public get nameInput() {
    return $byId("name");
  }

  public get descriptionInput() {
    return $byId("description");
  }

  public get btnToggleDescription() {
    return $byId("menu_toggle_description");
  }

  protected get btnSave() {
    return $byId("acceptButton");
  }

  public async setDescription(value: string) {
    if (!(await this.descriptionInput.isExisting()))
      await this.btnToggleDescription.click();
    await this.descriptionInput.setValue(value);
  }

  public componentList(name: string): EntityList {
    const prop = this[name as keyof typeof this];
    if (prop instanceof EntityList) return prop;
    throw Error(`${name} is not a component list in ${this.constructor.name}`);
  }

  public async save() {
    await this.btnSave.click();
    await this.skipAds();
  }
}
