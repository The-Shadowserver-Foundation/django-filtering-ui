<script setup>
import { computed, defineProps, watch } from "vue";
import Button from "@/components/form/Button.vue";
import Select from "@/components/form/Select.vue";
import { lookupToLabel } from "@/utils/lookupMapping";

const { condition, schema } = defineProps(["condition", "schema"]);

const schemaField = computed(() => {
  return schema.filter((x) => x.name == condition.identifier)[0];
});

// --- Identifier ---
const identifierOptions = computed(() => {
  return schema.map((x) => {
    return {
      value: x.name,
      label: x.label,
      description: x.description,
      disabled: x.disabled || false,
    };
  });
});
watch(
  () => condition.identifier,
  (identifier) => {
    // Apply default relative value...
    // when one isn't present
    // or when previous relative isn't available
    if (
      !condition.relative ||
      (schemaField.value &&
        !schemaField.value.lookups.includes(condition.relative))
    ) {
      // Apply a default value to the relative property
      condition.relative = schemaField.value.lookups[0];
      // Reset the value
      condition.value = null;
    }
  },
);

// --- Relative ---
let relativeOptions = computed(() => {
  if (schemaField.value) {
    return schemaField.value.lookups.map((x) => {
      return { value: x, label: lookupToLabel(x) };
    });
  } else {
    return [];
  }
});
</script>

<template>
  <div class="row">
    <div class="col">
      <Select :options="identifierOptions" v-model="condition.identifier" />
    </div>
    <div class="col">
      <Select
        :options="relativeOptions"
        :includeBlank="false"
        :disabled="!condition.identifier"
        v-model="condition.relative"
      />
    </div>
    <div class="col">
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
    </div>
    <div class="col actions">
      <Button class="btn-small btn-delete" @click="$emit('remove')">-</Button>
    </div>
  </div>
</template>
