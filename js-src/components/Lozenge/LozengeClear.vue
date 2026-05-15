<script setup>
defineEmits(["remove"]);
</script>

<template>
  <a
    class="df-ui-lozenge-clear"
    href="#"
    title="clear"
    @click="$emit('remove')"
  ></a>
</template>

<style scoped>
.df-ui-lozenge-clear {
  text-decoration: none;
  color: var(--lozenge-border-color);
}
.df-ui-lozenge-clear::before {
  content: "|";
  margin-left: 0.25em;
}
.df-ui-lozenge-clear::after {
  content: "\00D7";
  margin-left: 0.5em;
}
</style>
