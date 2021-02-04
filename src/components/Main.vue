<template>
  <div class="main">
    <div id="resize-hack" class="main-left">
      <Graph />
    </div>
    <div class="main-right">
      <Crawler v-for="(exec, index) of $store.state.crawlerExecutorsActive"
               v-bind:key="index"
               v-bind:exec="exec" />
    </div>
  </div>
</template>

<script>
import Graph from './Graph.vue'
import Crawler from './Crawler.vue'

export default {
  name: 'Main',
  components: {
    Graph,
    Crawler
  }
}
</script>

<style scoped>
.main {
  position: relative;
  display: grid;
  grid-template-columns: auto 300px;
  background-color: whitesmoke
}
.main-left {
  grid-column: 1;
}
.main-right {
  grid-column: 2;
  border-left: 1px solid black;
  background-color: rgb(66, 185, 131, .75);
}
</style>
