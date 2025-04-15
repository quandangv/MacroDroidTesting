import { $byId, $byType } from "../helpers/selectors";

export default class Page {
  public get appRoot() {
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
