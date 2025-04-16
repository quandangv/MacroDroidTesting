// This file contains all platform-specific code so that it will be easier to adapt other parts to work on other platforms
import { $ } from "@wdio/globals";

/**Platform-specfic element class names */
const elementTypes = {
  button: "android.widget.Button",
  "radio button": "android.widget.CheckedTextView",
  "text box": "android.widget.EditText",
  text: "android.widget.TextView",
};

/**Platform-agnostic element types */
export type ElementType = keyof typeof elementTypes;
/**Generate xpath to match an element by type, id, or text */
export function xpath(
  type?: ElementType,
  id?: string,
  text?: string,
  caseSensitive = true
) {
  const base = `${type != undefined ? elementTypes[type] : "*"}`;
  if (text == undefined) {
    if (id == undefined) return base;
    return `${base}[@resource-id="com.arlosoft.macrodroid:id/${id}"]`;
  } else {
    const textCondition = caseSensitive
      ? `@text="${text}"`
      : `lower-case(@text)="${text.toLowerCase()}"`;
    if (id == undefined) return `${base}[${textCondition}]`;
    return `${base}[@resource-id="com.arlosoft.macrodroid:id/${id}" and ${textCondition}]`;
  }
}

export function $byId(id: string, text?: string) {
  return $("//" + xpath(undefined, id, text));
}

export function $byType(type: ElementType) {
  return $(elementTypes[type]);
}

export function $byText(type: ElementType, text: string, caseSensitive = true) {
  return $("//" + xpath(type, undefined, text, caseSensitive));
}
