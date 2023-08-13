<script setup lang="ts">
import { DataTable } from '@chronicstone/vue-sweettools';
</script>

<template>
  <div>
    <DataTable v-bind="organizationTableSchema()">Organizations</DataTable>
  </div>
</template>
