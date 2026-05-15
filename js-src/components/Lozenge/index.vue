<script setup>
import { computed } from "vue";
import LozengeIdentifier from "./LozengeIdentifier.vue";
import LozengeRelative from "./LozengeRelative.vue";
import LozengeValue from "./LozengeValue.vue";
import LozengeClear from "./LozengeClear.vue";

const { schema, condition, disableRemove } = defineProps([
  "schema",
  "condition",
  "disableRemove",
]);

defineEmits(["remove"]);

const schemaField = computed(() => {
  return schema.filter((x) => x.name == condition.identifier)[0];
});
const relativeLookupInfo = computed(() => {
  return schemaField.value.lookups[condition.relative];
});
</script>

<template>
  <div class="df-ui-lozenge">
    <LozengeIdentifier
      :label="schemaField.label"
      :dataValue="condition.identifier"
    />
    <LozengeRelative
      :label="relativeLookupInfo.label"
      :dataValue="condition.relative"
    />
    <LozengeValue
      :lookupType="relativeLookupInfo.type"
      :relativeLookupInfo="relativeLookupInfo"
      :value="condition.value"
    />
    <LozengeClear v-if="!disableRemove" @remove="$emit('remove')" />
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
</style>
