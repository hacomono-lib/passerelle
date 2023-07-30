<script setup lang="ts">

export interface Log {
  time: string
  event: string
  key: string
  value: any
}

export interface Props {
  logs: Log[]
}

defineProps<Props>()
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
