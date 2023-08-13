<script setup lang="ts">
import { DataTable } from '@chronicstone/vue-sweettools';
</script>

<template>
  <div>
    <DataTable v-bind="queueJobsTableSchema()">Queue jobs</DataTable>
  </div>
</template>
