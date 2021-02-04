<template>
  <div class="crawler">
    <b>CrawlerID: </b>{{idx}}<button class="crawler-remove" v-on:click="remove">X</button>
    <br>

    <b>Target: </b>{{exec.crawler.target}}
    <br>

    <b>Status: </b>
    <button v-on:click="toggle">{{exec.running() ? "RUNNING" : "PAUSED"}}</button>
    <br>

    <b>Rate: </b>
    <input type="range" min=".1" max="2" step=".1" style="direction:rtl" v-model="exec.interval">{{ (1 / exec.interval).toFixed(1)  + '/sec'}}
    <br>

    <b>Links Remaining: </b>
    <span>{{(typeof exec.crawler.targetNexts !== "undefined") ? exec.crawler.targetNexts : '?'}} </span>
    <button v-bind:disabled="exec.crawler.nextsCt().length < 1" v-on:click="append">-</button><br/>
  </div>
</template>

<script>
/**
 * Vue component for crawler status and configuration.
 */
export default {
  name: 'Crawler',
  computed: {
    idx: function() {
      return this.$store.state.helpers.getExecId(this.$store.state, this.exec);
    }
  },
  methods: {
      toggle: function () {
        this.$store.commit('toggleCrawlerExecutor', this.$props.exec);
      },
      append: function () {
          this.exec.execute();
      },
      remove: function () {
        this.$store.commit('removeCrawlerExecutor', this.$props.exec);
      }
  },
  props: ['exec'],
}
</script>

<style scoped>
.crawler {
  color: black;
  padding: 15px;
  border-bottom: 2px dashed black;
}
.crawler-remove {
  float: right;
}
.crawler-target {
  font-size: 1.1em;
}
.crawler-depressed {
  background: #e5e5e5;
  outline: none;
  -webkit-box-shadow: inset 0px 0px 5px #c1c1c1;
     -moz-box-shadow: inset 0px 0px 5px #c1c1c1;
          box-shadow: inset 0px 0px 5px #c1c1c1;
}
</style>
