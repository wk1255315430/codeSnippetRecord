<template>
  <el-container>
    <Header />
    <el-main>
      <div class="markdown">
        <markdown-it-vue v-if="content_type === 1" class="md-body" :content="content" />
        <div v-else v-html="content"></div>
        <div class="des">
          <p>
            版权声明：本文为博主原创文章，遵循
            <el-link
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
            >CC 4.0 BY-SA 版权协议，转载请附上原文出处链接和本声明。</el-link>
          </p>
          <p>
            本文链接：
            <el-link
              href="https://blog.csdn.net/weixin_43728574/article/details/102574258"
            >https://blog.csdn.net/weixin_43728574/article/details/102574258"</el-link>
          </p>
        </div>
        <div class="socket">
          <p @click="getInitDataId">发送==》</p>
          <p @click="linkSocket">连接</p>
          <input type="text" v-model="socketId" />
        </div>
        <!-- <div class="gb">
          <el-avatar :src="avatar.nb"></el-avatar>
          <span>100赞</span>
          <el-avatar :src="avatar.break" class="last"></el-avatar>
          <span>20踩</span>
        </div>-->
      </div>
      <div class="rightWrap">
        <div class="recommendKey">
          <el-button size="mini" plain v-for="item in keyWordsInitData" :key="item.id">{{item.name}}</el-button>
        </div>
        <div class="recommendArticle" v-if="relationData.length > 1">
          <p>相关文章</p>
          <div
            class="li"
            @click="goToDes(item.id)"
            v-for="item in relationData"
            :key="item.id"
            v-show="Number($route.params.id) !== item.id"
          >
            <el-link :underline="false">{{item.title}}</el-link>
            <el-divider></el-divider>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
import MarkdownItVue from "markdown-it-vue";
import Header from "@/components/Header.vue";
import "markdown-it-vue/dist/markdown-it-vue.css";
export default {
  components: {
    MarkdownItVue,
    Header
  },
  data() {
    return {
      content: "",
      id: "",
      socketId: "",
      bg: {
        backgroundImage: "url(" + require("../../assets/dot.png") + ")",
        backgroundRepeat: "repeat"
      },
      avatar: {
        break: require("../../assets/break.png"),
        nb: require("../../assets/nb.png")
      },
      keyWordsInitData: "",
      relationData: [],
      content_type:'',
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.getInitData(to.params.id);
    next();
  },
  methods: {
    getInitData(id) {
      this.$axios
        .post("user/articleById", {
          id: id
        })
        .then(({ data: res }) => {
          if (res.status) {
            this.content_type = res.data.content_type
            this.content = res.data.content;
            if (res.data.keyWords)
              this.getRelationArticleData(res.data.keyWords);
          }
        });
    },
    //记录查看次数
    async setViewCount(id) {
      let { data: res } = await this.$axios.post("user/articleView", {
        id: id
      });
      sessionStorage.setItem("fskajsusu", true);
    },
    linkSocket() {
      this.$socket.emit("login", {
        username: "username",
        password: "password"
      });
    },
    getInitDataId() {
      this.$socket.emit("sayTo", {
        toId: this.socketId
      });
    },
    getKeyWordsData() {
      this.$axios.get("/user/keyWords").then(({ data: res }) => {
        if (res.status) {
          this.keyWordsInitData = res.data;
        }
      });
    },
    getRelationArticleData(keyWords) {
      //相关文章
      this.$axios
        .post("/user/relationArticle", {
          keyWords: keyWords
        })
        .then(({ data: res }) => {
          if (res.status) {
            this.relationData = res.data;
          }
        });
    },
    goToDes(id) {
      // 相关文章点击切换文章
      this.$router.replace({
        path: `/article/${id}`
      });
    }
  },
  created() {
    // 获取关键字
    this.getKeyWordsData();
    let that = this;
    let id = this.$route.params.id;
    this.id = id;
    this.getInitData(id);
    let flag = sessionStorage.getItem("fskajsusu");
    if (!flag) {
      this.setViewCount(id);
    }
    //接收服务端的信息
    this.sockets.subscribe("relogin", data => {
      console.log(data, "relogin");
    });
    //从服务端获取当前socket连接的用户id
    this.sockets.subscribe("reId", data => {
      that.socketId = data.msg;
    });
  },
  mounted() {
    // this.getSerchData();
  }
};
</script>
<style lang="stylus" scoped>
.el-container
  background-color: #EDEDED
  .el-header
    background-color: #ffffff
  .el-main
    padding: 0
    width: 80%
    margin: 1rem auto
    display: flex
    overflow-x: hidden
    .markdown
      background-color: #ffffff
      width: 70%
      flex-shrink: 0
      position: relative
      .md-body
        padding: 2%
      .gb
        display: inline-flex
        flex-direction: column
        position: absolute
        bottom: 20%
        right: -6rem
        .el-avatar
          background: none
          width: 30px
          height: 30px
          border-radius: 0
          cursor: pointer
        .last
          margin-top: 1rem
        span
          text-align: center
    .rightWrap
      margin-left: 1%
      flex-grow: 1
      .recommendKey
        background-color: #ffffff
        display: inline-flex
        flex-wrap: wrap
        padding: 0.5rem
        .el-button
          margin: 0.1em
      .recommendArticle
        margin-top: 1rem
        padding: 0.5rem 0.5rem 1rem 0.5rem
        font-size: 1.4rem
        display: flex
        flex-direction: column
        background-color: #ffffff
        .li
          &:last-child
            .el-divider
              display: none
          .el-link
            display: -webkit-box !important
            -webkit-box-orient: vertical
            -webkit-line-clamp: 2
            overflow: hidden
            -webkit-box-align: start
            -moz-box-align: start
            padding: 0 0.5rem
          .el-divider
            margin: 0
</style>
