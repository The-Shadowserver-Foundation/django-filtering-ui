<script setup>
import { computed, watch } from "vue";
import Button from "@/components/form/Button.vue";
import Select from "@/components/form/Select.vue";

const { condition, schema } = defineProps(["condition", "schema"]);

const schemaField = computed(() => schema.filters[condition.identifier]);

// --- Identifier ---
const identifierOptions = computed(() => {
  return Object.entries(schema.filters).map(([name, value]) => {
    return {
      value: name,
      label: value.label,
      description: value.description,
      disabled: value.disabled || false,
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
      (schemaField.value && !(condition.relative in schemaField.value.lookups))
    ) {
      // Apply a default value to the relative property
      condition.relative = schemaField.value.default_lookup;
      // Reset the value
      condition.value = undefined;
    }
  },
);
watch(
  () => condition.relative,
  (relative) => {
    // FIXME This type of initialization needs to happen in the Condition.
    if (schemaField.value.lookups[relative].type == "date-range") {
      if (typeof condition.value != "array") {
        condition.value = [undefined, undefined];
      }
    }
  },
);

// --- Relative ---
const relativeOptions = computed(() => {
  if (schemaField.value) {
    return Object.entries(schemaField.value.lookups).map(([k, v]) => ({
      value: k,
      label: v.label,
    }));
  } else {
    return [];
  }
});

// --- Value ---
const valueOptions = computed(() => {
  const info = { ...schemaField.value.lookups[condition.relative] };
  const structureChoiceDetails = ([value, label]) => ({ value, label });
  if (info.type === "choice") {
    info.choices = info.choices.map(([value, label]) => {
      if (Array.isArray(label)) {
        // Options group
        // Invert the lable and value to conform to Django's preferred choices data structure.
        return { label: value, value: label.map(structureChoiceDetails) };
      }
      return structureChoiceDetails([value, label]);
    });
  }
  return info;
});
</script>

<template>
  <div class="df-ui-row df-ui-condition">
    <div class="df-ui-col">
      <!-- Identifier -->
      <Select :options="identifierOptions" v-model="condition.identifier" />
    </div>

    <div class="df-ui-col">
      <!-- Relative -->
      <Select
        :options="relativeOptions"
        :includeBlank="false"
        :disabled="!condition.identifier"
        v-model="condition.relative"
      />
    </div>

    <div class="df-ui-col">
      <!-- Value -->
      <span v-if="!condition.identifier"
        ><!-- placeholder --><input type="text" disabled
      /></span>

      <span v-else-if="valueOptions.type === 'choice'">
        <Select
          :options="valueOptions.choices"
          :includeBlank="false"
          :disabled="!condition.identifier"
          v-model="condition.value"
        />
      </span>

      <span v-else-if="valueOptions.type === 'toggle'"
        ><input
          type="radio"
          :id="`true-value-${condition.id}`"
          :value="valueOptions.true_choice[0]"
          :name="`value-${condition.id}`"
          v-model="condition.value"
        /><label :for="`true-value-${condition.id}`">{{
          valueOptions.true_choice[1]
        }}</label>
        <input
          type="radio"
          :id="`false-value-${condition.id}`"
          :value="valueOptions.false_choice[0]"
          :name="`value-${condition.id}`"
          v-model="condition.value"
        /><label :for="`false-value-${condition.id}`">{{
          valueOptions.false_choice[1]
        }}</label>
      </span>

      <span v-else-if="valueOptions.type === 'date-range'">
        <input type="date" v-model="condition.value[0]" />
        &#45;
        <input type="date" v-model="condition.value[1]" />
      </span>

      <input type="text" v-else v-model="condition.value" />
    </div>

    <div class="df-ui-col df-ui-row-actions">
      <Button
        id="remove-condition"
        class="btn-tiny"
        @click="$emit('remove')"
        >&#xFF0D;</Button>
      <Button
        id="add-condition"
        class="btn-tiny"
        @click="$emit('add')"
        >&#xFF0B;</Button>
    </div>
  </div>
</template>
