<script setup>
import { computed, defineProps } from "vue";
import { lookupToLabel } from "@/utils/lookupMapping";

const { schema, condition } = defineProps(["schema", "condition"]);
const relativeLabel = lookupToLabel(condition.relative);
const schemaField = computed(() => {
  return schema.filter((x) => x.name == condition.identifier)[0];
});
</script>

<template>
  <div class="filter-lozenge">
    <span class="identifier" :data-value="condition.identifier">{{
      schemaField.label
    }}</span
    >&nbsp;
    <span class="relative" :data-value="condition.relative">{{
      relativeLabel
    }}</span
    >&nbsp;
    <span class="value" :data-value="condition.value">{{
      condition.value
    }}</span>
    <a class="clear" href="#" title="clear" @click="$emit('remove')">x</a>
  </div>
</template>

<style scoped>
.filter-lozenge {
  color: #000;
  /* padding: 5px 10px 5px 20px; */
  padding: 5px 10px 5px 10px;
  border-radius: 10px;
  margin: 0 2px;
  position: relative;
  border: 1px solid var(--ssf-tertiary);
  background-color: var(--ssf-tertiary-shaded);
}
.filter-lozenge > .value {
  font-weight: bold;
}

.filter-lozenge .filter-relative {
  display: none;
  text-transform: uppercase;
  font-weight: bolder;
  font-size: 0.8rem;
  position: absolute;
  left: 0;
  transform-origin: 0 0;
  transform: rotate(-90deg);
}

.filter-lozenge:has(.filter-relative.or) {
  .filter-relative {
    color: var(--ssf-primary-inverse);
    top: 1.8rem;
  }
}
.filter-lozenge:has(.filter-relative.and) {
  .filter-relative {
    color: var(--ssf-primary-inverse);
    top: 2rem;
  }
}

.filter-lozenge a.clear {
  text-decoration: none;
  color: #999;
  padding-left: 4px;
}
.filter-lozenge a.clear::before {
  content: " ";
  padding-left: 4px;
  max-height: 100%;
  border-left: 1px solid #aaa;
}
</style>
