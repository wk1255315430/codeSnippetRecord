<template>
  <el-container>
    <Header />
    <el-main>
      <div class="markdown">
        <markdown-it-vue class="md-body" :content="content" />
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
      </div>
      <div class="rightWrap">
        <div class="recommendKey">
          <el-button size="mini" plain v-for="item in keyWordsInitData" :key="item.id">{{item.name}}</el-button>
        </div>
        <div class="recommendArticle">
          <el-link :underline="false">微信小程序使用字体图标</el-link>
          <el-divider></el-divider>
          <el-link :underline="false">微信小程序使用字体图标</el-link>
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
      keyWordsInitData: "",
      relationData: ""
    };
  },
  methods: {
    getInitData(id) {
      this.$axios
        .post("user/articleById", {
          id: id
        })
        .then(({ data: res }) => {
          if (res.status) {
            this.content = res.data.content;
            if (res.data.keyWords)
              this.getRelationArticleData(res.data.keyWords);
          }
        });
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
    }
  },
  created() {
    // 获取关键字
    this.getKeyWordsData();
    let that = this;
    let id = this.$route.params.id;
    this.id = id;
    this.getInitData(id);
    //接收服务端的信息
    this.sockets.subscribe("relogin", data => {
      console.log(data, "relogin");
    });
    //从服务端获取当前socket连接的用户id
    this.sockets.subscribe("reId", data => {
      that.socketId = data.msg;
    });
    // this.sockets.unsubscribe('reId');
    // this.sockets.unsubscribe('relogin');
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
      .md-body
        padding: 2%
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
        height: 100px
        border: 1px solid red
        margin-top: 1rem
        font-size: 1.4rem
        display: flex
        flex-direction: column
        .el-link
          display: -webkit-box !important
          -webkit-box-orient: vertical
          -webkit-line-clamp: 2
          overflow: hidden
          -webkit-box-align: start 
          -moz-box-align:start
          padding 0 .5rem
</style>
