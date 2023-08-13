<script setup lang="ts">
import { DataTable } from '@chronicstone/vue-sweettools';
</script>

<template>
  <div>
    <DataTable v-bind="invitationsTableSchema()"> Invitations </DataTable>
  </div>
</template>
