<script setup>
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
    <template v-for="opt in options">
      <optgroup v-if="Array.isArray(opt.value)" :label="opt.label">
        <option
          v-for="subOpt in opt.value"
          :key="subOpt.value"
          :value="subOpt.value"
          :disabled="subOpt.disabled"
        >
          {{ subOpt.label }}
        </option>
      </optgroup>
      <option
        v-else
        :key="opt.value"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </option>
    </template>
  </select>
</template>

<style></style>
