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
  -webkit-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none
  .el-header
    box-sizing: border-box
  .clearfix::before
    content: ''
    display: table
#nprogress .bar
  background: rgb(76, 164, 214) !important
.el-autocomplete-suggestion
  width: 100% !important
.el-message
  width: auto !important
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
  .el-autocomplete-suggestion
    left: 0 !important
    li
      overflow: visible
      display: -webkit-box
      -webkit-box-orient: vertical
      -webkit-line-clamp: 2
      overflow: hidden
      white-space: normal
      height: 4rem
      line-height: 2rem
      font-size: 2rem
      display: flex
      align-items: center
      padding: 0 10px
      &:nth-child(odd)
        background-color: #fafafa
      &:nth-child(even)
        background-color: #ffffff
    .el-scrollbar
      overflow: visible
      .el-scrollbar__wrap
        overflow-x: scroll
</style>
