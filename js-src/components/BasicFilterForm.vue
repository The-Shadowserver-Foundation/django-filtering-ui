<script setup>
import useCsrfToken from "@/composables/useCsrfToken";

const csrftoken = useCsrfToken();
const props = defineProps(["q"]);
console.log(props);
</script>

<template>
  <form method="post">
    <div>
      <input type="hidden" name="csrfmiddlewaretoken" :value="csrftoken" />
      <label for="q">Q:</label
      ><textarea name="q" :value="JSON.stringify(props.q)" />
    </div>
    <input class="btn primary" type="submit" value="Filter" />
  </form>
</template>

<style scoped>
textarea {
  width: 90%;
  min-height: 100px;
}
</style>
