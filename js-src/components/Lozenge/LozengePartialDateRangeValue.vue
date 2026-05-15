<script setup>
defineProps(["value"]);
</script>

<template>
  <template v-if="value[0] && value[1]">
    {{ new Date(value[0]).toLocaleDateString() }} &#45;
    {{ new Date(value[1]).toLocaleDateString() }}
  </template>
  <template v-else-if="value[0]">
    {{ new Date(value[0]).toLocaleDateString() }}
  </template>
  <template v-else>
    {{ new Date(value[1]).toLocaleDateString() }}
  </template>
</template>
