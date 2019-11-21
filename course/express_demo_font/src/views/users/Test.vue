<template>
  <div class="flexLayout">
    <div class="header">头部</div>
    <div class="content">
      <div class="itema">占位</div>
      <div class="itemb">占位</div>
    </div>
    <div class="footer">页脚</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
.flexLayout
  display: flex
  flex-direction: column
  height: 100vh
  .header
    height: 10vh
    background: #333
    flex-shrink: 0
  .content
    flex-grow: 1
    overflow: auto
    background-color: #fff
    width 50vw
    margin 0 auto
    .itema
      background-color: blue
      height: 50vh
    .itemb
      background-color: pink
      height: 50vh
  .footer
    height: 10vh
    background: #333
    flex-shrink: 0
</style>