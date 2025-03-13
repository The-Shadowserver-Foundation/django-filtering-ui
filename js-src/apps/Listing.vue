<script setup>
import "@/app.css";

import { computed, inject } from "vue";
import Lozenge from "@/components/Lozenge.vue";
import useQueryFilters from "@/composables/useQueryFilters";
import { operatorToLabel } from "@/utils/lookupMapping";

const filterSchema = inject("filtering-options-schema");
const { grouping, stickies } = useQueryFilters({ optionsSchema: filterSchema });
// FIXME The structure of this content changed,
//       but the underlying code has yet to be changed.
const revisedFilterSchema = Object.entries(filterSchema.filters).map(
  ([k, v]) => ({ name: k, ...v }),
);
const rootOperatorLabel = grouping ? operatorToLabel(grouping.operation) : null;
const hasConditions = computed(() => grouping || stickies.value);

const changedStickies = computed(() => {
  const nonDefaultStickies = [];
  if (stickies.value.length > 0) {
    for (const c of stickies.value) {
      const stickyDefault = filterSchema.filters[c.identifier].sticky_default;
      if (
        c.relative !== stickyDefault[1]["lookup"] ||
        c.value !== stickyDefault[1]["value"]
      ) {
        nonDefaultStickies.push(c);
      }
    }
  }
  return nonDefaultStickies;
});

// Computes the query into the end result for form submission.
const renderedQueryFilters = computed(() => {
  const q = grouping.toObject();
  // Prepend the sticky conditions.
  // This is so they will be popped off correctly when read again from this component, etc.
  for (const c of changedStickies.value.toReversed()) {
    q[1].unshift(c.toObject());
  }
  return JSON.stringify(q);
});

const pushLocation = () => {
  // Build new url with updated query data
  const url = new URL(window.location);
  // Check if all conditions have been removed
  if (grouping.conditions.length == 0 && changedStickies.value.length == 0) {
    url.searchParams.delete("q");
  } else {
    url.searchParams.set("q", renderedQueryFilters.value);
  }
  window.location.assign(url);
};

const handleLozengeRemove = (condition) => {
  // Remove the condition from the query filters
  grouping.removeConditions(condition);
  pushLocation();
};

const handleStickyReset = (c) => {
  // Reset the condition to default
  const idx = stickies.value.findIndex((x) => x.id === c.id);
  const [identifier, { lookup, value }] =
    filterSchema.filters[c.identifier].sticky_default;
  stickies.value[idx].lookup = lookup;
  stickies.value[idx].value = value;
  pushLocation();
};
</script>

<template>
  <div class="filter-container" v-if="hasConditions">
    <span class="preamble"> Results match {{ rootOperatorLabel }} of: </span>
    <Lozenge
      v-for="condition in stickies"
      :key="condition.id"
      :condition
      :schema="revisedFilterSchema"
      :disableRemove="!changedStickies.includes(condition)"
      @remove="handleStickyReset(condition)"
    />
    <Lozenge
      v-if="grouping"
      v-for="condition in grouping.conditions"
      :key="condition.id"
      :condition
      :schema="revisedFilterSchema"
      @remove="handleLozengeRemove(condition)"
    />
  </div>
</template>

<style scoped>
.filter-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 0.2em 0.5em;
  .preamble {
    /* color: #000; */
    padding: 5px 10px 5px 10px;
    border-radius: 10px;
    margin: 0 2px;
    position: relative;
  }
}
</style>
