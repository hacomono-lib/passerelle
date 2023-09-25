<template>
  <section>
    <Tags
      :tags="tags"
      :selected="selectedTag"
      @select="selectTag" />
    <component :is="mainContent" />
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import Tags from './Tags.vue'
import TransitionLog from './TransitionLog.vue'
import LayoutView from './LayoutView.vue'
import DataSender from './DataSender.vue'
import DataReceivedLog from './DataReceivedLog.vue'
import { tagSet } from './type'

const importMap = {
  'transition-log': 'TransitionLog',
  'layout-viewer': 'LayoutView',
  'data-sender': 'DataSender',
  'data-received-log': 'DataReceivedLog'
}

export default defineComponent({
  name: 'Playground',
  components: {
    Tags,
    TransitionLog,
    LayoutView,
    DataSender,
    DataReceivedLog
  },
  props: {
    mode: {
      /**
       * @type {import('vue').PropType<import('./type').Mode>}
       */
      type: String,
      required: true,
      validator: (value) => ['insider', 'enclosure'].includes(value)
    }
  },
  data() {
    return {
      /**
       * @type {import('./type').Tag}
       */
      selectedTag: 'transition-log'
    }
  },
  computed: {
    /**
     * @returns {readonly import('./type').Tag[]}
     */
    tags() {
      return tagSet[this.mode]
    },
    /**
     * @returns {string}
     */
    mainContent() {
      return importMap[this.selectedTag]
    }
  },
  methods: {
    /**
     *
     * @param {import('./type').Tag} tag
     */
    selectTag(tag) {
      console.log(tag)
      this.selectedTag = tag
    }
  }
})
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
</style>
