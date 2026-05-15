<script setup>
defineProps(["label", "dataValue"]);
</script>

<template>
  <span class="df-ui-lozenge-relative" :data-value="dataValue">{{ label }}</span>
</template>
