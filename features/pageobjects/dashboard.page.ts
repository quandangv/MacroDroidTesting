import { $ } from "@wdio/globals"
import { $macrodroid, $text, Page } from "./page.js"

/**
 * sub page containing specific selectors and methods for a specific page
 */
class DashboardPage extends Page {
  public get btnSkip() {
    return $macrodroid("button_skip")
  }

  public get btnUpgradeNow() {
    return $macrodroid("upgradeNowButton")
  }

  public get btnNavigateUp() {
    return $("~Navigate up")
  }

  public get btnDiscard() {
    return $text("android.widget.Button", "DISCARD")
  }

  public get homeTab() {
    return $macrodroid("navigation_home")
  }

  public get macrosTab() {
    return $macrodroid("navigation_macros")
  }

  public get templatesTab() {
    return $macrodroid("navigation_templates")
  }

  public get settingsTab() {
    return $macrodroid("navigation_settings")
  }

  public async clickTile(name: string) {
    await $macrodroid("title", name).click()
  }

  public async goToDashboard() {
    // Click the skip button on the intro page
    if (await this.btnSkip.isExisting()) await this.btnSkip.click()
    while (true) {
      driver.pause(1000)
      if (await this.homeTab.isExisting()) break
      if (await this.btnDiscard.isExisting()) await this.btnDiscard.click()
      else await driver.back()
    }
  }
}

export default new DashboardPage()
