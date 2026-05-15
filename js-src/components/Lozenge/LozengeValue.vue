<script setup>
import LozengeChoiceValue from "./LozengeChoiceValue.vue";
import LozengeDateRangeValue from "./LozengeDateRangeValue.vue";
import LozengePartialDateRangeValue from "./LozengePartialDateRangeValue.vue";

defineProps(["lookupType", "relativeLookupInfo", "value"]);
</script>

<template>
  <span class="df-ui-lozenge-value" :data-value="value">
    <LozengeChoiceValue
      v-if="lookupType === 'choice'"
      :relativeLookupInfo="relativeLookupInfo"
      :value="value"
    />
    <LozengeDateRangeValue
      v-else-if="lookupType === 'date-range'"
      :value="value"
    />
    <LozengePartialDateRangeValue
      v-else-if="lookupType === 'partial-date-range'"
      :value="value"
    />
    <template v-else>{{ value }}</template>
  </span>
</template>

<style scoped>
.df-ui-lozenge-value {
  font-weight: bold;
}
</style>
