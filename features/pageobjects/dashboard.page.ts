import { $ } from "@wdio/globals";
import { $byId, $byText } from "../helpers/selectors.js";
import Page from "./page.js";

/**Represents the home tab on the app */
class DashboardPage extends Page {
  /**Button to skip the tutorial */
  public get btnSkip() {
    return $byId("button_skip");
  }

  /**A button on the ad to upgrade to the pro version */
  public get btnUpgradeNow() {
    return $byId("upgradeNowButton");
  }

  /**The button to skip the pro version ad */
  public get btnNavigateUp() {
    return $("~Navigate up");
  }

  /**Button to discard the changes made to the current entity */
  public get btnDiscard() {
    return $byText("button", "DISCARD");
  }

  public get homeTab() {
    return $byId("navigation_home");
  }

  public get macrosTab() {
    return $byId("navigation_macro_list");
  }

  public get templatesTab() {
    return $byId("navigation_templates");
  }

  public get settingsTab() {
    return $byId("navigation_settings");
  }

  /**Click on a tile on the home tab */
  public async clickTile(name: string) {
    await $byId("title", name).click();
  }

  /**Use driver.back() to go back to the home tab. Will discard any changes */
  public async goToDashboard() {
    if (await this.btnSkip.isExisting()) await this.btnSkip.click();
    for (let i = 0; i < 10; i++) {
      driver.pause(1000);
      await this.skipAds();
      if (await this.homeTab.isExisting()) return;
      if (await this.btnDiscard.isExisting()) await this.btnDiscard.click();
      else await driver.back();
    }
    throw Error("Can't reach the home page");
  }
}
export default new DashboardPage();
