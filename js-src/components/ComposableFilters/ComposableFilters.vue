<script setup>
import { inject } from "vue";

import Button from "@/components/form/Button.vue";
import Select from "@/components/form/Select.vue";
import DebugDataDisplay from "@/components/DebugDataDisplay.vue";
import ConditionRow from "./ConditionRow";
import StickyConditionRow from "./StickyConditionRow";

import useCsrfToken from "@/composables/useCsrfToken";
import useQueryFilters from "@/composables/useQueryFilters";
import { Condition, Grouping } from "@/utils/query";

const csrftoken = useCsrfToken();
const listingUrl = inject("model-listing-url");
const filterSchema = inject("filtering-options-schema");
const filteringJSONSchema = inject("filtering-json-schema");
const debugEnabled = inject("debug-enabled");

// The query filters (from the search params / query string)
// made into reactive objects.
const {
  grouping,
  stickies,
  changedStickies,
  original,
  rendered: renderedConditions,
} = useQueryFilters({
  createDefault: true,
  optionsSchema: filterSchema,
});

const matchOptions = [
  { value: "and", label: "All of" },
  { value: "or", label: "Any of" },
];

const cancelHandler = () => {
  let url = listingUrl;
  if (original) url += `?q=${JSON.stringify(original)}`;
  window.location.assign(url);
};

const submitHandler = async (e) => {
  let url = listingUrl;
  const conditions = [];
  // Remove obviously incomplete rows
  for (const condition of grouping.conditions) {
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
  grouping.removeConditions(...conditions);

  // Cancel the form submission if there are no conditions to submit.
  if (grouping.conditions.length == 0 && changedStickies.value.length == 0) {
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
      <input type="hidden" name="q" :value="renderedConditions" />
      <!-- The first row defines the top-level operator to use -->
      <div class="row">
        <div class="col">
          Match
          <Select
            id="top-level-operator"
            v-model="grouping.operation"
            :options="matchOptions"
            :includeBlank="false"
          />
          the following criteria...
        </div>
      </div>
      <!-- Sticky criteria rows -->
      <StickyConditionRow
        v-for="condition in stickies"
        :key="condition.id"
        :condition
        :schema="filterSchema"
      />
      <!-- Mutable criteria rows -->
      <ConditionRow
        v-for="condition in grouping.conditions"
        :key="condition.id"
        :condition
        :schema="filterSchema"
        @remove="grouping.removeConditions(condition)"
      />
      <!-- Add row should always be present -->
      <div class="row">
        <div class="col actions">
          <Button
            id="add-condition"
            class="btn btn-small"
            @click="grouping.addConditions(new Condition())"
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
      :data="JSON.parse(renderedConditions)"
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
  padding-bottom: 10px;
}
:deep(.col.actions) {
  text-align: right;
}
</style>
