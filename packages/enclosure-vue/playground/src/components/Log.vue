<script setup lang="ts">
import { ref } from 'vue'

interface Log {
  id: number
  time: string
  event: string
  key: string
  value: string
}

const logs = ref<Log[]>([])

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
      <tr v-for="log in logs" :key="log.id">
        <td>{{ log.time }}</td>
        <td>{{ log.event }}</td>
        <td>{{ log.key }}</td>
        <td>{{ log.value }}</td>
      </tr>
    </tbody>
  </table>
</template>
