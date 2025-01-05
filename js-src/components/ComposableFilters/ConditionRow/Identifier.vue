<script setup>
import { computed, defineProps } from "vue";
import Select from "@/components/form/Select.vue";

const { schema, condition } = defineProps(["schema", "condition"]);
// const options = Object.fromEntries(
//   Object.entries(schemaOptions).filter(
//     ([key, value]) => value.type === "field",
//   ),
// );
const options = computed(() => {
  return schema.map((x) => {
    return {
      value: x.name,
      label: x.label,
      description: x.description,
      disabled: x.disabled || false,
    };
  });
});

const onChange = (event) => {
  condition.identifier = event.target.value;

  // Possibly the wrong scope to make this change...
  const schemaField = schema.filter((x) => {
    return x.name === condition.identifier;
  })[0];
  if (
    !condition.relative ||
    !schemaField.lookups.includes(condition.relative)
  ) {
    // Apply a default value to the relative property
    condition.relative = schemaField.lookups[0];
  }
};
</script>

<template>
  <Select
    :options="options"
    :selected="condition.identifier"
    @change="onChange"
  />
</template>

<style></style>
