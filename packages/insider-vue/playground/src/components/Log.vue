<script setup lang="ts">
import { useCommunicator } from '@passerelle/insider-vue'
import { ref } from 'vue'

interface Log {
  time: string
  event: string
  key?: string
  value: object
}

const logs = ref<Log[]>([])

function addLog(log: Omit<Log, 'time'>) {
  logs.value = [
    ...logs.value,
    {
      time: new Date().toLocaleTimeString(),
      ...log
    }
  ]
}

useCommunicator({
  onNavigate(value) {
    addLog({
      event: 'navigate',
      value
    })
  },
  onHrefNavigate(value) {
    addLog({
      event: 'href',
      value
    })
  },
  onUpdateLayout(value) {
    addLog({
      event: 'layout',
      value
    })
  }
})
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Time</th>
        <th>Event</th>
        <th>Key</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="log in logs"
        :key="log.time">
        <td>{{ log.time }}</td>
        <td>{{ log.event }}</td>
        <td>{{ log.key }}</td>
        <td>{{ JSON.stringify(log.value) }}</td>
      </tr>
    </tbody>
  </table>
</template>
