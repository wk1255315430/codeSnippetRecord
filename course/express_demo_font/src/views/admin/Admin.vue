<template>
  <el-container id="admin">
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>查看</el-dropdown-item>
          <el-dropdown-item>新增</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>王小虎</span>
    </el-header>
    <el-container class="minusHeight">
      <el-aside width="15%" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-active="activeIndex" :default-openeds="['1']" @select="handleSelect">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>玉盘珍羞
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="/admin/article">直万钱</el-menu-item>
              <el-menu-item index="/admin/category">多岐路</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">"sssfsf"</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- <keep-alive> -->
        <!-- <router-view v-if="$route.meta.keepAlive"></router-view> -->
        <!-- </keep-alive> -->
        <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
        <div>{{token}}</div>
        <!-- <el-table :data="tableData">
          <el-table-column prop="date" label="日期" width="140"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>-->
      </el-main>
    </el-container>
  </el-container>
</template>
<style lang="stylus" scoped>
#admin
  height: 100vh
  flex-direction: column
  display: flex
  .minusHeight
    flex-grow: 1
    overflow-y: auto
  .el-header
    background-color: #b3c0d1
    color: #333
    line-height: 60px
    flex-shrink: 0
  .el-aside
    color: #333
</style>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "home",
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    };
    return {
      tableData: Array(20).fill(item),
      activeIndex: "/admin/article"
    };
  },
  computed: {
    ...mapGetters(["token"])
  },
  methods: {
    ...mapMutations["beforEunload"],
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      if (this.$route.path === key) return;
      this.$router.push({
        path: key
      });
    }
  },
  created() {
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("token", this.token);
    });
    if (!this.token) {
      this.$store.commit("beforEunload", sessionStorage.getItem("token"));
      sessionStorage.removeItem("token");
    }
  }
};
</script>
