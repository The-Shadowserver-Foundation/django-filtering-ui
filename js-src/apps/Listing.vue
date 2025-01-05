<script setup>
import "@/app.css";

import { inject } from "vue";
import Lozenge from "@/components/Lozenge.vue";
import useQueryFilters from "@/composables/useQueryFilters";
import { operatorToLabel } from "@/utils/lookupMapping";

const [queryFilters] = useQueryFilters();
const filterSchema = inject("filtering-options-schema");
// FIXME The structure of this content changed,
//       but the underlying code has yet to be changed.
const revisedFilterSchema = Object.entries(filterSchema.filters).map(
  ([k, v]) => ({ name: k, ...v }),
);
const rootOperatorLabel = queryFilters
  ? operatorToLabel(queryFilters.operation)
  : null;

const handleLozengeRemove = (condition) => {
  // Remove the condition from the query filters
  queryFilters.removeConditions(condition);
  // Build new url with updated query data
  const url = new URL(window.location);
  // Check if all conditions have been removed
  if (queryFilters.conditions.length == 0) {
    url.searchParams.delete("q");
  } else {
    url.searchParams.set("q", JSON.stringify(queryFilters.toObject()));
  }
  window.location.assign(url);
};
</script>

<template>
  <div class="filter-container" v-if="queryFilters">
    <span class="preamble"> Results match {{ rootOperatorLabel }} of: </span>
    <Lozenge
      v-for="condition in queryFilters.conditions"
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
