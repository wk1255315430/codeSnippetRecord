<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
export default {
  methods: {},
  created() {}
};
</script>
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
.el-autocomplete-suggestion
  width: auto !important
.el-message
  width: auto !important
.el-scrollbar__wrap
  overflow-x: hidden
.markdown
  .title
    font-size: 2.5rem
    font-weight: 700
    display: flex
    flex-wrap: warp
    justify-content: center
  div
    padding: 1rem
    font-size: 1.5rem
    p
      margin: 0 !important
      padding: 0 !important
      text-indent: 0 !important
    img
      max-width: 100%
@media screen and (max-width: 768px)
  body, html
    margin: 0
    padding: 0
    font-size: 8px
</style>
