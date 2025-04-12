import { DefineStepPattern } from "@cucumber/cucumber/lib/support_code_library_builder/types"
import { Then, world } from "@wdio/cucumber-framework"
import { JestAssertionError } from "expect"
import arity from "util-arity"

function flush(errors: any[]) {
  if (errors.length > 0) {
    if (errors.length == 1) throw errors[0]
    let message = `${errors.length} errors`
    for (const [i, error] of errors.entries()) {
      message += `\n\n${i + 1}/${errors.length} ${error}`
    }
    console.log(errors[0].constructor.name)
    throw new JestAssertionError(message)
  }
}

export async function soft(fn: () => Promise<void> | void): Promise<boolean> {
  try {
    await fn()
    return true
  } catch (e: any) {
    world.parameters.errorTracker.push(e)
    return false
  }
}

export function TryThen<A extends any[], R>(
  pattern: DefineStepPattern,
  code: (this: any, ...args: A) => R
) {
  Then(
    pattern,
    arity(code.length, async (...args: A) => {
      world.parameters.errorTracker = []
      await code.apply(world, args)
      flush(world.parameters.errorTracker)
    })
  )
}
