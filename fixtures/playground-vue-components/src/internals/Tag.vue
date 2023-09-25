<template>
  <button :class="{ selected }">
    {{ label }}
  </button>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Tags',
  props: {
    label: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    },
    tag: {
      /**
       * @type {import('vue').PropType<import('./type').Tag>}
       */
      type: String,
      required: true
    }
  }
})
</script>

<style scoped>
button {
  display: inline-block;
  padding: 0 1rem;
  background: none;
  cursor: pointer;
  outline: inherit;
  font: inherit;
  outline: inherit;

  border: none;
  border-left: 1px solid var(--color-border);
}

button:first-of-type {
  border: 0;
}

button.selected {
  color: var(--color-text);
}

button:hover {
  background-color: hsla(160, 100%, 37%, 0.2);
}
button.selected:hover {
  background-color: transparent;
}
</style>
