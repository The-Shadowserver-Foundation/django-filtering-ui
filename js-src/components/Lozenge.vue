<script setup>
import { computed } from "vue";
import { flattenChoicesReducer } from "@/utils/choices";

const { schema, condition, disableRemove } = defineProps([
  "schema",
  "condition",
  "disableRemove",
]);

const schemaField = computed(() => {
  return schema.filter((x) => x.name == condition.identifier)[0];
});
const relativeLookupInfo = computed(() => {
  return schemaField.value.lookups[condition.relative];
});
const relativeLabel = computed(() => {
  return relativeLookupInfo.value.label;
});

const getChoiceLabel = () => {
  // Find the choice in the array of choices.
  // Each choice is an array of [value, label].
  return (
    relativeLookupInfo.value.choices
      .reduce(flattenChoicesReducer, [])
      // FIXME Match on exact value type rather than string representation.
      .filter(([v]) => v.toString() === condition.value.toString())[0][1]
  );
};
</script>

<template>
  <div class="df-ui-lozenge">
    <span class="df-ui-lozenge-identifier" :data-value="condition.identifier">{{
      schemaField.label
    }}</span>
    <span class="df-ui-lozenge-relative" :data-value="condition.relative">{{
      relativeLabel
    }}</span>
    <span class="df-ui-lozenge-value" :data-value="condition.value">
      <template
        v-if="schemaField.lookups[condition.relative].type == 'choice'"
        >{{ getChoiceLabel() }}</template
      >
      <template
        v-else-if="schemaField.lookups[condition.relative].type == 'date-range'"
      >
        {{ new Date(condition.value[0]).toLocaleDateString() }} &#45;
        {{ new Date(condition.value[1]).toLocaleDateString() }}
      </template>
      <template v-else>{{ condition.value }}</template>
    </span>
    <a
      v-if="!disableRemove"
      class="df-ui-lozenge-clear"
      href="#"
      title="clear"
      @click="$emit('remove')"
    ></a>
  </div>
</template>

<style scoped>
.df-ui-lozenge {
  --lozenge-color: #000;
  --lozenge-border-color: var(--django-filtering-ui-tertiary);
  --lozenge-background-color: var(--django-filtering-ui-tertiary-shaded);
  display: flex;
  align-items: center;
  gap: 0.25em;
  padding: 2px 0.75em;
  border-radius: 10px;
  color: var(--lozenge-color);
  border: 1px solid var(--lozenge-border-color);
  background-color: var(--lozenge-background-color);
}
.df-ui-lozenge-value {
  font-weight: bold;
}
.df-ui-lozenge-clear {
  text-decoration: none;
  color: var(--lozenge-border-color);
}
.df-ui-lozenge-clear::before {
  content: "|";
  margin-left: 0.25em;
}
.df-ui-lozenge-clear::after {
  content: "\00D7";
  margin-left: 0.5em;
}
</style>
