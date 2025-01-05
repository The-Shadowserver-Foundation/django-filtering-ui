<script setup>
import { defineProps, computed, ref } from "vue";
import Button from "@/components/form/Button.vue";

const { name, data, expanded } = defineProps(["name", "data", "expanded"]);
const isShowing = ref(expanded ? true : false);

const dataAsString = computed(() => {
  return JSON.stringify(data, null, 2);
});

const toggleShowing = () => {
  isShowing.value = !isShowing.value;
};
</script>

<template>
  <h3>{{ name }} debug data</h3>
  <Button class="btn-small" @click="toggleShowing">{{
    isShowing ? "hide" : "show"
  }}</Button>
  <pre v-show="isShowing">
    {{ dataAsString }}
  </pre>
</template>

<style scoped></style>
