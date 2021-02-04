<template>
  <div id="app">
    <Header />
    <div class="app-welcome">
      <span>Welcome! Try these commands:</span><br>
      <span>[ sites ls, crawl url http://www.google.com, crawl word design ]</span><br>
      <span class="app-secondary">(click to re-target crawl)</span>
    </div>
    <hr>
    <Terminal />
    <Main class="app-main" />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Terminal from './components/Terminal.vue'
import Main from './components/Main.vue'

export default {
  name: 'App',
  components: {
    Header,
    Terminal,
    Main
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: whitesmoke;
  background-color: #283747;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.7);

  height: 90%;
  width: 90%;
  display: flex;
  flex-direction: column;
}
.app-welcome {
  text-align: center;
}
.app-secondary {
  color: rgba(245,245,245,.5)
}
.app-main {
  flex-grow: 1
}
hr {
  width: 100%
}
</style>
