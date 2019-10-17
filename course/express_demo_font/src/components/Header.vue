<template>
   <el-header>
      <div class="logo">
         <el-link href="/"><img src="@/assets/logo.png" alt /></el-link>
      </div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">首页</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
        </el-submenu>
        <el-menu-item index="3">
          <a href="https://www.ele.me" target="_blank">订单管理</a>
        </el-menu-item>
      </el-menu>
      <div class="line"></div>
    </el-header>
</template>

<script>
export default {
  name: "Header",
   data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.el-header
  display: flex
  box-shadow 0 2px 6px rgba(0, 0, 0, .1)
  .logo
    flex-shrink: 0
    img
      height: 60px
  .el-menu
    flex-grow: 1
    display flex
    flex-direction row-reverse
    background none
  .el-menu.el-menu--horizontal
    border-bottom none
</style>
