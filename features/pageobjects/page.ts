import { $byId, $byType } from "../helpers/selectors";

/**Base class for all page objects */
export default class Page {
  private get appRoot() {
    return $byId("action_bar_root");
  }

  public async skipAds() {
    while (!(await this.appRoot.isExisting())) {
      driver.pause(1000);
      const skipButton = $byType("button");
      if (await skipButton.isExisting()) await skipButton.click();
    }
  }
}
