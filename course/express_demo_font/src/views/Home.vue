<template>
  <el-container>
    <Header />
    <el-main>
      <div class="blogWrap">
        <div class="blogItem" v-for="( item,index ) in initData" :key="index">
          <h3 class="blogTitle">
            <el-link type="primary">JSP XML 数据处理错误二</el-link>
          </h3>
          <div
            class="blogDes"
          >问题 javax.servlet.ServletException: java.lang.NoClassDefFoundError: org/apache/xml/serializer/SerializerTrace 解决 - 不要xlan.jar 包，只留xerceslmpl.jar...</div>
        </div>
      </div>
      <div class="paginationWrap">
        <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
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
      footerBg:{
        backgroundImage: "url(" + require("@/assets/showcase_bg.png") + ")",
      }
    };
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
  display flex
  align-items center
  padding 0 12%
  height 4rem !important
  color #585858
  font-size 1rem
</style>