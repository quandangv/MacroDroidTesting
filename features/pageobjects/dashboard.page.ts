import { $ } from "@wdio/globals";
import { $byId, $byText } from "../helpers/selectors.js";
import Page from "./page.js";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class DashboardPage extends Page {
  public get btnSkip() {
    return $byId("button_skip");
  }

  public get btnUpgradeNow() {
    return $byId("upgradeNowButton");
  }

  public get btnNavigateUp() {
    return $("~Navigate up");
  }

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

  public async clickTile(name: string) {
    await $byId("title", name).click();
  }

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
