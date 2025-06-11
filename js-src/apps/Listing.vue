<script setup>
import "@/app.css";

import { computed, inject, nextTick, useTemplateRef } from "vue";
import Lozenge from "@/components/Lozenge.vue";
import useCsrfToken from "@/composables/useCsrfToken";
import useQueryFilters from "@/composables/useQueryFilters";
import { operatorToLabel } from "@/utils/lookupMapping";

const csrftoken = useCsrfToken();
const filterSchema = inject("filtering-options-schema");
const listingUrl = inject("model-listing-url");
const filteringUrl = inject("model-filtering-url");

const filteringForm = useTemplateRef("filteringForm");

const {
  grouping,
  stickies,
  changedStickies,
  rendered: renderedConditions,
} = useQueryFilters({
  optionsSchema: filterSchema,
});
// FIXME The structure of this content changed,
//       but the underlying code has yet to be changed.
const revisedFilterSchema = Object.entries(filterSchema.filters).map(
  ([k, v]) => ({ name: k, ...v }),
);
const rootOperatorLabel = grouping ? operatorToLabel(grouping.operation) : null;
const hasConditions = computed(() =>
  Boolean(grouping.conditions.length || stickies.value.length),
);

const submitChange = () => {
  // Await next update before submitting the form.
  // This allows the DOM to update before dispatching the event from the browser.
  nextTick(() => filteringForm.value.dispatchEvent(new Event("submit")));
};

const handleLozengeRemove = (condition) => {
  // Remove the condition from the query filters
  grouping.removeConditions(condition);
  submitChange();
};

const handleStickyReset = (c) => {
  // Reset the condition to default
  const idx = stickies.value.findIndex((x) => x.id === c.id);
  const [identifier, { lookup, value }] =
    filterSchema.filters[c.identifier].sticky_default;
  stickies.value[idx].lookup = lookup;
  stickies.value[idx].value = value;
  submitChange();
};
</script>

<template>
  <form class="df-ui-lozenges-form" ref="filteringForm" method="post" :action="filteringUrl">
    <input type="hidden" name="csrfmiddlewaretoken" :value="csrftoken" />
    <input type="hidden" name="q" :value="renderedConditions" />
  </form>
  <div class="df-ui-lozenges" v-if="hasConditions">
    <span class="df-ui-lozenges-preamble">Results match {{ rootOperatorLabel }} of:</span>
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
.df-ui-lozenges-form {
  display: none;
}
.df-ui-lozenges {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin: 20px 0;
  gap: 5px;
}
.df-ui-lozenges-preamble {
  margin-right: 5px;
}
</style>
