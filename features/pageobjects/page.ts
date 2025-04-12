import { $ } from "@wdio/globals"

export class Page {}

export function $macrodroid(id: string, text?: string) {
  if (text == undefined) return $("id=com.arlosoft.macrodroid:id/" + id)
  return $(
    `//*[@resource-id="com.arlosoft.macrodroid:id/${id}" and @text="${text}"]`
  )
}

export function $text(type: string, text: string) {
  return $(`//${type}[@text="${text}"]`)
}
