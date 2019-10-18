<template>
  <el-container>
    <Header />
    <el-main>
      <div class="blogWrap">
        <div class="blogItem" v-for="( item,index ) in initData" :key="index">
          <h3 class="blogTitle" @click="goToDes(item.id)">
            <el-link type="primary" v-text="item.title"></el-link>
          </h3>
          <p class="blogDes" v-text="item.description"></p>
        </div>
      </div>
      <div class="paginationWrap">
        <el-pagination background layout="prev, pager, next" :total="count"></el-pagination>
      </div>
    </el-main>
    <el-footer :style="footerBg">
      <p>
        Copyright © 89.com
        <span>|</span>
        免责申明
        <span>|</span> 鄂ICP备13007830号-1
      </p>
    </el-footer>
  </el-container>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  components: { Header },
  data() {
    return {
      initData: new Array(10).fill(""),
      count: null,
      footerBg: {
        backgroundImage: "url(" + require("@/assets/showcase_bg.png") + ")"
      }
    };
  },
  methods: {
    getInitData() {
      this.$axios
        .post("user/articles", { page_number: 1 })
        .then(({ data: res }) => {
          if (res.status) {
            this.initData = res.data;
            this.count = res.count;
          }
        });
    },
    goToDes(id) {
      this.$router.push({
        path: "/test",
        query: { id: id }
      });
    }
  },
  created() {
    this.getInitData();
  }
};
</script>

<style lang="stylus" scoped>
.el-main
  background-color: #f8f8f8
  .blogWrap
    padding: 0 12%
    .blogItem
      padding: 6% 12% 0 12%
    .blogTitle
      .el-link
        font-size: 2.4rem
    .blogDes
      font-size: 1.7rem
      padding-bottom: 1.5rem
      border-bottom: 0.1rem solid #dbdbdb
.paginationWrap
  padding: 6% 12% 0 12%
  display: flex
  flex-direction: row-reverse
.el-footer
  display: flex
  align-items: center
  padding: 0 12%
  height: 4rem !important
  color: #585858
  font-size: 1rem
</style>