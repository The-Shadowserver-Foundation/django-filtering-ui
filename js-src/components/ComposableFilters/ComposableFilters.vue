<script setup>
import { computed, inject } from "vue";

import Button from "@/components/form/Button.vue";
import Select from "@/components/form/Select.vue";
import DebugDataDisplay from "@/components/DebugDataDisplay.vue";
import ConditionRow from "./ConditionRow";

import useCsrfToken from "@/composables/useCsrfToken";
import useQueryFilters from "@/composables/useQueryFilters";
import { Condition, Grouping } from "@/utils/query";

const csrftoken = useCsrfToken();
const indexUrl = inject("model-index-url");
const filterSchema = inject("filtering-options-schema");
const filteringJSONSchema = inject("filtering-json-schema");
const debugEnabled = inject("debug-enabled");

// The query filters (from the search params / query string)
// made into reactive objects.
const [queryFilters, originalQueryFiltersData] = useQueryFilters({
  createDefault: true,
});

const matchOptions = [
  { value: "and", label: "All of" },
  { value: "or", label: "Any of" },
];

const updateSchemaItem = (schemaItem) => {
  const { nargs } = schemaItem;
  const activeUseCount = queryFilters.conditions.reduce(
    (acc, c) => (c.identifier === schemaItem.name ? acc + 1 : acc),
    0,
  );
  return {
    ...schemaItem,
    // Define the schema item as disable
    disabled: nargs && nargs <= activeUseCount,
  };
};

// Computes the query into the end result for form submission.
const renderedQueryFilters = computed(() =>
  JSON.stringify(queryFilters.toObject()),
);

const cancelHandler = () => {
  let url = indexUrl;
  if (originalQueryFiltersData)
    url += `?q=${JSON.stringify(originalQueryFiltersData)}`;
  window.location.assign(url);
};

const submitHandler = async (e) => {
  let url = indexUrl;
  const conditions = [];
  // Remove obviously incomplete rows
  for (const condition of queryFilters.conditions) {
    if (
      condition.identifier == undefined &&
      condition.relative == undefined &&
      condition.value == undefined
    ) {
      conditions.push(condition);
    } else if (!condition.value || !condition.identifier) {
      // FIXME This works around the lack of error state by dropping the row
      //       when the value has not been supplied. Not an ideal solution,
      //       but it simply and cheaply achieves an error free submission.
      conditions.push(condition);
    }
  }
  queryFilters.removeConditions(...conditions);
  if (queryFilters.conditions.length == 0) {
    // FIXME Ideally we handle this case with error state preventing submission.
    //       This is a workaround since error state hasn't yet been implemented.
    e.preventDefault();
    cancelHandler();
  }
};
</script>

<template>
  <div class="container">
    <form method="post" @submit="submitHandler">
      <input type="hidden" name="csrfmiddlewaretoken" :value="csrftoken" />
      <input type="hidden" name="q" :value="renderedQueryFilters" />
      <!-- The first row defines the top-level operator to use -->
      <div class="row">
        <div class="col">
          Match
          <Select
            id="top-level-operator"
            v-model="queryFilters.operation"
            :options="matchOptions"
            :includeBlank="false"
          />
          the following criteria...
        </div>
      </div>
      <!-- All rows beyond this point are criteria -->
      <ConditionRow
        v-for="condition in queryFilters.conditions"
        :key="condition.id"
        :condition
        :schema="filterSchema"
        @remove="queryFilters.removeConditions(condition)"
      />
      <!-- Add row should always be present -->
      <div class="row">
        <div class="col actions">
          <Button
            id="add-condition"
            class="btn btn-small"
            @click="queryFilters.addConditions(new Condition())"
            >+</Button
          >
        </div>
      </div>
      <ul class="spaced">
        <li><Button type="submit">Filter</Button></li>
        <li>
          <Button class="cancel btn-negative" @click="cancelHandler"
            >Cancel</Button
          >
        </li>
      </ul>
    </form>
  </div>
  <div v-if="debugEnabled">
    <hr />
    <DebugDataDisplay
      name="Query Filters data"
      :data="queryFilters.toObject()"
      :expanded="true"
    />
    <DebugDataDisplay name="Options Schema" :data="filterSchema" />
    <DebugDataDisplay name="JSON Schema" :data="filteringJSONSchema" />
  </div>
</template>

<style scoped>
:deep(.row) {
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
:deep(.col.actions) {
  text-align: right;
}
</style>
