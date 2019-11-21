<template>
  <el-header>
    <div class="logo">
      <el-link href="/">
        <img src="@/assets/logo.png" alt />
      </el-link>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1" class="hidden-xs-only">文章</el-menu-item>
      <el-submenu index="2" class="hidden-xs-only">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-submenu>
      <el-menu-item index="3" class="hidden-xs-only">
        <a href="https://www.ele.me" target="_blank">订单管理</a>
      </el-menu-item>
      <div class="inputWrap" v-on:keyup.enter="getSerchData">
        <el-autocomplete
          :highlight-first-item="true"
          popper-class="my-autocomplete"
          v-model="search"
          :trigger-on-focus="false"
          :debounce="1000"
          :fetch-suggestions="getSerchData"
          placeholder="搜索一下"
          @select="serchHandleSelect"
        >
          <i class="el-icon-search el-input__icon" slot="suffix"></i>
          <template slot-scope="{ item }">
            <div class="title">{{ item.title }}</div>
          </template>
        </el-autocomplete>
      </div>
      <div class="menu hidden-sm-and-up">
        <i class="el-icon-menu" @click="drawer = !drawer"></i>
      </div>
    </el-menu>
    <div class="line"></div>
    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
    >
      <span>我来啦!</span>
    </el-drawer>
  </el-header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      search: "",
      drawer: false,
      direction: "rtl"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    serchHandleSelect(item) {
      this.$router.push({
        path: `/article/${item.id}`
      });
    },
    getSerchData(queryString, cb) {
      this.$axios
        .post("/api/user/search", {
          queryString: queryString
        })
        .then(({ data: res }) => {
          if (res.status) {
            if (!res.data.length) {
              this.$message({
                message: "未查询到相关文章",
                type: "error",
                duration: 1500
              });
            }
            cb(res.data);
          }
        });
    }
  }
};
</script>

<style scoped lang="stylus">
.el-header
  display: flex
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1)
  background-color: #ffffff
  padding: 0 1rem
  .logo
    flex-shrink: 0
    display: flex
    align-items: center
    img
      height: 60px
      display: block
  .el-menu
    flex-grow: 1
    display: flex
    flex-direction: row-reverse
    background: none
    .el-autocomplete-suggestion
      width: 100%
      li
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 2
        overflow: hidden
    .el-icon-menu
      font-size: 2.8rem
      color: #303133
  .menu
    display: flex
    align-items: center
  .inputWrap
    display: flex
    align-items: center
  .el-autocomplete
    width: 100%
    .my-autocomplete
      li
        line-height: normal
        padding: 7px
        .name
          text-overflow: ellipsis
          overflow: hidden
        .addr
          font-size: 12px
          color: #b4b4b4
        .highlighted .addr
          color: #ddd
  .el-menu.el-menu--horizontal
    border-bottom: none
@media screen and (max-width: 768px)
  .el-header
    padding 0
    .logo
      padding: 1rem
      img
        height: 40px
    .el-menu
      display: flex
      justify-content: space-between
      flex-direction: row
      &::after, &::before
        display: none
    .menu
      width 40px
      justify-content center
</style>
