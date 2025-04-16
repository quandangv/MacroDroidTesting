import { DefineStepPattern } from "@cucumber/cucumber/lib/support_code_library_builder/types";
import { Then, IWorld } from "@wdio/cucumber-framework";
// WebdriverIO's expect throws JestAssertionError, so we'll also use it as our error class
import { JestAssertionError } from "expect";
import { Matchers } from "expect-webdriverio";
import arity from "util-arity";

function flush(errors: [JestAssertionError, string | undefined][]) {
  if (errors.length > 0) {
    let message = `${errors.length} errors`;
    for (const [i, [error, submessage]] of errors.entries()) {
      message += `\n\n${i + 1}/${errors.length} ${submessage ?? ""} ${error}`;
    }
    throw new JestAssertionError(message);
  }
}

export default function TryThen<A extends any[], R>(
  pattern: DefineStepPattern,
  code: (
    this: any,
    soft: {
      wrap: (fn: () => any, message?: string) => Promise<boolean>;
      expect: <T = unknown>(actual: T) => Matchers<void | Promise<void>, T>;
    },
    ...args: A
  ) => R
) {
  Then(
    pattern,
    arity(code.length - 1, async function (this: IWorld, ...args: A) {
      const errorTracker: [JestAssertionError, string | undefined][] = [];
      async function wrap(fn: () => any, message?: string) {
        try {
          await fn();
          return true;
        } catch (e: unknown) {
          if (e instanceof JestAssertionError) errorTracker.push([e, message]);
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

expect("abc").not;
