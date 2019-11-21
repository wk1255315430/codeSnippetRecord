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
              <div class="blogDesWrap">
                <p class="blogDes">{{item.content | filtersContent}}</p>
              </div>
            </div>
            <div class="paginationWrap" :class="{'change':initData}">
              <el-pagination
                @current-change="currentPageHandle"
                background
                :pager-count="11"
                layout="pager"
                :total="100"
              ></el-pagination>
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
              <div class="blogDesWrap">
                <p class="blogDes">{{item.content | filtersContent}}</p>
              </div>
            </div>
            <div class="paginationWrap" :class="{'change':initHotData}">
              <el-pagination
                background
                @current-change="currentHotPageHandle"
                :pager-count="11"
                layout="pager"
                :total="count"
              ></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>
    <el-footer :class="{'change':initData,'change':initHotData}" :style="footerBg">
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
      this.getArticleHotData(newValue, 1);
    }
  },
  filters: {
    filtersContent: function(value) {
      if (!value) return "";
      return value.replace(/<[^<>]+>/g, "").replace(/&nbsp;/gi, "");
    }
  },
  methods: {
    getInitData(number = 1) {
      this.$axios
        .post("/api/user/articles", { page_number: number })
        .then(({ data: res }) => {
          if (res.status) {
            this.initData = res.data;
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
        this.getArticleHotData(3, 1);
        this.visiableTabHot = !this.visiableTabHot;
      }
      if (!this.visiableTabHot) {
        this.tabHotValue = "3";
      }
    }),
    getArticleHotData(day, page_number) {
      let params = {
        day: day
      };
      if (page_number) {
        params.page_number = page_number;
      }
      this.$axios.post("/api/user/articleHot", params).then(({ data: res }) => {
        if (res.status) {
          if (res.count) {
            this.count = res.count > 100 ? 100 : res.count;
          } else {
            this.initHotData = res.data;
          }
        }
      });
    },
    currentPageHandle(value) {
      this.getInitData(value);
    },
    currentHotPageHandle(page_number) {
      this.getArticleHotData(this.tabHotValue, page_number);
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
    .blogDesWrap
      border-bottom: 0.1rem solid #dbdbdb
      .blogDes
        color: #909090
        font-size: 1.7rem
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 3
        overflow: hidden
    .el-select
      display: none
      &.isShowSelect
        display: inline-block
      & /deep/ .el-input__inner
        padding-left: 0.7rem
.paginationWrap
  padding: 6% 12% 0 12%
  display: none
  flex-direction: row-reverse
&.change
  display: flex
.el-footer
  display: none
  align-items: center
  padding: 0 12%
  height: 4rem !important
  color: #585858
  font-size: 1rem
&.change
  display: flex
@media screen and (max-width: 768px)
  .el-main
    padding: 0
    .blogWrap
      padding: 0 0
      & /deep/.el-tabs
        .el-tabs__header
          .el-tabs__nav
            .el-tabs__item
              padding: 0 15px 0 0
          &:first-child
            padding-left 15px
      .blogItem
        padding: 2% 3% 0 3%
  .paginationWrap
    padding: 0
    margin: 3% 0
    display: none
    flex-direction: row-reverse
    /deep/ .el-pagination
      padding: 0
      width: 100%
      .el-pager
        display: flex
        justify-content: flex-end
        li
          margin: 0 7px 0 0 !important
          padding: 0 !important
  &.change
    display: flex
</style>
