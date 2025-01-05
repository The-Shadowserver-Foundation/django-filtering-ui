<script setup>
import { computed, defineProps } from "vue";
import Select from "@/components/form/Select.vue";
import { lookupToLabel } from "@/utils/lookupMapping";

const { schema, condition } = defineProps(["schema", "condition"]);

let options = computed(() => {
  const schemaField = schema.filter((x) => x.name == condition.identifier)[0];
  if (schemaField) {
    return schemaField.lookups.map((x) => {
      return { value: x, label: lookupToLabel(x) };
    });
  } else {
    return [];
  }
});
</script>

<template>
  <Select
    :options="options"
    :selected="condition.relative"
    :includeBlank="false"
    :disabled="!condition.identifier"
    @change="condition.relative = $event.target.value"
  />
</template>
