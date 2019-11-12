<template>
  <el-container>
    <Header />
    <el-main>
      <div class="blogWrap">
        <el-tabs v-model="tabActiveName" @tab-click="tabsHandle">
          <el-tab-pane label="最新文章" name="first">
            <div class="blogItem" v-for="( item,index ) in initData" :key="index">
              <h3 class="blogTitle" @click="goToDes(item.id)">
                <el-link type="primary" v-text="item.title"></el-link>
              </h3>
              <p class="blogDes" v-text="item.description"></p>
            </div>
            <div class="paginationWrap">
              <el-pagination background layout="prev, pager, next" :total="count"></el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label">
              热门文章
              <el-select
                :class="{isShowSelect:visiableTabHot}"
                size="mini"
                style="width:80px"
                v-model="tabHotValue"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </span>
            <div class="blogItem" v-for="( item,index ) in initHotData" :key="index">
              <h3 class="blogTitle" @click="goToDes(item.id)">
                <el-link type="primary" v-text="item.title"></el-link>
              </h3>
              <p class="blogDes" v-text="item.description"></p>
            </div>
            <div class="paginationWrap">
              <el-pagination background layout="prev, pager, next" :total="count"></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
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
import { Debounce } from "@/utils/td.js";
export default {
  components: { Header },
  data() {
    return {
      count: null,
      initData: "",
      tabActiveName: "first",
      footerBg: {
        backgroundImage: "url(" + require("@/assets/showcase_bg.png") + ")"
      },
      options: [
        {
          value: "3",
          label: "三日"
        },
        {
          value: "7",
          label: "一周"
        },
        {
          value: "30",
          label: "一月"
        },
        {
          value: "",
          label: "总榜"
        }
      ],
      visiableTabHot: false,
      tabHotValue: "3",
      initHotData: ""
    };
  },
  watch: {
    tabHotValue(newValue, oldValue) {
      this.getArticleHotData(newValue);
    }
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
        path: `article/${id}`
      });
    },
    tabsHandle: Debounce(function() {
      if (this.tabActiveName === "second") {
        this.getArticleHotData(3);
        this.visiableTabHot = !this.visiableTabHot;
      }
      if (!this.visiableTabHot) {
        this.tabHotValue = "3";
      }
    }),
    getArticleHotData(day) {
      this.$axios
        .post("user/articleHot", {
          day: day
        })
        .then(({ data: res }) => {
          if (res.status) {
            this.initHotData = res.data;
          }
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
  background-color: #F9FAFD
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
    .el-select
      display: none
      &.isShowSelect
        display: inline-block
      & /deep/ .el-input__inner
        padding-left: 0.7rem
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
