<script setup>
defineProps(["value"]);
</script>

<template>
  {{ new Date(value[0]).toLocaleDateString() }} &#45;
  {{ new Date(value[1]).toLocaleDateString() }}
</template>
