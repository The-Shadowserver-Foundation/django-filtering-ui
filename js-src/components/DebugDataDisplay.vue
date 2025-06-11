<script setup>
import { computed, ref } from "vue";
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
  <div class="df-ui-debug-data">
    <div class="df-ui-debug-data-header">
      <h4>{{ name }}</h4>
      <Button class="btn-tiny" @click="toggleShowing">{{
        isShowing ? "hide" : "show"
      }}</Button>
    </div>
    <pre v-show="isShowing">{{
      dataAsString
    }}</pre>
  </div>
</template>

<style scoped>
.df-ui-debug-data {
  margin: 20px 0;
}
.df-ui-debug-data-header {
  display: flex;
}
.df-ui-debug-data-header h4 {
  margin: 0;
  flex: 1;
}
</style>
