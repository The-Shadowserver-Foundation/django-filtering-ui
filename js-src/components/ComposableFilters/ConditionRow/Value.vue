<script setup>
import { computed, defineProps } from "vue";

const { schema, condition } = defineProps(["schema", "condition"]);
const schemaField = computed(() => {
  return schema.filter((x) => x.name == condition.identifier)[0];
});
</script>

<template>
  <input
    v-if="schemaField === undefined || schemaField.field_type === 'string'"
    :disabled="!condition.identifier"
    v-model="condition.value"
  />
  <span v-if="schemaField && schemaField.field_type === 'boolean'"
    ><input
      type="radio"
      id="true"
      :value="true"
      :name="condition.id"
      v-model="condition.value"
    /><label for="true">True</label>
    <input
      type="radio"
      id="false"
      :value="false"
      :name="condition.id"
      v-model="condition.value"
    /><label for="false">False</label>
  </span>
</template>
