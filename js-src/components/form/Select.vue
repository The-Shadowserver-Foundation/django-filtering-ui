<script setup>
import { defineProps } from "vue";

// interface Option {
//   value: string;
//   label: string;
//   description?: string;
//   disabled: boolean = false;
// }

const { options, selected, includeBlank } = defineProps({
  options: {},
  selected: "",
  includeBlank: { default: true },
});
</script>

<template>
  <select>
    <option v-if="includeBlank" value=""></option>
    <option
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
      :selected="opt.value === selected"
      :disabled="opt.disabled && opt.value !== selected"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

<style></style>
