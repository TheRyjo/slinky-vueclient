<template>
  <div class="header">
    <img alt="Vue logo" src="../assets/logo.png">
    <span class="title">Slinky</span> 
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
}

img {
  max-height: 25px
}

.title {
  margin-left: 25px;
  font-size: 4em;
  color: #42b983;
}
</style>
