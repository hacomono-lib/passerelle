import { HrefMessage, LayoutMetrix, NavigateMessage } from "@passerelle/core";


export function onBeforeNavigate(callback: (value: NavigateMessage) => void) {

}

export function onBeforeHrefNavigate(callback: (value: HrefMessage) => boolean) {

}

export function onUpdateLayout(callback: (value: LayoutMetrix) => void) {

}
