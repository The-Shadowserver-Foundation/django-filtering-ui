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
  { value: "and", label: "all" },
  { value: "or", label: "any" },
];

const cancelHandler = () => {
  window.location.assign(listingUrl);
};

const submitHandler = async (e) => {
  let url = listingUrl;
  const conditions = [];
  // Remove obviously incomplete rows
  for (const condition of grouping.conditions) {
    if (
      condition.identifier == undefined ||
      condition.relative == undefined ||
      condition.value == undefined
    ) {
      conditions.push(condition);
    } else if (!condition.validate()) {
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
  <div class="df-ui-filtering">
    <form method="post" @submit="submitHandler">
      <input type="hidden" name="csrfmiddlewaretoken" :value="csrftoken" />
      <input type="hidden" name="q" :value="renderedConditions" />
      <!-- The first row defines the top-level operator to use -->
      <div class="df-ui-row df-ui-match-type">
        <div class="df-ui-col">
          Match
          <Select
            id="top-level-operator"
            v-model="grouping.operation"
            :options="matchOptions"
            :includeBlank="false"
          />
          of the following criteria:
        </div>
      </div>
      <!-- Sticky criteria rows -->
      <StickyConditionRow
        v-for="condition in stickies"
        :key="condition.id"
        :condition
        :schema="filterSchema"
        @add="grouping.addConditionsAfter(condition, new Condition())"
      />
      <!-- Mutable criteria rows -->
      <ConditionRow
        v-for="condition in grouping.conditions"
        :key="condition.id"
        :condition
        :schema="filterSchema"
        @add="grouping.addConditionsAfter(condition, new Condition())"
        @remove="grouping.removeConditions(condition)"
      />
      <div class="df-ui-row df-ui-form-actions">
        <Button class="btn-action" type="submit">Filter</Button>
        <Button class="cancel btn-secondary" @click="cancelHandler"
          >Cancel</Button
        >
      </div>
    </form>
  </div>

  <div class="df-ui-debug" v-if="debugEnabled">
    <h3>Debug</h3>
    <DebugDataDisplay
      name="Query filters data"
      :data="JSON.parse(renderedConditions)"
      :expanded="true"
    />
    <DebugDataDisplay name="Options schema" :data="filterSchema" />
    <DebugDataDisplay name="JSON schema" :data="filteringJSONSchema" />
  </div>
</template>

<style scoped>
.df-ui-filtering {
  margin: 30px 0;
}
.df-ui-row.df-ui-match-type {
  margin: 20px 0;
}
.df-ui-row.df-ui-condition {
  display: flex;
  margin: 10px 0;
  align-items: center;
  gap: 10px;
}
:deep(.df-ui-row.df-ui-condition .df-ui-col) {
  flex: 1;
}
:deep(.df-ui-row.df-ui-condition input[type="text"]),
:deep(.df-ui-row.df-ui-condition select) {
  width: 100%;
}
:deep(.df-ui-row.df-ui-condition .df-ui-row-actions) {
  display: flex;
  gap: 5px;
  justify-content: right;
}
.df-ui-form-actions {
  display: flex;
  gap: 10px;
  margin: 30px 0;
}
</style>
