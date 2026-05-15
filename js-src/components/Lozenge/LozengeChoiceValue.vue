<script setup>
import { computed } from "vue";
import { flattenChoicesReducer } from "@/utils/choices";

const props = defineProps(["relativeLookupInfo", "value"]);

const label = computed(() =>
  props.relativeLookupInfo.choices
    .reduce(flattenChoicesReducer, [])
    // FIXME Match on exact value type rather than string representation.
    .filter(([v]) => v.toString() === props.value.toString())[0][1]
);
</script>

<template>{{ label }}</template>
