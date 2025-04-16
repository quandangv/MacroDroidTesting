// Helpers for step definitions
import { IWorld, world } from "@wdio/cucumber-framework";
import EntityPage from "../pageobjects/entity.js";
import { BaseList } from "../pageobjects/entityList.js";
import Page from "../pageobjects/page.js";

function getPageAsserter<T>(
  type: { new (...args: any[]): T },
  descriptor: string
): () => T {
  return () => {
    const page = world.parameters.page;
    if (page instanceof type) return page;
    throw Error(`Current page (${page}) is not ${descriptor}`);
  };
}

/**Returns the current page if it is instance of EntityPage. This can be used when the current page is MacroPage or ActionBlockPage. If the current page is not an EntityPage, it throws an error*/
export const getEntityPage = getPageAsserter(EntityPage, "an entity page");
/**Returns the current page if it is instance of BaseList. This can be used when the current page is MacroListTab, ActionBlockListPage, or VariableListPage. If the current page is not an EntityPage, it throws an error*/
export const getListPage = getPageAsserter(BaseList, "a list page");

export type World = IWorld<{
  /**The current page object represent the state of the app. This parameter is tracked by previous steps in the scenario */
  page: Page | undefined;
}>;
