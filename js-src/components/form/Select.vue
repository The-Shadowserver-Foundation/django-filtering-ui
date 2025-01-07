<script setup>
import { defineModel, defineProps } from "vue";

// interface Option {
//   value: string;
//   label: string;
//   description?: string;
//   disabled: boolean = false;
// }

const model = defineModel({ required: true });
const { options, includeBlank } = defineProps({
  options: {},
  includeBlank: { default: true },
});
</script>

<template>
  <select v-model="model">
    <option v-if="includeBlank" value=""></option>
    <option
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
      :disabled="opt.disabled"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

<style></style>
