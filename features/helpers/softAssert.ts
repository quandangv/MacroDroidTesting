import { DefineStepPattern } from "@cucumber/cucumber/lib/support_code_library_builder/types";
import { Then, IWorld } from "@wdio/cucumber-framework";
// WebdriverIO's expect throws JestAssertionError, so we'll also use it as our error class
import { JestAssertionError } from "expect";
import { Matchers } from "expect-webdriverio";
import arity from "util-arity";

/**Merges a list of errors to a single error object and throws it */
function flush(errors: JestAssertionError[]) {
  if (errors.length > 0) {
    let message = `${errors.length} error(s)`;
    for (const [i, error] of errors.entries()) {
      message += `\n\n${i + 1}/${errors.length} ${error}`;
    }
    throw new JestAssertionError(message);
  }
}

/**Provides soft assertion capabilities */
interface SoftAssertion {
  /**
   * Run the function passed to it inside a try...catch block and record any assertion error without throwing. It re-throws any error that is not JestAssertionError
   * @param fn The function containing assertion code
   * @returns true if no assertion error was caught
   */
  wrap(fn: () => any): Promise<boolean>;

  /**Returns an object with the same method set as WebDriverIO's expect, but every toXXX method has been wrapped using this.wrap method */
  expect<T = unknown>(actual: T): Matchers<void | Promise<void>, T>;
}

/**
 * Similar to Cucumber's Then function, but the code function is called with a `soft` argument that provides soft assertion capabilities. All soft assertion errors will be thrown as a single error at then end of the step
 * @param pattern The pattern to pass to the Then method
 * @param code A function that accepts a SoftAssertion object as its first argument
 */
export default function TryThen<A extends any[], R>(
  pattern: DefineStepPattern,
  code: (this: any, soft: SoftAssertion, ...args: A) => R
) {
  Then(
    pattern,
    arity(code.length - 1, async function (this: IWorld, ...args: A) {
      const errorTracker: JestAssertionError[] = [];
      async function wrap(fn: () => any) {
        try {
          await fn();
          return true;
        } catch (e: unknown) {
          if (e instanceof JestAssertionError) errorTracker.push(e);
          else throw e;
          return false;
        }
      }
      function softExpect<T = unknown>(actual: T) {
        const result: any = expect(actual);
        result.toBeCalled;
        for (const key in result) {
          if (!Object.hasOwn(result, key)) continue;
          const value = result[key];
          if (typeof key == "string" && key.startsWith("to")) {
            result[key] = (...args: any[]) => wrap(() => value(...args));
            const notValue = result.not[key];
            result.not[key] = (...args: any[]) => wrap(() => notValue(...args));
          }
        }
        return result as Matchers<void | Promise<void>, T>;
      }
      await code.apply(this, [{ wrap, expect: softExpect }, ...args]);
      flush(errorTracker);
    })
  );
}
