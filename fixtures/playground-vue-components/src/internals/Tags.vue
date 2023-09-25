<template>
  <nav>
    <template
      v-for="t in tags"
      :key="t">
      <Tag
        :tag="t"
        :label="label(t)"
        :selected="t === selected"
        @click="select(t)" />
    </template>
  </nav>
</template>

<script>
import { defineComponent } from 'vue'
import Tag from './Tag.vue'

const labelSet = {
  'transition-log': 'Transition Log',
  'layout-viewer': 'Layout Viewer',
  'data-sender': 'Data Sender',
  'data-received-log': 'Data Received Log'
}

export default defineComponent({
  name: 'Tags',
  components: {
    Tag
  },
  props: {
    /**
     * vue3 との互換性のために、v-model ではなく select イベントを使う
     */
    selected: {
      /**
       * @type {import('vue').PropType<import('./type').Tag>}
       */
      type: String,
      required: true
    },
    tags: {
      /**
       * @type {import('vue').PropType<import('./type').Tag[]>)}
       */
      type: Array,
      required: true
    }
  },
  emits: ['select'],
  methods: {
    /**
     * @param {import('./type').Tag} tag
     * @returns {string}
     */
    label(tag) {
      return labelSet[tag]
    },

    /**
     * @param {import('./type').Tag} tag}
     */
    select(tag) {
      this.$emit('select', tag)
    }
  }
})
</script>

<style scoped>
nav {
  width: 100%;
  font-size: 11px;
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 1rem;
}
</style>
