<script setup>
import { computed, defineProps } from "vue";
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
const onChangeIdentifier = (event) => {
  condition.identifier = event.target.value;
  if (
    !condition.relative ||
    (schemaField.value &&
      !schemaField.value.lookups.includes(condition.relative))
  ) {
    // Apply a default value to the relative property
    condition.relative = schemaField.value.lookups[0];
  }
};

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
      <Select
        :options="identifierOptions"
        :selected="condition.identifier"
        @change="onChangeIdentifier"
      />
    </div>
    <div class="col">
      <Select
        :options="relativeOptions"
        :selected="condition.relative"
        :includeBlank="false"
        :disabled="!condition.identifier"
        @change="condition.relative = $event.target.value"
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
