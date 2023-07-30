import { inject, watch } from 'vue'
import type { LayoutMetrix } from '@passerelle/core';

import { LAYOUT_KEY } from "./communicator";

export function onUpdateLayout(callback: (value: LayoutMetrix) => void | Promise<void>): void {
  const layout = inject(LAYOUT_KEY)
  if (!layout) return

  watch(layout, callback)
}
