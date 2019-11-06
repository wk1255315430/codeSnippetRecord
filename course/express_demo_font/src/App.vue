<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<style lang="stylus">
body, html
  margin: 0
  padding: 0
  font-size: 10px
  .el-header
    box-sizing: border-box
  .clearfix::before
    content: ''
    display: table
#nprogress .bar
  background: rgb(76, 164, 214) !important
</style>
