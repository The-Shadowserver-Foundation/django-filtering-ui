<script setup>
defineProps(["label", "dataValue"]);
</script>

<template>
  <span class="df-ui-lozenge-identifier" :data-value="dataValue">{{ label }}</span>
</template>
