<script setup>
import "@/app.css";
import ComposableFilters from "@/components/ComposableFilters";
</script>

<template>
  <h2>Advanced filters</h2>
  <main>
    <div class="wrapper">
      <ComposableFilters />
    </div>
  </main>
</template>

Include bootstap grid from this component downward using scoped style with
vuejs' :deep pseudo-class.
<style scoped lang="scss">
.wrapper:deep() {
  @import "bootstrap/scss/bootstrap-grid.scss";
}
</style>
